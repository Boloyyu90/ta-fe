// src/features/exam-sessions/hooks/useSubmitAnswer.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { SubmitAnswerRequest } from '../types/exam-sessions.types';

export function useSubmitAnswer(sessionId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SubmitAnswerRequest) => examSessionsApi.submitAnswer(sessionId, data),
        onSuccess: () => {
            // Invalidate session to update progress
            queryClient.invalidateQueries({ queryKey: ['exam-session', sessionId] });
        },
        onError: (error: any) => {
            console.error('Answer submission error:', error);
            // Silent fail - will retry on next answer
        },
    });
}