// src/features/proctoring/hooks/useProctoringEvents.ts
import { useQuery } from '@tanstack/react-query';
import { proctoringApi } from '../api/proctoring.api';
import type { ProctoringEventsResponse, ProctoringEventsParams } from '../types/proctoring.types';

interface UseProctoringEventsOptions extends ProctoringEventsParams {
    isAdmin?: boolean;
}

export function useProctoringEvents(
    sessionId: number,
    options: UseProctoringEventsOptions = {}
) {
    const { isAdmin = false, page, limit, eventType, severity } = options;

    const params: ProctoringEventsParams = {
        page,
        limit,
        eventType,
        severity,
    };

    return useQuery<ProctoringEventsResponse>({
        queryKey: ['proctoring-events', sessionId, isAdmin, params],
        queryFn: () =>
            isAdmin
                ? proctoringApi.getEventsAdmin(sessionId, params)
                : proctoringApi.getEvents(sessionId, params),
        staleTime: 1000 * 30, // 30 seconds
    });
}