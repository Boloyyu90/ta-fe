/**
 * Hook for fetching admin exams list with pagination and filters
 *
 * Backend: GET /api/v1/admin/exams
 * Response: AdminExamsListResponse = { data: Exam[], pagination: PaginationMeta }
 */

import { useQuery } from '@tanstack/react-query';
import { examsApi } from '../api/exams.api';
import type { AdminExamsQueryParams, Exam } from '../types/exams.types';
import type { PaginationMeta } from '@/shared/types/api.types';

export interface UseAdminExamsOptions extends AdminExamsQueryParams {
    enabled?: boolean;
}

export interface UseAdminExamsResult {
    data: Exam[] | undefined;
    pagination: PaginationMeta | undefined;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
}

export function useAdminExams(params: UseAdminExamsOptions = {}): UseAdminExamsResult {
    const {
        page = 1,
        limit = 10,
        search,
        sortBy,
        sortOrder,
        createdBy,
        enabled = true,
    } = params;

    const query = useQuery({
        queryKey: ['admin-exams', { page, limit, search, sortBy, sortOrder, createdBy }],
        queryFn: async () => {
            const response = await examsApi.getAdminExams({
                page,
                limit,
                search,
                sortBy,
                sortOrder,
                createdBy,
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

export default useAdminExams;