import { createAction } from '@reduxjs/toolkit';

import type { ShareEventResponse } from '@proton/pass/store/sagas/events/channel.share';
import type { UserEvent } from '@proton/pass/types/api';

export const shareEvent = createAction<ShareEventResponse & { shareId: string }>('api::event::share');
export const userEvent = createAction<UserEvent>('api::event::user');
