import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { c } from 'ttag';

import { useCalendarModelEventManager } from '@proton/components/containers';
import { useApi, useEventManager, useGetCalendarEventRaw, useUser } from '@proton/components/hooks';
import { defaultESContext, useEncryptedSearch } from '@proton/encrypted-search';
import { CalendarEventManager, CalendarEventsEventManager } from '@proton/shared/lib/interfaces/calendar/EventManager';

import { getESCallbacks } from '../helpers/encryptedSearch/encryptedSearchCalendarHelpers';
import { processCalendarEvents, processCoreEvents } from '../helpers/encryptedSearch/esUtils';
import {
    ESCalendarContent,
    ESCalendarMetadata,
    ESCalendarSearchParams,
    EncryptedSearchFunctionsCalendar,
} from '../interfaces/encryptedSearch';

interface EncryptedSearchLibrary extends EncryptedSearchFunctionsCalendar {
    isLibraryInitialized: boolean;
}

const EncryptedSearchLibraryContext = createContext<EncryptedSearchLibrary>({
    ...defaultESContext,
    isLibraryInitialized: false,
});
export const useEncryptedSearchLibrary = () => useContext(EncryptedSearchLibraryContext);

interface Props {
    calendarIDs: string[];
    children?: ReactNode;
}

const EncryptedSearchLibraryProvider = ({ calendarIDs, children }: Props) => {
    const api = useApi();
    const history = useHistory();
    const [{ ID: userID }] = useUser();
    const getCalendarEventRaw = useGetCalendarEventRaw();
    const { subscribe: coreSubscribe } = useEventManager();
    const { subscribe: calendarSubscribe } = useCalendarModelEventManager();

    const [isLibraryInitialized, setIsLibraryInitialized] = useState(false);

    const esCallbacks = getESCallbacks({
        api,
        calendarIDs,
        history,
        userID,
        getCalendarEventRaw,
    });

    const successMessage = c('Success').t`Calendar search activated`;

    const esLibraryFunctions = useEncryptedSearch<ESCalendarMetadata, ESCalendarSearchParams, ESCalendarContent>({
        refreshMask: 1,
        esCallbacks,
        successMessage,
    });

    // Core loop
    useEffect(() => {
        return coreSubscribe(
            async ({
                Calendars = [],
                Refresh = 0,
                EventID,
            }: {
                EventID: string;
                Calendars?: CalendarEventManager[];
                Refresh?: number;
            }) => {
                /**
                 * If we have `More` core events to handle, the application itself will take care of the pagination so this handler will automatically get called next.
                 */
                const esEvent = await processCoreEvents(userID, Calendars, Refresh, EventID, api, getCalendarEventRaw);
                return esLibraryFunctions.handleEvent(esEvent);
            }
        );
    }, []);

    // Calendars loop
    useEffect(() => {
        return calendarSubscribe(
            calendarIDs,
            async ({
                CalendarEvents = [],
                Refresh = 0,
                CalendarModelEventID,
            }: {
                CalendarModelEventID: string;
                CalendarEvents?: CalendarEventsEventManager[];
                Refresh?: number;
            }) => {
                /**
                 * If we have `More` calendar events (e.g: in case of a large import) to handle, the application itself will take care of the pagination so this handler will automatically get called next.
                 */
                const esEvent = await processCalendarEvents(
                    CalendarEvents,
                    Refresh,
                    userID,
                    CalendarModelEventID,
                    api,
                    getCalendarEventRaw
                );
                return esLibraryFunctions.handleEvent(esEvent);
            }
        );
    }, [calendarIDs]);

    useEffect(() => {
        const initializeLibrary = async () => {
            // TODO: error handling
            await esLibraryFunctions.initializeES();
            setIsLibraryInitialized(true);
        };

        void initializeLibrary();
    }, []);

    const value = { ...esLibraryFunctions, isLibraryInitialized };

    return <EncryptedSearchLibraryContext.Provider value={value}>{children}</EncryptedSearchLibraryContext.Provider>;
};

export default EncryptedSearchLibraryProvider;
