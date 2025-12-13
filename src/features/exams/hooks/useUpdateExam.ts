/**
 * Hook to update an existing exam
 *
 * mutate/mutateAsync take { id, data } object
 *
 * Backend: PATCH /api/v1/admin/exams/:id
 * Response: UpdateExamResponse = { exam: Exam }
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { examsApi } from '../api/exams.api';
import type { UpdateExamRequest, UpdateExamResponse } from '../types/exams.types';

export interface UpdateExamVariables {
    id: number;
    data: UpdateExamRequest;
}

export const useUpdateExam = () => {
    const queryClient = useQueryClient();

    return useMutation<UpdateExamResponse, Error, UpdateExamVariables>({
        mutationFn: ({ id, data }) => examsApi.updateExam(id, data),
        onSuccess: (_, variables) => {
            // Invalidate specific exam and exams list
            queryClient.invalidateQueries({ queryKey: ['admin-exam', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['admin-exams'] });
            // Also invalidate participant exams
            queryClient.invalidateQueries({ queryKey: ['exams'] });
            queryClient.invalidateQueries({ queryKey: ['exam', variables.id] });
        },
    });
};

export default useUpdateExam;