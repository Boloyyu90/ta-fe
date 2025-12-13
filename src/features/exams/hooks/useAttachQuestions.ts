// src/features/exams/hooks/useAttachQuestions.ts

/**
 * Hook to attach questions to an exam
 *
 * Backend: POST /api/v1/admin/exams/:id/questions
 * Response: AttachQuestionsResponse = { message, attached, alreadyAttached? }
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { examsApi } from '../api/exams.api';
import type { AttachQuestionsRequest, AttachQuestionsResponse } from '../types/exams.types';

export interface AttachQuestionsVariables {
    examId: number;
    data: AttachQuestionsRequest;
}

export const useAttachQuestions = () => {
    const queryClient = useQueryClient();

    return useMutation<AttachQuestionsResponse, Error, AttachQuestionsVariables>({
        mutationFn: ({ examId, data }) => examsApi.attachQuestions(examId, data),
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

export default useAttachQuestions;