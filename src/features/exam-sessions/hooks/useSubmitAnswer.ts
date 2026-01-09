// src/features/exam-sessions/hooks/useSubmitAnswer.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { SubmitAnswerRequest, SubmitAnswerResponse } from '../types/exam-sessions.types';
import type { ApiError } from '@/shared/lib/api';

/**
 * Hook to submit answer (auto-save)
 * POST /api/v1/exam-sessions/:id/answers
 *
 * Features:
 * - Smart retry: Never retry on 429 (rate limit) or 401/403 (auth errors)
 * - Retry once for network/server errors
 */
export function useSubmitAnswer(sessionId: number) {
    const queryClient = useQueryClient();

    return useMutation<SubmitAnswerResponse, ApiError, SubmitAnswerRequest>({
        mutationFn: (data) => examSessionsApi.submitAnswer(sessionId, data),

        // Smart retry: Don't retry on rate limit or auth errors
        retry: (failureCount, error) => {
            const status = error?.status;

            // Never retry these - they won't succeed on retry
            if (status === 429 || status === 401 || status === 403 || status === 404) {
                return false;
            }

            // Retry network/server errors once
            return failureCount < 1;
        },

        // Short retry delay for non-rate-limit errors
        retryDelay: 500,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exam-answers', sessionId] });
        },
    });
}