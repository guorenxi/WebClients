import { useCallback, useState } from 'react';

import { c } from 'ttag';

import { useNotifications } from '@proton/components/hooks';
import useLoading from '@proton/hooks/useLoading';
import { SECOND } from '@proton/shared/lib/constants';

import { WasmBlockchain, WasmPartiallySignedTransaction, WasmTxBuilder } from '../../pkg';
import { WalletAndAccountSelectorValue } from '../atoms';
import { useOnchainWalletContext } from '../contexts';
import { tryHandleWasmError } from '../utils';

export const usePsbt = ({
    walletAndAccount,
    txBuilder,
}: {
    walletAndAccount: WalletAndAccountSelectorValue;
    txBuilder: WasmTxBuilder;
}) => {
    const { syncSingleWalletAccountBlockchainData, network } = useOnchainWalletContext();
    const { createNotification } = useNotifications();
    const [loadingBroadcast, withLoadingBroadcast] = useLoading();
    const [finalPsbt, setFinalPsbt] = useState<WasmPartiallySignedTransaction>();
    const [broadcastedTxId, setBroadcastedTxId] = useState<string>();

    const createPsbt = useCallback(async () => {
        const { account } = walletAndAccount;
        if (account) {
            try {
                const psbt = await txBuilder.createPsbt(network);
                setFinalPsbt(psbt);
            } catch (err) {
                const msg = tryHandleWasmError(err);
                if (msg) {
                    createNotification({ text: msg, type: 'error' });
                }
            }
        }
    }, [walletAndAccount, txBuilder, network, createNotification]);

    const signAndBroadcastPsbt = () => {
        void withLoadingBroadcast(async () => {
            const { wallet, account } = walletAndAccount;
            if (!finalPsbt || !wallet || !account || !walletAndAccount) {
                return;
            }

            const signed = await finalPsbt.sign(account?.wasmAccount, network);

            try {
                const txId = await new WasmBlockchain().broadcastPsbt(signed);
                setBroadcastedTxId(txId);

                setTimeout(() => {
                    void syncSingleWalletAccountBlockchainData(wallet.Wallet.ID, account.ID);
                }, 1 * SECOND);
            } catch (err) {
                const msg = tryHandleWasmError(err);
                createNotification({ text: msg ?? c('Wallet Send').t`Could not broadcast transaction`, type: 'error' });
            }
        });
    };

    const erasePsbt = useCallback(() => {
        setFinalPsbt(undefined);
    }, []);

    return { finalPsbt, loadingBroadcast, broadcastedTxId, createPsbt, erasePsbt, signAndBroadcastPsbt };
};
