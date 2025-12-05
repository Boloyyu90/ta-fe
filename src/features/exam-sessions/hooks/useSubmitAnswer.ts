// src/features/exam-sessions/hooks/useSubmitAnswer.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { SubmitAnswerRequest, SubmitAnswerResponse } from '../types/exam-sessions.types';

/**
 * Hook to submit answer (auto-save)
 * POST /api/v1/exam-sessions/:id/answers
 */
export function useSubmitAnswer(sessionId: number) {
    const queryClient = useQueryClient();

    return useMutation<SubmitAnswerResponse, Error, SubmitAnswerRequest>({
        mutationFn: (data) => examSessionsApi.submitAnswer(sessionId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exam-answers', sessionId] });
        },
    });
}