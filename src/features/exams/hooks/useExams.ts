// src/features/exams/hooks/useExams.ts
import { useQuery } from '@tanstack/react-query';
import { examsApi } from '../api/exams.api';
import type { ExamsResponse, ExamsQueryParams } from '../types/exams.types';

export function useExams(params: ExamsQueryParams = {}) {
    const { page = 1, limit = 10, search, isActive } = params;

    return useQuery<ExamsResponse>({
        queryKey: ['exams', { page, limit, search, isActive }],
        queryFn: () => examsApi.getExams({ page, limit, search, isActive }),
        staleTime: 1000 * 60, // 1 minute
    });
}