/**
 * Hook to delete an exam
 *
 * Backend: DELETE /api/v1/admin/exams/:id
 * Response: DeleteExamResponse = { message: string }
 *
 * Note: Will fail with 409 if exam has participant attempts
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { examsApi } from '../api/exams.api';
import type { DeleteExamResponse } from '../types/exams.types';

export const useDeleteExam = () => {
    const queryClient = useQueryClient();

    return useMutation<DeleteExamResponse, Error, number>({
        mutationFn: (examId) => examsApi.deleteExam(examId),
        onSuccess: (_, examId) => {
            // Invalidate exams lists
            queryClient.invalidateQueries({ queryKey: ['admin-exams'] });
            queryClient.invalidateQueries({ queryKey: ['exams'] });
            // Remove specific exam from cache
            queryClient.removeQueries({ queryKey: ['admin-exam', examId] });
            queryClient.removeQueries({ queryKey: ['exam', examId] });
        },
    });
};

export default useDeleteExam;