import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { c } from 'ttag';

import { useNotifications } from '@proton/components/hooks';
import { MINUTE, SECOND } from '@proton/shared/lib/constants';
import isTruthy from '@proton/utils/isTruthy';

import { WasmAccount, WasmDerivationPath, WasmPagination, WasmWallet, WasmWalletAccount } from '../../pkg';
import { useBitcoinNetwork } from '../store/hooks';
import {
    BlockchainAccountRecord,
    BlockchainWalletRecord,
    IWasmWallet,
    WalletWithAccountsWithBalanceAndTxs,
} from '../types';
import { tryHandleWasmError } from '../utils/wasm/errors';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const syncAccount = async (_wasmAccount: WasmAccount) => {
    // TMP comment this to avoid rate limit on esplora API
    // const wasmChain = new WasmBlockchain(undefined, 1);
    // return wasmChain.fullSync(wasmAccount);
};

export type SyncingMetadata = { syncing: boolean; count: number; lastSyncing: number };

export const useBlockchainSyncing = (wallets?: IWasmWallet[]) => {
    const [network] = useBitcoinNetwork();

    // Here undefined means there is no wallet loaded yet, it is different from {} which means that there is no wallet TO BE loaded
    const [blockchainWalletRecord, setBlockchainWalletRecord] = useState<BlockchainWalletRecord | undefined>();
    const [syncingMetatadaByAccountId, setSyncingMetatadaByAccountId] = useState<
        Partial<Record<string, SyncingMetadata>>
    >({});

    // We use refs coupled to the state to deps from the syncing loop
    const syncingMetatadaByAccountIdRef = useRef<Partial<Record<string, SyncingMetadata>>>({});
    useEffect(() => {
        syncingMetatadaByAccountIdRef.current = syncingMetatadaByAccountId;
    }, [syncingMetatadaByAccountId]);

    const blockchainWalletRecordRef = useRef<Partial<BlockchainWalletRecord | undefined>>(undefined);
    useEffect(() => {
        blockchainWalletRecordRef.current = blockchainWalletRecord;
    }, [blockchainWalletRecord]);

    const currentTimeoutId = useRef<NodeJS.Timeout>();

    const { createNotification } = useNotifications();

    const handleError = useCallback(
        (error: unknown, defaultMsg = c('Wallet').t`An error occured`) => {
            console.error(error);
            createNotification({ text: tryHandleWasmError(error) ?? defaultMsg });
        },
        [createNotification]
    );

    const getAccountData = async (account: WasmWalletAccount, wasmAccount: WasmAccount) => {
        const balance = await wasmAccount.getBalance();
        const pagination = new WasmPagination(0, 10);
        const transactions = await wasmAccount.getTransactions(pagination);
        const utxos = await wasmAccount.getUtxos();

        return {
            ...account,
            balance,
            transactions,
            utxos,
            wasmAccount,
        };
    };

    const addNewSyncing = useCallback((walletAccountID: string) => {
        setSyncingMetatadaByAccountId((prev) => ({
            ...prev,
            [walletAccountID]: {
                ...prev[walletAccountID],
                syncing: true,
                lastSyncing: Date.now(),
                count: (prev[walletAccountID]?.count ?? 0) + 1,
            },
        }));
    }, []);

    const removeSyncing = useCallback((walletAccountID: string) => {
        setSyncingMetatadaByAccountId((prev) => {
            const prevItem = prev[walletAccountID];

            return {
                ...prev,
                ...(prevItem && {
                    [walletAccountID]: {
                        ...prevItem,
                        syncing: false,
                    },
                }),
            };
        });
    }, []);

    const getUpdatedAccountDataWithMaybeSync = useCallback(
        async (account: WasmWalletAccount, wasmAccount: WasmAccount, shouldSync = false) => {
            const isAlreadySyncing = syncingMetatadaByAccountIdRef.current[account.ID]?.syncing;
            if (shouldSync && !isAlreadySyncing) {
                addNewSyncing(account.ID);
                try {
                    await syncAccount(wasmAccount);
                } catch (error) {
                    handleError(error);
                }

                removeSyncing(account.ID);
            }

            return getAccountData(account, wasmAccount);
        },
        // The 3 dependencies are assumed stable at render, so `getUpdatedAccountDataWithMaybeSync` should also be
        [addNewSyncing, handleError, removeSyncing]
    );

    const initAccountsBlockchainData = useCallback(async () => {
        if (!wallets || !network) {
            return;
        }

        const tmpWallets: BlockchainWalletRecord = {};
        for (const wallet of wallets) {
            try {
                const tmpAccounts: BlockchainAccountRecord = {};

                // TODO: support watch-only wallets
                if (!wallet.Wallet.Mnemonic) {
                    continue;
                }

                // TODO: handle passphrase wallets
                const wasmWallet = new WasmWallet(network, wallet.Wallet.Mnemonic, '');

                for (const account of wallet.WalletAccounts) {
                    try {
                        const accountKey = wasmWallet.addAccount(
                            account.ScriptType,
                            WasmDerivationPath.fromString(account.DerivationPath)
                        );

                        const wasmAccount = wasmWallet.getAccount(accountKey);

                        if (!wasmAccount) {
                            break;
                        }

                        tmpAccounts[account.ID] = await getAccountData(account, wasmAccount);
                    } catch (error) {
                        handleError(error);
                    }
                }

                tmpWallets[wallet.Wallet.ID] = { ...wallet, wasmWallet, accounts: { ...tmpAccounts } };
            } catch (error) {
                handleError(error);
            }
        }

        setBlockchainWalletRecord(tmpWallets);
    }, [handleError, network, wallets]);

    const syncSingleWalletAccountBlockchainData = useCallback(
        async (walletId: string, accountId: string, shouldSync = false) => {
            const account = blockchainWalletRecordRef.current?.[walletId]?.accounts[accountId];

            if (!account) {
                return;
            }

            const updated = await getUpdatedAccountDataWithMaybeSync(account, account.wasmAccount, shouldSync);

            setBlockchainWalletRecord((prev) => {
                const prevItem = prev?.[walletId];

                return {
                    ...prev,
                    ...(prevItem && {
                        [walletId]: {
                            ...prevItem,
                            accounts: {
                                ...prev?.[walletId]?.accounts,
                                [account.ID]: updated,
                            },
                        },
                    }),
                };
            });
        },
        [getUpdatedAccountDataWithMaybeSync]
    );

    const syncAllWalletAccountsBlockchainData = useCallback(
        async (walletId: string, shouldSync = false) => {
            const wallet = blockchainWalletRecordRef.current?.[walletId];

            if (!wallet) {
                return;
            }

            for (const account of Object.values(wallet.accounts).filter(isTruthy)) {
                await syncSingleWalletAccountBlockchainData(walletId, account.ID, shouldSync);
            }
        },
        [syncSingleWalletAccountBlockchainData]
    );

    const syncAllWalletsBlockchainData = useCallback(
        async (shouldSync = false) => {
            for (const wallet of Object.values(blockchainWalletRecordRef.current ?? {}).filter(isTruthy)) {
                await syncAllWalletAccountsBlockchainData(wallet.Wallet.ID, shouldSync);
            }
        },
        [syncAllWalletAccountsBlockchainData]
    );

    const pollAccountsBlockchainData = useCallback(async () => {
        currentTimeoutId.current = setTimeout(async () => {
            await syncAllWalletsBlockchainData(true);
            void pollAccountsBlockchainData();
        }, 10 * MINUTE);
    }, [syncAllWalletsBlockchainData]);

    useEffect(() => {
        void initAccountsBlockchainData();

        const ts = setTimeout(() => {
            void syncAllWalletsBlockchainData(true);
        }, 1 * SECOND);
        return () => {
            clearTimeout(ts);
        };
    }, [initAccountsBlockchainData, syncAllWalletsBlockchainData]);

    useEffect(() => {
        void pollAccountsBlockchainData();

        return () => {
            if (currentTimeoutId.current) {
                clearTimeout(currentTimeoutId.current);
            }
        };
    }, [pollAccountsBlockchainData]);

    const walletsWithBalanceAndTxs: WalletWithAccountsWithBalanceAndTxs[] | undefined = useMemo(() => {
        if (!blockchainWalletRecord) {
            return undefined;
        }

        return Object.values(blockchainWalletRecord)
            .filter(isTruthy)
            .map((wallet) => {
                return { ...wallet, accounts: Object.values(wallet.accounts).filter(isTruthy) };
            });
    }, [blockchainWalletRecord]);

    return {
        syncingMetatadaByAccountId,
        walletsWithBalanceAndTxs,
        syncSingleWalletAccountBlockchainData,
        syncAllWalletAccountsBlockchainData,
        syncAllWalletsBlockchainData,
    };
};
