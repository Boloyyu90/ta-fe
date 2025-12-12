// src/features/exam-sessions/hooks/useExamAnswers.ts

/**
 * Hook to fetch exam answers (for review page)
 *
 * Backend: GET /api/v1/exam-sessions/:id/answers
 */

import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { ExamAnswersResponse } from '../types/exam-sessions.types';

export function useExamAnswers(sessionId: number | undefined) {
    return useQuery<ExamAnswersResponse, Error>({
        queryKey: ['exam-answers', sessionId],
        queryFn: async () => {
            if (!sessionId) throw new Error('Session ID is required');
            return examSessionsApi.getExamAnswers(sessionId);
        },
        enabled: sessionId !== undefined && sessionId > 0,
    });
}

export default useExamAnswers;