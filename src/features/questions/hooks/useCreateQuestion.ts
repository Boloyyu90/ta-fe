// src/features/questions/hooks/useCreateQuestion.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { questionsApi } from '../api/questions.api';
import { toast } from 'sonner';
import { useEffect } from 'react';
import type { CreateQuestionRequest } from '../types/questions.types';

export function useCreateQuestion() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: CreateQuestionRequest) => questionsApi.createQuestion(data),
    });

    // Handle success
    useEffect(() => {
        if (mutation.isSuccess) {
            toast.success('Question Created!', {
                description: 'The question has been successfully added to the question bank.',
            });

            // Invalidate questions list
            queryClient.invalidateQueries({ queryKey: ['questions'] });

            // Redirect to questions list
            router.push('/admin/questions');
        }
    }, [mutation.isSuccess, router, queryClient]);

    // Handle errors
    useEffect(() => {
        if (mutation.isError) {
            const error: any = mutation.error;
            const errorMessage =
                error.response?.data?.message || 'Failed to create question. Please try again.';

            toast.error('Creation Failed', {
                description: errorMessage,
            });
        }
    }, [mutation.isError, mutation.error]);

    return mutation;
}