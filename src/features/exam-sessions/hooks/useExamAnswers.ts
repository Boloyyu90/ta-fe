// src/features/exam-sessions/hooks/useExamAnswers.ts
import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { ExamAnswersResponse } from '../types/exam-sessions.types';

/**
 * Hook to fetch exam answers (for review page)
 * GET /api/v1/exam-sessions/:id/answers
 */
export function useExamAnswers(sessionId: number) {
    return useQuery<ExamAnswersResponse>({
        queryKey: ['exam-answers', sessionId],
        queryFn: () => examSessionsApi.getExamAnswers(sessionId),
        enabled: !!sessionId,
    });
}