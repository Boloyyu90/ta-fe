// src/features/exam-sessions/hooks/useResultDetail.ts

/**
 * Hook to fetch result detail
 *
 * ✅ Complete exam session with scores
 * ✅ For results detail page
 */

import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { ResultDetailPayload } from '../types/exam-sessions.types';

export function useResultDetail(sessionId: number, enabled = true) {
    return useQuery<ResultDetailPayload>({
        queryKey: ['result-detail', sessionId],
        queryFn: () => examSessionsApi.getResultDetail(sessionId),
        enabled: enabled && sessionId > 0,
        staleTime: 1000 * 60, // 1 minute
    });
}