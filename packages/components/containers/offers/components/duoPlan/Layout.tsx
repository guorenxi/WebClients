import { useMemo } from 'react';

import { c } from 'ttag';

import { Button } from '@proton/atoms/Button';
import { Icon, Price } from '@proton/components/components';
import { usePlans, useUser } from '@proton/components/hooks';
import { APPS, CYCLE, PLANS } from '@proton/shared/lib/constants';
import { getAppSpace, getSpace } from '@proton/shared/lib/user/storage';
import percentage from '@proton/utils/percentage';

import OfferDisableButton from '../../components/shared/OfferDisableButton';
import OfferLoader from '../../components/shared/OfferLoader';
import hasOffer from '../../helpers/hasOffer';
import type { OfferLayoutProps } from '../../interface';
import sideImage from './right-image.svg';
import {
    getCTAContent,
    getInfos,
    getInfosUser,
    getRenews,
    getSavedAmount,
    getStorage,
    getSubTitle,
    getTitle,
} from './text';

import './DuoPlan.scss';

const roundAmount = (amount: number) => {
    return Math.round(amount / 100) * 100;
};

const Layout = (props: OfferLayoutProps) => {
    const [user] = useUser();
    const { maxSpace, usedSpace } = getAppSpace(getSpace(user), APPS.PROTONMAIL);
    const isUsingMoreThan80PercentStorage = percentage(maxSpace, usedSpace) > 80;
    const { offer, currency, onSelectDeal } = props;
    const [deal] = offer?.deals || [];
    const [plansResult] = usePlans();
    const plans = plansResult?.plans || [];
    const isCycleTwoYear = deal.cycle === CYCLE.TWO_YEARS;

    const savedAmount = useMemo(() => {
        if (isCycleTwoYear) {
            const duoPlan = plans.find((plan) => plan.Name === PLANS.DUO);
            const savedAmount2y = (duoPlan?.Pricing[CYCLE.MONTHLY] || 0) * deal.cycle - deal.prices?.withCoupon;
            return roundAmount(savedAmount2y);
        }

        const bundlePlan = plans.find((plan) => plan.Name === PLANS.BUNDLE); // Bundle = unlimited
        const savedAmount = (bundlePlan?.Pricing[deal.cycle] || 0) * 2 - deal.prices?.withCoupon;
        return roundAmount(savedAmount);
    }, [deal, plans, isCycleTwoYear]);

    const monthlyPrice = (
        <Price
            key="monthly-price"
            currency={currency}
            suffix={c('specialoffer: Offers').t`/ month`}
            isDisplayedInSentence
        >
            {deal.prices?.withCoupon / deal.cycle}
        </Price>
    );

    const savedPrice = (
        <Price key="saved-price" currency={currency} isDisplayedInSentence>
            {savedAmount}
        </Price>
    );

    const yearlyPrice = (
        <Price key="yearly-price" currency={currency} isDisplayedInSentence>
            {deal.prices?.withCoupon}
        </Price>
    );

    return hasOffer(props) ? (
        <div className="flex flex-row flex-nowrap w-full py-4" {...props}>
            <div className="flex-1 pt-4">
                <header>
                    <h1 className="lh120">{getTitle()}</h1>
                    <p className="h1 lh120">{getSubTitle(isUsingMoreThan80PercentStorage)}</p>
                    <ul className="unstyled mt-3 mb-5">
                        <li className="flex flex-nowrap flex-row mb-2">
                            <Icon name="users" className="shrink-0 mt-0.5 offer-feature-icon" />
                            <span className="flex-1 pl-2">{getInfosUser()}</span>
                        </li>
                        <li className="flex flex-nowrap flex-row mb-2">
                            <Icon name="storage" className="shrink-0 mt-0.5 offer-feature-icon" />
                            <span className="flex-1 pl-2">{getStorage()}</span>
                        </li>
                        <li className="flex flex-nowrap flex-row mb-2">
                            <Icon name="app-switch" className="shrink-0 mt-0.5 offer-feature-icon" />
                            <span className="flex-1 pl-2">{getInfos()}</span>
                        </li>
                    </ul>
                </header>

                <div className="my-5 flex flex-wrap gap-4 items-center offer-plan">
                    <Button
                        className="button button-promotion--pinkblue"
                        size="large"
                        type="button"
                        onClick={() => {
                            if (offer && deal) {
                                onSelectDeal(offer, deal, currency);
                            }
                        }}
                    >
                        {getCTAContent(monthlyPrice)}
                    </Button>
                    <div className="color-success text-semibold">{getSavedAmount(savedPrice)}</div>
                </div>

                <p className="text-sm">{getRenews(yearlyPrice, savedPrice, isCycleTwoYear)}</p>

                <div className="offer-disable-button-container mb-4">
                    <OfferDisableButton {...props} />
                </div>
            </div>
            <div className="offer-right-img-container flex-1 flex p-4">
                <img src={sideImage} alt="" className="m-auto" />
            </div>
        </div>
    ) : (
        <OfferLoader />
    );
};

export default Layout;
