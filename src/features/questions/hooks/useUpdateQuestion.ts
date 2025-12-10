// src/features/questions/hooks/useUpdateQuestion.ts

/**
 * Hook to update an existing question
 *
 * ✅ AUDIT FIX: id is number, not string
 *
 * Backend: PATCH /api/v1/admin/questions/:id
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { questionsApi } from '../api/questions.api';
import type { UpdateQuestionRequest, UpdateQuestionResponse } from '../types/questions.types';

interface UpdateQuestionVariables {
    id: number;
    data: UpdateQuestionRequest;
}

export const useUpdateQuestion = () => {
    const queryClient = useQueryClient();

    return useMutation<UpdateQuestionResponse, Error, UpdateQuestionVariables>({
        mutationFn: ({ id, data }) => questionsApi.updateQuestion(id, data),
        onSuccess: (_, variables) => {
            // Invalidate specific question and questions list
            queryClient.invalidateQueries({ queryKey: ['question', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['questions'] });
        },
    });
};

export default useUpdateQuestion;