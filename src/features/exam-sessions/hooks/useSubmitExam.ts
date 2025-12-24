/**
 * Hook to submit exam (finalize)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { SubmitExamResponse } from '../types/exam-sessions.types';

export function useSubmitExam(sessionId: number) {
    const queryClient = useQueryClient();

    return useMutation<SubmitExamResponse, Error, void>({
        mutationFn: () => examSessionsApi.submitExam(sessionId),
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