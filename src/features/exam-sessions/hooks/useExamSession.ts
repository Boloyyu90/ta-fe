// src/features/exam-sessions/hooks/useExamSession.ts
import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { ExamSessionDetailResponse } from '../types/exam-sessions.types';

/**
 * Hook to fetch exam session details
 * GET /api/v1/exam-sessions/:id
 */
export function useExamSession(sessionId: number) {
    return useQuery<ExamSessionDetailResponse>({
        queryKey: ['exam-session', sessionId],
        queryFn: () => examSessionsApi.getExamSession(sessionId),
        enabled: !!sessionId,
    });
}