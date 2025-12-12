/**
 * Hook to fetch proctoring events for a session
 */

import { useQuery } from '@tanstack/react-query';
import { proctoringApi } from '../api/proctoring.api';
import type {
    ProctoringEventsQueryParams,
    ProctoringEventsResponse,
} from '../types/proctoring.types';

export function useProctoringEvents(
    sessionId: number,
    params?: ProctoringEventsQueryParams,
    enabled = true
) {
    return useQuery<ProctoringEventsResponse, Error>({
        queryKey: ['proctoring-events', sessionId, params],
        queryFn: () => proctoringApi.getEvents(sessionId, params || {}),
        enabled: enabled && sessionId > 0,
        refetchInterval: 5000, // Poll every 5 seconds during exam
        staleTime: 1000,
    });
}

export default useProctoringEvents;