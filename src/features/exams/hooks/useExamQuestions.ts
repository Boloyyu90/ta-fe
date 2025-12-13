/**
 * Hook to fetch questions attached to an exam (admin view)
 *
 * Backend: GET /api/v1/admin/exams/:id/questions
 * Response: ExamQuestionsListResponse = { data: ExamQuestion[], pagination }
 */

import { useQuery } from '@tanstack/react-query';
import { examsApi } from '../api/exams.api';
import type { ExamQuestionsListResponse } from '../types/exams.types';

export interface UseExamQuestionsOptions {
    page?: number;
    limit?: number;
    enabled?: boolean;
}

export function useExamQuestions(
    examId: number | undefined,
    options: UseExamQuestionsOptions = {}
) {
    const { page = 1, limit = 50, enabled = true } = options;

    return useQuery<ExamQuestionsListResponse, Error>({
        queryKey: ['exam-questions', examId, { page, limit }],
        queryFn: async () => {
            if (!examId) throw new Error('Exam ID is required');
            return examsApi.getExamQuestions(examId, { page, limit });
        },
        enabled: enabled && examId !== undefined && examId > 0,
        staleTime: 60 * 1000, // 1 minute
    });
}

export default useExamQuestions;