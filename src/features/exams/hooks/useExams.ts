// src/features/exams/hooks/useExams.ts
import { useQuery } from '@tanstack/react-query';
import { examsApi } from '../api/exams.api';
import type { PaginationParams } from '@/shared/types/api.types';
import type { ExamsListResponse } from '../types/exams.types';

interface UseExamsParams extends PaginationParams {
    search?: string;
    sortBy?: 'createdAt' | 'startTime' | 'title';
    sortOrder?: 'asc' | 'desc';
}

export function useExams(params: UseExamsParams = { page: 1, limit: 10 }) {
    return useQuery<ExamsListResponse>({
        queryKey: ['exams', params],
        queryFn: () => examsApi.getExams(params),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}