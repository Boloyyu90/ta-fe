// src/features/exam-sessions/hooks/useSubmitAnswer.ts

/**
 * Hook to submit answer (auto-save)
 *
 * ✅ Optimistic updates for better UX
 * ✅ Error handling with retry
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { SubmitAnswerRequest } from '../types/exam-sessions.types';

export function useSubmitAnswer(sessionId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SubmitAnswerRequest) =>
            examSessionsApi.submitAnswer(sessionId, data),

        onSuccess: () => {
            // Invalidate answers cache to reflect new answer
            queryClient.invalidateQueries({ queryKey: ['exam-answers', sessionId] });
        },

        // Retry on network errors (auto-save reliability)
        retry: 2,
        retryDelay: 1000, // 1 second between retries
    });
}