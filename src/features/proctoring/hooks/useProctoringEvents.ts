// src/features/proctoring/hooks/useProctoringEvents.ts

/**
 * Hook to fetch proctoring events for a session
 *
 * ✅ Properly exported
 * ✅ Correct return type
 */

import { useQuery } from '@tanstack/react-query';
import { proctoringApi } from '../api/proctoring.api';
import type { ProctoringEventsParams } from '../types/proctoring.types';

export function useProctoringEvents(
    sessionId: number,
    params?: ProctoringEventsParams,
    enabled = true
) {
    return useQuery({
        queryKey: ['proctoring-events', sessionId, params],
        queryFn: () => proctoringApi.getEvents(sessionId, params || {}),
        enabled: enabled && sessionId > 0,
        refetchInterval: 5000, // Poll every 5 seconds
        staleTime: 1000,
    });
}