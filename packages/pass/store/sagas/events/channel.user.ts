/* eslint-disable @typescript-eslint/no-throw-literal, curly */
import { all, fork, put, select } from 'redux-saga/effects';

import { authentication } from '@proton/pass/auth';
import { PassCrypto } from '@proton/pass/crypto';
import { type Api, ChannelType, type ServerEvent, UserAccessGetResponse } from '@proton/pass/types';
import { notIn, prop } from '@proton/pass/utils/fp';
import { logId, logger } from '@proton/pass/utils/logger';
import { getLatestID } from '@proton/shared/lib/api/events';
import { INTERVAL_EVENT_TIMER } from '@proton/shared/lib/constants';
import type { Address } from '@proton/shared/lib/interfaces';

import { setUserPlan, syncIntent } from '../../actions';
import { selectAllAddresses, selectLatestEventId } from '../../selectors/user';
import type { WorkerRootSagaOptions } from '../../types';
import { eventChannelFactory } from './channel.factory';
import { channelEventsWorker, channelWakeupWorker } from './channel.worker';
import type { EventChannel } from './types';

function* onUserEvent(event: ServerEvent<ChannelType.USER>, { api }: EventChannel<ChannelType.USER>) {
    if (event.error) throw event.error;

    logger.info(`[ServerEvents::User] event ${logId(event.EventID!)}`);
    const { User: user } = event;

    /* if the subscription changes, refetch the user Plan */
    if (event.Subscription || event.Invoices) {
        yield fork(function* () {
            const accessResponse = (yield api({ url: `pass/v1/user/access`, method: 'post' })) as {
                Access?: UserAccessGetResponse | undefined;
            };

            if (accessResponse?.Access) {
                yield put(setUserPlan(accessResponse.Access.Plan));
            }
        });
    }

    /* if we get the user model from the event, check if
     * any new active user keys are available. We might be
     * dealing with a user re-activating a disabled user key
     * in which case we want to trigger a full data sync in
     * order to access any previously inactive shares */
    if (user) {
        const localUserKeyIds = (PassCrypto.getContext().userKeys ?? []).map(prop('ID'));
        const activeUserKeys = user.Keys.filter(({ Active }) => Active === 1);

        const keysUpdated =
            activeUserKeys.length !== localUserKeyIds.length ||
            activeUserKeys.some(({ ID }) => notIn(localUserKeyIds)(ID));

        if (keysUpdated) {
            logger.info(`[Saga::Events] Detected user keys update`);
            const keyPassword = authentication.getPassword();
            const addresses = (yield select(selectAllAddresses)) as Address[];
            yield PassCrypto.hydrate({ user, keyPassword, addresses });
            yield put(syncIntent({})); /* trigger a full data sync */
        }
    }
}

export const createUserChannel = (api: Api, eventID: string) =>
    eventChannelFactory<ChannelType.USER>({
        api,
        interval: INTERVAL_EVENT_TIMER,
        type: ChannelType.USER,
        eventID,
        onEvent: onUserEvent,
        onClose: () => logger.info(`[Saga::UserChannel] closing channel`),
    });

export function* userChannel(api: Api, options: WorkerRootSagaOptions) {
    logger.info(`[Saga::UserChannel] start polling for user events`);

    const eventID =
        ((yield select(selectLatestEventId)) as ReturnType<typeof selectLatestEventId>) ??
        ((yield api(getLatestID())) as { EventID: string }).EventID;

    const eventsChannel = createUserChannel(api, eventID);
    const events = fork(channelEventsWorker<ChannelType.USER>, eventsChannel, options);
    const wakeup = fork(channelWakeupWorker<ChannelType.USER>, eventsChannel);

    yield all([events, wakeup]);
}
