// src/features/exam-sessions/hooks/useExamQuestions.ts

/**
 * Hook to fetch exam questions
 *
 * ✅ Returns questions WITHOUT correct answers (active exam)
 * ✅ Questions don't change during exam (Infinity stale time)
 */

import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { ExamQuestionsPayload } from '../types/exam-sessions.types';

export function useExamQuestions(sessionId: number, enabled = true) {
    return useQuery<ExamQuestionsPayload>({
        queryKey: ['exam-questions', sessionId],
        queryFn: () => examSessionsApi.getExamQuestions(sessionId),
        enabled: enabled && sessionId > 0,
        staleTime: Infinity, // Questions don't change during exam
    });
}