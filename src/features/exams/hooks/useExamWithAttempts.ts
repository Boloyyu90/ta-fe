// src/features/exams/hooks/useExamWithAttempts.ts

/**
 * Hook to fetch exam details WITH attempts info (participant view)
 *
 * Backend: GET /api/v1/exams/:id
 * Response: { exam: Exam, attemptsCount?, firstAttempt?, latestAttempt? }
 *
 * This hook returns the FULL response including attempts data,
 * unlike useExam which only returns the exam entity.
 *
 * Use this when you need to determine button states (start/retake/view-result)
 * based on user's attempt history for THIS exam.
 */

import { useQuery } from '@tanstack/react-query';
import { examsApi } from '../api/exams.api';
import type { ExamDetailWithAttemptsResponse } from '../types/exams.types';

export interface UseExamWithAttemptsOptions {
    enabled?: boolean;
}

export function useExamWithAttempts(
    examId: number | undefined,
    options: UseExamWithAttemptsOptions = {}
) {
    const { enabled = true } = options;

    return useQuery<ExamDetailWithAttemptsResponse, Error>({
        queryKey: ['exam-with-attempts', examId],
        queryFn: async (): Promise<ExamDetailWithAttemptsResponse> => {
            if (!examId) throw new Error('Exam ID is required');
            return examsApi.getExamWithAttempts(examId);
        },
        enabled: enabled && examId !== undefined && examId > 0,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export default useExamWithAttempts;
