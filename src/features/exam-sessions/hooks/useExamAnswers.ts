// src/features/exam-sessions/hooks/useExamAnswers.ts

/**
 * Hook to fetch exam answers with correctness
 *
 * ✅ For review page after submission
 * ✅ Includes correct answers and user selections
 */

import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { ExamAnswersPayload } from '../types/exam-sessions.types';

export function useExamAnswers(sessionId: number, enabled = true) {
    return useQuery<ExamAnswersPayload>({
        queryKey: ['exam-answers', sessionId],
        queryFn: () => examSessionsApi.getExamAnswers(sessionId),
        enabled: enabled && sessionId > 0,
        staleTime: Infinity, // Answers don't change after submission
    });
}