/**
 * Hook to submit exam (finalize)
 *
 * Features:
 * - Smart retry: Never retry on 429 (rate limit) or 401/403 (auth errors)
 * - Retry once for network/server errors
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { SubmitExamResponseNormalized } from '../types/exam-sessions.types';
import type { ApiError } from '@/shared/lib/api';

export function useSubmitExam(sessionId: number) {
    const queryClient = useQueryClient();

    return useMutation<SubmitExamResponseNormalized, ApiError, void>({
        mutationFn: () => examSessionsApi.submitExam(sessionId),

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

        retryDelay: 1000,

        onSuccess: (data) => {
            // 1. Session-specific queries
            queryClient.invalidateQueries({ queryKey: ['exam-session', sessionId] });
            queryClient.invalidateQueries({ queryKey: ['exam-answers', sessionId] });
            queryClient.invalidateQueries({ queryKey: ['result-detail', sessionId] });

            // 2. Dashboard stats (Issue #1 fix)
            queryClient.invalidateQueries({ queryKey: ['my-stats'] });

            // 3. Results list
            queryClient.invalidateQueries({ queryKey: ['my-results'] });

            // 4. User exam sessions (for button state updates)
            queryClient.invalidateQueries({ queryKey: ['user-exams'] });

            // 5. Invalidate specific exam data (for retake button state)
            if (data?.result?.exam?.id) {
                queryClient.invalidateQueries({ queryKey: ['exam', data.result.exam.id] });
            }

            // 6. Proctoring events (in case component needs refresh)
            queryClient.invalidateQueries({ queryKey: ['proctoring-events', sessionId] });
        },
    });
}

export default useSubmitExam;