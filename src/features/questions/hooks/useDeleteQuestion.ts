// src/features/questions/hooks/useDeleteQuestion.ts

/**
 * Hook to delete a question
 *
 * ✅ AUDIT FIX v3: id is number, not string
 *
 * Backend: DELETE /api/v1/admin/questions/:id
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { questionsApi } from '../api/questions.api';
import type { DeleteQuestionResponse } from '../types/questions.types';

export const useDeleteQuestion = () => {
    const queryClient = useQueryClient();

    return useMutation<DeleteQuestionResponse, Error, number>({
        mutationFn: (id) => questionsApi.deleteQuestion(id),
        onSuccess: () => {
            // Invalidate questions list to refetch
            queryClient.invalidateQueries({ queryKey: ['questions'] });
        },
    });
};

export default useDeleteQuestion;