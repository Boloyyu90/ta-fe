// src/features/exam-sessions/hooks/useResultDetail.ts
import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { ExamSessionDetailResponse } from '../types/exam-sessions.types';

/**
 * Hook to fetch result detail
 * GET /api/v1/results/:id
 */
export function useResultDetail(sessionId: number) {
    return useQuery<ExamSessionDetailResponse>({
        queryKey: ['result-detail', sessionId],
        queryFn: () => examSessionsApi.getResultDetail(sessionId),
        enabled: !!sessionId,
    });
}