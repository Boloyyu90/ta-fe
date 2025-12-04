// src/features/exams/hooks/useExam.ts
import { useQuery } from '@tanstack/react-query';
import { examsApi } from '../api/exams.api';
import type { ExamDetailResponse } from '../types/exams.types';

export function useExam(examId: number, enabled = true) {
    return useQuery<ExamDetailResponse>({
        queryKey: ['exam', examId],
        queryFn: () => examsApi.getExam(examId),
        enabled,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}