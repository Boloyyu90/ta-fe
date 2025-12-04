// src/features/exam-sessions/hooks/useSubmitExam.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { examSessionsApi } from '../api/exam-sessions.api';
import { toast } from 'sonner';
import { useEffect } from 'react';

export function useSubmitExam(sessionId: number) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () => examSessionsApi.submitExam(sessionId),
    });

    // Handle success
    useEffect(() => {
        if (mutation.isSuccess && mutation.data) {
            const { result } = mutation.data;

            toast.success('Exam Submitted!', {
                description: `Your score: ${result.totalScore || 0}`,
                duration: 5000,
            });

            // Invalidate queries
            queryClient.invalidateQueries({ queryKey: ['exam-session', sessionId] });
            queryClient.invalidateQueries({ queryKey: ['user-exams'] });
            queryClient.invalidateQueries({ queryKey: ['my-results'] });

            // Redirect to review page
            router.push(`/exam-sessions/${sessionId}/review`);
        }
    }, [mutation.isSuccess, mutation.data, sessionId, router, queryClient]);

    // Handle errors
    useEffect(() => {
        if (mutation.isError) {
            const error: any = mutation.error;
            const errorMessage =
                error.response?.data?.message || 'Failed to submit exam. Please try again.';

            toast.error('Submission Failed', {
                description: errorMessage,
            });
        }
    }, [mutation.isError, mutation.error]);

    return mutation;
}