// src/features/exam-sessions/hooks/useExamQuestions.ts
import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { ExamQuestionsResponse } from '../types/exam-sessions.types';

export function useExamQuestions(sessionId: number, enabled = true) {
    return useQuery<ExamQuestionsResponse>({
        queryKey: ['exam-questions', sessionId],
        queryFn: () => examSessionsApi.getExamQuestions(sessionId),
        enabled,
        staleTime: Infinity, // Questions don't change during exam
    });
}