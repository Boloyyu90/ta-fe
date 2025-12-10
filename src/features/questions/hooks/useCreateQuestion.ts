// src/features/questions/hooks/useCreateQuestion.ts

/**
 * Hook to create a new question
 *
 * Backend: POST /api/v1/admin/questions
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { questionsApi } from '../api/questions.api';
import type { CreateQuestionRequest, CreateQuestionResponse } from '../types/questions.types';

export const useCreateQuestion = () => {
    const queryClient = useQueryClient();

    return useMutation<CreateQuestionResponse, Error, CreateQuestionRequest>({
        mutationFn: (data) => questionsApi.createQuestion(data),
        onSuccess: () => {
            // Invalidate questions list to refetch
            queryClient.invalidateQueries({ queryKey: ['questions'] });
        },
    });
};

export default useCreateQuestion;