import {
    initEvent,
    serverEvent,
    startLogoutListener,
    userSettingsThunk,
    userThunk,
    welcomeFlagsActions,
} from '@proton/account';
import * as bootstrap from '@proton/account/bootstrap';
import { getDecryptedPersistedState } from '@proton/account/persist/helper';
import { createCalendarModelEventManager } from '@proton/calendar';
import { initMainHost } from '@proton/cross-storage';
import { FeatureCode, fetchFeatures } from '@proton/features';
import createApi from '@proton/shared/lib/api/createApi';
import { getSilentApi } from '@proton/shared/lib/api/helpers/customConfig';
import { listenFreeTrialSessionExpiration } from '@proton/shared/lib/desktop/endOfTrialHelpers';
import { isElectronMail } from '@proton/shared/lib/helpers/desktop';
import { initElectronClassnames } from '@proton/shared/lib/helpers/initElectronClassnames';
import { initSafariFontFixClassnames } from '@proton/shared/lib/helpers/initSafariFontFixClassnames';
import { ProtonConfig } from '@proton/shared/lib/interfaces';
import noop from '@proton/utils/noop';

import locales from '../locales';
import { AccountState, extendStore, setupStore } from '../store/store';

const getAppContainer = () =>
    import(/* webpackChunkName: "MainContainer" */ './SetupMainContainer').then((result) => result.default);

export const bootstrapApp = async ({ config, signal }: { config: ProtonConfig; signal?: AbortSignal }) => {
    const pathname = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const api = createApi({ config });
    const silentApi = getSilentApi(api);
    const authentication = bootstrap.createAuthentication();
    bootstrap.init({ config, authentication, locales });
    initMainHost();
    initElectronClassnames();
    initSafariFontFixClassnames();

    const appName = config.APP_NAME;

    if (isElectronMail) {
        listenFreeTrialSessionExpiration(appName, authentication, api);
    }

    startLogoutListener();

    const run = async () => {
        const appContainerPromise = getAppContainer();
        const sessionResult = await bootstrap.loadSession({ api, authentication, pathname, searchParams });

        const history = bootstrap.createHistory({ sessionResult, pathname });
        const unleashClient = bootstrap.createUnleash({ api: silentApi });
        const unleashPromise = bootstrap.unleashReady({ unleashClient }).catch(noop);

        const user = sessionResult.session?.User;
        extendStore({ config, api, authentication, history, unleashClient });

        let persistedState = await getDecryptedPersistedState<Partial<AccountState>>({
            authentication,
            user,
        });

        const store = setupStore({ preloadedState: persistedState?.state, mode: 'default' });
        const dispatch = store.dispatch;

        if (user) {
            dispatch(initEvent({ User: user }));
        }

        const cacheOptions = {
            cache: 'stale',
        } as const;

        const loadUser = async () => {
            const [user, userSettings, features] = await Promise.all([
                dispatch(userThunk(cacheOptions)),
                dispatch(userSettingsThunk(cacheOptions)),
                dispatch(fetchFeatures([FeatureCode.EarlyAccessScope], cacheOptions)),
            ]);

            dispatch(welcomeFlagsActions.initial(userSettings));

            const [scopes] = await Promise.all([
                bootstrap.initUser({ appName, user, userSettings }),
                bootstrap.loadLocales({ userSettings, locales }),
            ]);

            return { user, userSettings, earlyAccessScope: features[FeatureCode.EarlyAccessScope], scopes };
        };

        const userPromise = loadUser();
        const evPromise = bootstrap.eventManager({ api: silentApi, eventID: persistedState?.eventID });

        if (persistedState?.state?.userSettings?.value) {
            // Force fetch user settings in background in case it is persisted because entities like referral program have tricky
            // eligibility conditions which don't properly propagate through the event loop. E.g. unleash feature flags which are enabled or disabled.
            dispatch(userSettingsThunk({ cache: 'no-cache' })).catch(noop);
        }

        if (persistedState?.state?.user?.value && !user) {
            // Force fetching user in background in case it is persisted.
            // We need to keep the user fresh, because the payments migration relies on the user being up-to-date,
            // and the event loop isn't always enough in this particular case.
            // Probably, this workaround can be disabled after the payments migration is fully completed,
            // e.g. no payments code rely on the user being up-to-date. The condition might be softer,
            // please check with the payments team.
            dispatch(userThunk({ cache: 'no-cache' })).catch(noop);
        }

        await unleashPromise;
        await bootstrap.loadCrypto({ appName, unleashClient });
        const [MainContainer, userData, eventManager] = await Promise.all([
            appContainerPromise,
            userPromise,
            evPromise,
        ]);
        // Needs everything to be loaded.
        await bootstrap.postLoad({ appName, authentication, ...userData, history });

        const calendarModelEventManager = createCalendarModelEventManager({ api: silentApi });

        extendStore({ eventManager, calendarModelEventManager });
        const unsubscribeEventManager = eventManager.subscribe((event) => {
            dispatch(serverEvent(event));
        });
        eventManager.start();

        if (persistedState?.eventID) {
            setTimeout(() => {
                eventManager.call();
                // If we're resuming a session, we'd like to call the ev to get up-to-speed.
                // This is in an arbitrary timeout since there are some consumers who subscribe through react useEffects triggered later through the app.
            }, 350);
        }

        bootstrap.onAbort(signal, () => {
            unsubscribeEventManager();
            eventManager.reset();
            unleashClient.stop();
            store.unsubscribe();
        });

        dispatch(bootstrap.bootstrapEvent({ type: 'complete' }));

        return {
            ...userData,
            store,
            eventManager,
            unleashClient,
            history,
            MainContainer,
        };
    };

    return bootstrap.wrap({ appName, authentication }, run());
};
