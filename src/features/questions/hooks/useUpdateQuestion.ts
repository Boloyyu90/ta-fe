// src/features/questions/hooks/useUpdateQuestion.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { questionsApi } from '../api/questions.api';
import { toast } from 'sonner';
import { useEffect } from 'react';
import type { UpdateQuestionRequest } from '../types/questions.types';

export function useUpdateQuestion(questionId: string) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: UpdateQuestionRequest) => questionsApi.updateQuestion(questionId, data),
    });

    // Handle success
    useEffect(() => {
        if (mutation.isSuccess) {
            toast.success('Question Updated!', {
                description: 'The question has been successfully updated.',
            });

            // Invalidate both list and detail queries
            queryClient.invalidateQueries({ queryKey: ['questions'] });
            queryClient.invalidateQueries({ queryKey: ['question', questionId] });

            // Redirect to question detail
            router.push(`/admin/questions/${questionId}`);
        }
    }, [mutation.isSuccess, questionId, router, queryClient]);

    // Handle errors
    useEffect(() => {
        if (mutation.isError) {
            const error: any = mutation.error;
            const errorMessage =
                error.response?.data?.message || 'Failed to update question. Please try again.';

            toast.error('Update Failed', {
                description: errorMessage,
            });
        }
    }, [mutation.isError, mutation.error]);

    return mutation;
}