import type { PropsWithChildren } from 'react';
import { type FC, type ReactElement } from 'react';
import { useSelector } from 'react-redux';

import { c } from 'ttag';

import { Button } from '@proton/atoms';
import { Icon } from '@proton/components';
import { DropdownMenuButton } from '@proton/pass/components/Layout/Dropdown/DropdownMenuButton';
import { QuickActionsDropdown } from '@proton/pass/components/Layout/Dropdown/QuickActionsDropdown';
import { itemTypeToSubThemeClassName } from '@proton/pass/components/Layout/Theme/types';
import { useSpotlight } from '@proton/pass/components/Spotlight/SpotlightProvider';
import { VaultTag } from '@proton/pass/components/Vault/VaultTag';
import { VAULT_ICON_MAP } from '@proton/pass/components/Vault/constants';
import type { ItemViewProps } from '@proton/pass/components/Views/types';
import { UpsellRef } from '@proton/pass/constants';
import { useFeatureFlag } from '@proton/pass/hooks/useFeatureFlag';
import { EXTENSION_BUILD } from '@proton/pass/lib/client';
import { isMonitored, isPinned, isTrashed } from '@proton/pass/lib/items/item.predicates';
import { isPaidPlan } from '@proton/pass/lib/user/user.predicates';
import { isVaultMemberLimitReached } from '@proton/pass/lib/vaults/vault.predicates';
import { itemPinRequest, itemUnpinRequest } from '@proton/pass/store/actions/requests';
import { selectAllVaults, selectPassPlan, selectRequestInFlight } from '@proton/pass/store/selectors';
import { type ItemType, ShareRole } from '@proton/pass/types';
import { PassFeature } from '@proton/pass/types/api/features';
import { UserPassPlan } from '@proton/pass/types/api/plan';

import { Panel } from './Panel';
import { PanelHeader } from './PanelHeader';

type Props = {
    /** extra actions visible on the panel header */
    actions?: ReactElement[];
    /** extra quick actions in the actions dropdown menu */
    quickActions?: ReactElement[];
    type: ItemType;
} & ItemViewProps;

export const ItemViewPanel: FC<PropsWithChildren<Props>> = ({
    actions = [],
    children,
    quickActions = [],
    revision,
    type,
    vault,
    handleDeleteClick,
    handleDismissClick,
    handleEditClick,
    handleHistoryClick,
    handleInviteClick,
    handleManageClick,
    handleMoveToTrashClick,
    handleMoveToVaultClick,
    handlePinClick,
    handleRestoreClick,
    handleRetryClick,
    handleSecureLinkClick,
    handleToggleFlagsClick,
}) => {
    const { shareId, itemId, data, optimistic, failed } = revision;
    const { name } = data.metadata;
    const trashed = isTrashed(revision);
    const pinned = isPinned(revision);

    const vaults = useSelector(selectAllVaults);
    const plan = useSelector(selectPassPlan);
    const secureLinkEnabled = useFeatureFlag(PassFeature.PassPublicLinkV1);
    const sharingEnabled = useFeatureFlag(PassFeature.PassSharingV1);
    const pinningEnabled = useFeatureFlag(PassFeature.PassPinningV1);
    const historyEnabled = useFeatureFlag(PassFeature.PassItemHistoryV1);
    const monitorEnabled = useFeatureFlag(PassFeature.PassMonitor) && !EXTENSION_BUILD;
    const monitored = isMonitored(revision);

    const hasMultipleVaults = vaults.length > 1;
    const { shareRoleId, shared, owner } = vault;
    const showVaultTag = hasMultipleVaults || shared;
    const readOnly = shareRoleId === ShareRole.READ;
    const sharedReadOnly = shared && readOnly;
    const spotlight = useSpotlight();

    const pinInFlight = useSelector(selectRequestInFlight(itemPinRequest(shareId, itemId)));
    const unpinInFlight = useSelector(selectRequestInFlight(itemUnpinRequest(shareId, itemId)));
    const canTogglePinned = !(pinInFlight || unpinInFlight);

    const monitorActions = monitorEnabled && !trashed && (
        <DropdownMenuButton
            disabled={optimistic}
            onClick={handleToggleFlagsClick}
            icon={monitored ? 'eye-slash' : 'eye'}
            label={monitored ? c('Action').t`Exclude from monitoring` : c('Action').t`Include in monitoring`}
        />
    );

    return (
        <Panel
            className={itemTypeToSubThemeClassName[type]}
            header={
                <PanelHeader
                    title={<h2 className="text-2xl text-bold text-ellipsis mb-0-5">{name}</h2>}
                    actions={(() => {
                        if (failed) {
                            return [
                                <Button
                                    key="dismiss-item-button"
                                    pill
                                    className="mr-1"
                                    color="danger"
                                    shape="outline"
                                    onClick={handleDismissClick}
                                >
                                    {c('Action').t`Dismiss`}
                                </Button>,
                                <Button key="retry-item-button" pill color="norm" onClick={handleRetryClick}>
                                    {c('Action').t`Retry`}
                                </Button>,
                            ];
                        }

                        if (trashed) {
                            return [
                                <QuickActionsDropdown
                                    key="item-quick-actions-dropdown"
                                    color="weak"
                                    shape="solid"
                                    disabled={optimistic}
                                >
                                    <DropdownMenuButton
                                        onClick={handleRestoreClick}
                                        label={c('Action').t`Restore item`}
                                        icon="arrows-rotate"
                                        disabled={sharedReadOnly}
                                    />

                                    <DropdownMenuButton
                                        onClick={handleDeleteClick}
                                        label={c('Action').t`Delete permanently`}
                                        icon="trash-cross"
                                        disabled={sharedReadOnly}
                                    />

                                    {monitorActions}
                                </QuickActionsDropdown>,
                            ];
                        }

                        return [
                            <Button
                                className="flex text-sm"
                                key="edit-item-button"
                                pill
                                shape="solid"
                                color="norm"
                                onClick={handleEditClick}
                                disabled={optimistic || readOnly}
                            >
                                <Icon name="pencil" className="mr-1" />
                                <span>{c('Action').t`Edit`}</span>
                            </Button>,

                            ...actions,

                            <QuickActionsDropdown key="share-item-button" color="weak" shape="solid" icon="users-plus">
                                {secureLinkEnabled && type !== 'alias' && (
                                    <DropdownMenuButton
                                        onClick={
                                            plan === UserPassPlan.FREE
                                                ? () =>
                                                      spotlight.setUpselling({
                                                          type: 'pass-plus',
                                                          upsellRef: UpsellRef.FREE_TRIAL,
                                                      })
                                                : handleSecureLinkClick
                                        }
                                        title={c('Action').t`Share secure link`}
                                        label={c('Action').t`Via secure link`}
                                        icon="link"
                                        disabled={!owner}
                                        extra={
                                            plan === UserPassPlan.FREE && (
                                                <Icon name="upgrade" size={3} color="var(--primary)" />
                                            )
                                        }
                                    />
                                )}
                                {sharingEnabled && !shared && (
                                    <DropdownMenuButton
                                        onClick={
                                            plan === UserPassPlan.FREE && isVaultMemberLimitReached(vault)
                                                ? () =>
                                                      spotlight.setUpselling({
                                                          type: 'pass-plus',
                                                          upsellRef: UpsellRef.LIMIT_SHARING,
                                                      })
                                                : handleInviteClick
                                        }
                                        title={c('Action').t`Share`}
                                        label={c('Action').t`Entire vault`}
                                        icon="folder-plus"
                                        disabled={optimistic || readOnly}
                                    />
                                )}
                                {shared && (
                                    <DropdownMenuButton
                                        onClick={handleManageClick}
                                        title={c('Action').t`See members`}
                                        label={c('Action').t`See members`}
                                        icon="users"
                                    />
                                )}
                            </QuickActionsDropdown>,

                            <QuickActionsDropdown
                                key="item-quick-actions-dropdown"
                                color="weak"
                                disabled={optimistic}
                                shape="solid"
                            >
                                {hasMultipleVaults && (
                                    <DropdownMenuButton
                                        onClick={handleMoveToVaultClick}
                                        label={c('Action').t`Move to another vault`}
                                        icon="folder-arrow-in"
                                        disabled={sharedReadOnly}
                                    />
                                )}

                                {quickActions}

                                {pinningEnabled && (
                                    <DropdownMenuButton
                                        onClick={handlePinClick}
                                        label={pinned ? c('Action').t`Unpin item` : c('Action').t`Pin item`}
                                        icon={pinned ? 'pin-angled-slash' : 'pin-angled'}
                                        disabled={optimistic || !canTogglePinned}
                                        loading={!canTogglePinned}
                                    />
                                )}

                                {historyEnabled && isPaidPlan(plan) && (
                                    <DropdownMenuButton
                                        onClick={handleHistoryClick}
                                        label={c('Action').t`View history`}
                                        icon={'clock-rotate-left'}
                                    />
                                )}

                                <DropdownMenuButton
                                    onClick={handleMoveToTrashClick}
                                    label={c('Action').t`Move to Trash`}
                                    icon="trash"
                                    disabled={sharedReadOnly}
                                />

                                {monitorActions}
                            </QuickActionsDropdown>,
                        ];
                    })()}
                    subtitle={
                        showVaultTag ? (
                            <VaultTag
                                title={vault.content.name}
                                color={vault.content.display.color}
                                count={vault.targetMembers}
                                shared={vault.shared}
                                icon={
                                    vault.content.display.icon
                                        ? VAULT_ICON_MAP[vault.content.display.icon]
                                        : 'pass-all-vaults'
                                }
                            />
                        ) : undefined
                    }
                />
            }
        >
            {children}
        </Panel>
    );
};
