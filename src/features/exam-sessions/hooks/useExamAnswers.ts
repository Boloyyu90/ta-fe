// src/features/exam-sessions/hooks/useExamAnswers.ts
import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { ExamAnswersResponse } from '../types/exam-sessions.types';

export function useExamAnswers(sessionId: number, enabled = true) {
    return useQuery<ExamAnswersResponse>({
        queryKey: ['exam-answers', sessionId],
        queryFn: () => examSessionsApi.getExamAnswers(sessionId),
        enabled,
        staleTime: Infinity, // Answers don't change after submission
    });
}