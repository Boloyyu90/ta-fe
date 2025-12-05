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
            // ✅ FIXED: Correct path - mutation.data is already the unwrapped response
            // Backend returns: { data: { result: {...} } } (already unwrapped by API client)
            const { result } = mutation.data.data;

            toast.success('Exam Submitted!', {
                description: `Your exam has been submitted. Score: ${result.totalScore || 0}`,
            });

            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['user-exams'] });
            queryClient.invalidateQueries({ queryKey: ['my-results'] });

            // Redirect to results page
            router.push(`/results/${result.id}`);
        }
    }, [mutation.isSuccess, mutation.data, router, queryClient]);

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