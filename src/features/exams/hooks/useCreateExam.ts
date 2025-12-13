/**
 * Hook to create a new exam
 *
 * Backend: POST /api/v1/admin/exams
 * Response: CreateExamResponse = { exam: Exam }
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { examsApi } from '../api/exams.api';
import type { CreateExamRequest, CreateExamResponse } from '../types/exams.types';

export const useCreateExam = () => {
    const queryClient = useQueryClient();

    return useMutation<CreateExamResponse, Error, CreateExamRequest>({
        mutationFn: (data) => examsApi.createExam(data),
        onSuccess: () => {
            // Invalidate admin exams list to refetch
            queryClient.invalidateQueries({ queryKey: ['admin-exams'] });
            // Also invalidate participant exams list (they might see new exam if it has questions)
            queryClient.invalidateQueries({ queryKey: ['exams'] });
        },
    });
};

export default useCreateExam;