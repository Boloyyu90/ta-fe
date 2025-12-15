/**
 * Hook to detach questions from an exam
 *
 * Backend: DELETE /api/v1/admin/exams/:id/questions
 * Response: DetachQuestionsResponse = { detached: number, total: number }
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { examsApi } from '../api/exams.api';
import type { DetachQuestionsRequest, DetachQuestionsResponse } from '../types/exams.types';

export interface DetachQuestionsVariables {
    examId: number;
    data: DetachQuestionsRequest;
}

export const useDetachQuestions = () => {
    const queryClient = useQueryClient();

    return useMutation<DetachQuestionsResponse, Error, DetachQuestionsVariables>({
        mutationFn: ({ examId, data }) => examsApi.detachQuestions(examId, data),
        onSuccess: (_, variables) => {
            // Invalidate exam detail (question count will change)
            queryClient.invalidateQueries({ queryKey: ['admin-exam', variables.examId] });
            queryClient.invalidateQueries({ queryKey: ['exam', variables.examId] });
            // Invalidate exam questions list
            queryClient.invalidateQueries({ queryKey: ['exam-questions', variables.examId] });
            // Invalidate exams list (question count shown in list)
            queryClient.invalidateQueries({ queryKey: ['admin-exams'] });
            queryClient.invalidateQueries({ queryKey: ['exams'] });
        },
    });
};

export default useDetachQuestions;