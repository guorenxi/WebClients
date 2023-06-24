import { type ForwardRefRenderFunction, forwardRef } from 'react';

import { c } from 'ttag';

import { CircleLoader } from '@proton/atoms/CircleLoader';
import { Icon } from '@proton/components/components';
import type { MaybeNull } from '@proton/pass/types';
import { WorkerStatus } from '@proton/pass/types';
import { PassIcon } from '@proton/pass/types/data/pass-icon';
import { pixelEncoder } from '@proton/pass/utils/dom';
import { FORK_TYPE } from '@proton/shared/lib/authentication/ForkInterface';
import { BRAND_NAME, PASS_APP_NAME } from '@proton/shared/lib/constants';

import type { IFrameMessage } from '../../../../../content/types';
import { DropdownAction, type DropdownSetActionPayload } from '../../../../../content/types';
import { useAccountFork } from '../../../../../shared/hooks';
import { AliasAutoSuggest } from '../views/AliasAutoSuggest';
import { ItemsList } from '../views/ItemsList';
import { PasswordAutoSuggest } from '../views/PasswordAutoSuggest';
import { DROPDOWN_ITEM_HEIGHT, DropdownItem } from './DropdownItem';

type Props = {
    state: MaybeNull<DropdownSetActionPayload>;
    status: WorkerStatus;
    loggedIn: boolean;
    onClose?: () => void;
    onLoad?: () => void;
    onMessage?: (message: IFrameMessage) => void;
};

const DropdownSwitchRender: ForwardRefRenderFunction<HTMLDivElement, Props> = (
    { state, loggedIn, status, onClose, onLoad, onMessage },
    ref
) => {
    const accountFork = useAccountFork();

    return (
        <div
            ref={ref}
            className="min-h-custom bg-norm relative"
            style={{ '--min-h-custom': pixelEncoder(DROPDOWN_ITEM_HEIGHT) }}
        >
            {(() => {
                if (state === null) return <CircleLoader className="absolute absolute-center m-auto" />;

                if (status === WorkerStatus.LOCKED) {
                    return (
                        <DropdownItem
                            onClick={onClose}
                            title={c('Title').t`${PASS_APP_NAME} locked`}
                            subTitle={c('Info').t`Unlock with your pin`}
                            icon={PassIcon.LOCKED_DROPDOWN}
                        />
                    );
                }

                if (!loggedIn) {
                    return (
                        <DropdownItem
                            onClick={async () => {
                                onClose?.();
                                await accountFork(FORK_TYPE.SWITCH);
                            }}
                            subTitle={
                                <>
                                    {c('Info').t`Enable ${PASS_APP_NAME} by connecting your ${BRAND_NAME} account`}
                                    <Icon className="ml-1" name="arrow-out-square" />
                                </>
                            }
                            icon={PassIcon.DISABLED}
                            autogrow
                        />
                    );
                }

                switch (state.action) {
                    case DropdownAction.AUTOFILL:
                        return state.items.length > 0 ? (
                            <ItemsList items={state.items} needsUpgrade={state.needsUpgrade} onMessage={onMessage} />
                        ) : (
                            <DropdownItem
                                icon={PassIcon.ACTIVE}
                                onClick={onClose}
                                title={PASS_APP_NAME}
                                subTitle={c('Info').t`No login found`}
                            />
                        );

                    case DropdownAction.AUTOSUGGEST_PASSWORD:
                        return <PasswordAutoSuggest onMessage={onMessage} />;

                    case DropdownAction.AUTOSUGGEST_ALIAS:
                        return (
                            <AliasAutoSuggest
                                prefix={state.prefix}
                                domain={state.domain}
                                onOptions={onLoad}
                                onMessage={onMessage}
                            />
                        );
                }
            })()}
        </div>
    );
};

export const DropdownSwitch = forwardRef(DropdownSwitchRender);
