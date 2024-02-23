import React from 'react';

import { c } from 'ttag';

import { Button } from '@proton/atoms/Button';
import { Card } from '@proton/atoms/Card';
import { Pill } from '@proton/atoms/Pill';

import { WasmBitcoinUnit } from '../../../pkg';
import { BitcoinAmount } from '../../atoms';
import { useOnchainWalletContext } from '../../contexts';
import { WalletType } from '../../types/api';
import { getWalletBalance } from '../../utils';

interface Props {
    onAddWallet: () => void;
}

// TODO: change this when wallet settings API is ready
const fiatCurrency = 'USD';
const bitcoinUnit = WasmBitcoinUnit.BTC;

export const YourWalletsSection = ({ onAddWallet }: Props) => {
    const { wallets } = useOnchainWalletContext();

    return (
        <div className="mt-14">
            <h2 className="h4 text-semibold">{c('Wallet Dashboard').t`Your wallets`}</h2>

            <div className="grid-auto-fill mt-4 gap-4" style={{ '--min-grid-template-column-size': '16rem' }}>
                {wallets?.map((wallet) => {
                    return (
                        <Card
                            key={wallet.Wallet.ID}
                            data-testid="wallet-balance-card"
                            rounded
                            className="w-full bg-gradient-weak-norm border-weak py-3"
                        >
                            <div className="flex flex-row justify-space-between w-full">
                                <h3 className="text-lg max-w-3/5 text-ellipsis">{wallet.Wallet.Name}</h3>
                                {wallet.Wallet.Type === WalletType.OnChain ? (
                                    <Pill color="#12869F">Onchain</Pill>
                                ) : (
                                    <Pill color="#AD7406">Lightning</Pill>
                                )}
                            </div>

                            <BitcoinAmount
                                bitcoin={getWalletBalance(wallet)}
                                unit={bitcoinUnit}
                                fiat={fiatCurrency}
                                firstClassName="mt-6 text-2xl"
                                secondClassName="mb-1"
                            />
                        </Card>
                    );
                })}

                <Button
                    shape="outline"
                    color="weak"
                    fullWidth
                    className="border-weak flex"
                    onClick={() => {
                        onAddWallet();
                    }}
                >
                    <div className="m-auto color-primary">{c('Wallet Dashboard').t`Add wallet`}</div>
                </Button>
            </div>
        </div>
    );
};
