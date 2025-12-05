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
            // ✅ FIXED: Access nested data structure correctly
            const { result } = mutation.data.data;

            // ✅ FIXED: Safe score calculation with null checks
            const totalScore = result.totalScore ?? 0;
            const totalQuestions = result.totalQuestions ?? 0;
            const maxScore = totalQuestions * 5;

            toast.success('Exam Submitted!', {
                description: `Your score: ${totalScore}/${maxScore}`,
            });

            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['user-exams'] });
            queryClient.invalidateQueries({ queryKey: ['exam-session', sessionId] });

            // Redirect to results page
            router.push(`/results/${sessionId}`);
        }
    }, [mutation.isSuccess, mutation.data, router, queryClient, sessionId]);

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