import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { OnchainTransactionBuilder } from '.';
import { WasmTxBuilder } from '../../../../pkg';
import { mockUseOnchainWalletContext, walletsWithAccountsWithBalanceAndTxs } from '../../../tests';
import * as useOnchainTransactionBuilderModule from './useOnchainTransactionBuilder';

describe('OnchainTransactionBuilder', () => {
    let helper: ReturnType<typeof useOnchainTransactionBuilderModule.useOnchainTransactionBuilder>;

    const mockUseBitcoinReceive = vi.spyOn(useOnchainTransactionBuilderModule, 'useOnchainTransactionBuilder');

    const [testWallet] = walletsWithAccountsWithBalanceAndTxs;
    const [testAccount] = testWallet.accounts;

    beforeEach(() => {
        mockUseOnchainWalletContext();

        helper = {
            walletAndAccount: { wallet: testWallet, account: testAccount },
            handleSelectWalletAndAccount: vi.fn(),
            addRecipient: vi.fn(),
            updateRecipient: vi.fn(),
            updateRecipientAmountToMax: vi.fn(),
            removeRecipient: vi.fn(),
            updateTxBuilder: vi.fn(),
            createPsbt: vi.fn(),
            erasePsbt: vi.fn(),
            signAndBroadcastPsbt: vi.fn(),
            broadcastedTxId: undefined,
            loadingBroadcast: false,
            finalPsbt: undefined,
            txBuilder: new WasmTxBuilder(),
        };

        mockUseBitcoinReceive.mockReturnValue({ ...helper });
    });

    describe('when a wallet is selected', () => {
        it('should correctly call handler', async () => {
            render(<OnchainTransactionBuilder />);

            const walletSelector = screen.getByTestId('wallet-selector');
            await act(() => userEvent.click(walletSelector));

            const options = screen.getAllByTestId('wallet-selector-option');
            expect(options).toHaveLength(3);
            await fireEvent.click(options[1]);

            expect(helper.handleSelectWalletAndAccount).toHaveBeenCalledTimes(1);
            expect(helper.handleSelectWalletAndAccount).toHaveBeenCalledWith({
                wallet: walletsWithAccountsWithBalanceAndTxs[1],
            });
        });
    });

    describe('when selected wallet is of type `onchain`', () => {
        beforeEach(() => {
            const [testWallet] = walletsWithAccountsWithBalanceAndTxs;
            const [testAccount] = testWallet.accounts;

            mockUseBitcoinReceive.mockReturnValue({
                ...helper,
                walletAndAccount: { wallet: testWallet, account: testAccount },
            });

            render(<OnchainTransactionBuilder />);
        });

        it('should display account selector', () => {
            expect(screen.getByTestId('account-selector')).toBeInTheDocument();
        });

        describe('when a account is selected', () => {
            it('should correctly call handler', async () => {
                const accountSelector = screen.getByTestId('account-selector');
                await act(() => userEvent.click(accountSelector));

                const options = screen.getAllByTestId('account-selector-option');
                expect(options).toHaveLength(2);
                await fireEvent.click(options[1]);

                expect(helper.handleSelectWalletAndAccount).toHaveBeenCalledTimes(1);
                expect(helper.handleSelectWalletAndAccount).toHaveBeenCalledWith({
                    account: walletsWithAccountsWithBalanceAndTxs[0].accounts[1],
                });
            });
        });
    });
});
