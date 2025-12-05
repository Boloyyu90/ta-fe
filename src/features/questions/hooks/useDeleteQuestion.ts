// src/features/questions/hooks/useDeleteQuestion.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { questionsApi } from '../api/questions.api';
import { toast } from 'sonner';
import { useEffect } from 'react';

export function useDeleteQuestion() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (id: string) => questionsApi.deleteQuestion(id),
    });

    // Handle success
    useEffect(() => {
        if (mutation.isSuccess) {
            toast.success('Question Deleted', {
                description: 'The question has been removed from the question bank.',
            });

            // Invalidate questions list
            queryClient.invalidateQueries({ queryKey: ['questions'] });
        }
    }, [mutation.isSuccess, queryClient]);

    // Handle errors
    useEffect(() => {
        if (mutation.isError) {
            const error: any = mutation.error;
            const errorMessage =
                error.response?.data?.message || 'Failed to delete question. Please try again.';

            toast.error('Deletion Failed', {
                description: errorMessage,
            });
        }
    }, [mutation.isError, mutation.error]);

    return mutation;
}