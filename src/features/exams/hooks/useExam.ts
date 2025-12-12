/**
 * Hook to fetch single exam details
 *
 * Backend: GET /api/v1/exams/:id
 * Response: { exam: Exam }
 */

import { useQuery } from '@tanstack/react-query';
import { examsApi } from '../api/exams.api';
import type { Exam, ExamDetailResponse } from '../types/exams.types';

export interface UseExamOptions {
    enabled?: boolean;
}

export function useExam(examId: number | undefined, options: UseExamOptions = {}) {
    const { enabled = true } = options;

    return useQuery<Exam, Error>({
        queryKey: ['exam', examId],
        queryFn: async (): Promise<Exam> => {
            if (!examId) throw new Error('Exam ID is required');
            const response: ExamDetailResponse = await examsApi.getExam(examId);
            // ✅ FIX: Unwrap response to return Exam directly
            return response.exam;
        },
        enabled: enabled && examId !== undefined && examId > 0,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export default useExam;