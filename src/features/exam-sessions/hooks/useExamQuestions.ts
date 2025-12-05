// src/features/exam-sessions/hooks/useExamQuestions.ts
import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { ExamQuestionsResponse } from '../types/exam-sessions.types';

/**
 * Hook to fetch questions for an exam session
 * GET /api/v1/exam-sessions/:id/questions
 */
export function useExamQuestions(sessionId: number) {
    return useQuery<ExamQuestionsResponse>({
        queryKey: ['exam-questions', sessionId],
        queryFn: () => examSessionsApi.getExamQuestions(sessionId),
        enabled: !!sessionId,
    });
}