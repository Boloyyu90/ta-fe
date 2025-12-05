// src/features/exam-sessions/hooks/useSubmitExam.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { SubmitExamResponse } from '../types/exam-sessions.types';

/**
 * Hook to submit exam (finalize)
 * POST /api/v1/exam-sessions/:id/submit
 */
export function useSubmitExam(sessionId: number) {
    const queryClient = useQueryClient();

    return useMutation<SubmitExamResponse, Error, void>({
        mutationFn: () => examSessionsApi.submitExam(sessionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exam-session', sessionId] });
            queryClient.invalidateQueries({ queryKey: ['my-results'] });
        },
    });
}