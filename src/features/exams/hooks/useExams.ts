/**
 * Hook for fetching exams list (participant view)
 */

import { useQuery } from '@tanstack/react-query';
import { examsApi } from '../api/exams.api';
import type { ExamsQueryParams, ExamPublic } from '../types/exams.types';
import type { PaginationMeta } from '@/shared/types/api.types';

export interface UseExamsOptions extends ExamsQueryParams {
    enabled?: boolean;
}

export interface UseExamsResult {
    data: ExamPublic[] | undefined;
    pagination: PaginationMeta | undefined;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
}

export function useExams(params: UseExamsOptions = {}): UseExamsResult {
    const {
        page = 1,
        limit = 10,
        search,
        sortBy,
        sortOrder,
        enabled = true,
    } = params;

    const query = useQuery({
        queryKey: ['exams', { page, limit, search, sortBy, sortOrder }],
        queryFn: async () => {
            const response = await examsApi.getExams({
                page,
                limit,
                search,
                sortBy,
                sortOrder,
            });
            return response;
        },
        enabled,
        staleTime: 60 * 1000, // 1 minute
    });

    return {
        data: query.data?.data,
        pagination: query.data?.pagination,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}

export default useExams;