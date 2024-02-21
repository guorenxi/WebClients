import type { PropsWithChildren, ReactNode } from 'react';
import { type FC, type ReactElement } from 'react';

import { itemTypeToSubThemeClassName } from '@proton/pass/components/Layout/Theme/types';
import { type ItemType } from '@proton/pass/types';

import { Panel } from './Panel';
import { PanelHeader } from './PanelHeader';

type Props = {
    title: ReactNode;
    type: ItemType;
    actions?: ReactElement[];
};

export const ItemHistoryPanel: FC<PropsWithChildren<Props>> = ({ children, title, actions, type }) => {
    return (
        <Panel className={itemTypeToSubThemeClassName[type]} header={<PanelHeader title={title} actions={actions} />}>
            {children}
        </Panel>
    );
};
