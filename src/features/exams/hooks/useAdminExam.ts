/**
 * Hook for fetching single exam detail (admin view)
 *
 * Backend: GET /api/v1/admin/exams/:id
 * Response: AdminExamDetailResponse = { exam: Exam }
 */

import { useQuery } from '@tanstack/react-query';
import { examsApi } from '../api/exams.api';
import type { AdminExamDetailResponse } from '../types/exams.types';

export interface UseAdminExamOptions {
    enabled?: boolean;
}

export function useAdminExam(examId: number | undefined, options: UseAdminExamOptions = {}) {
    const { enabled = true } = options;

    return useQuery<AdminExamDetailResponse, Error>({
        queryKey: ['admin-exam', examId],
        queryFn: async () => {
            if (!examId) throw new Error('Exam ID is required');
            return examsApi.getAdminExam(examId);
        },
        enabled: enabled && examId !== undefined && examId > 0,
        staleTime: 60 * 1000, // 1 minute
    });
}

export default useAdminExam;