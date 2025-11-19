// src/features/exam-sessions/hooks/useMyResults.ts
import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { PaginationParams } from '@/shared/types/api.types';
import type { ResultsListResponse } from '../types/exam-sessions.types';

interface UseMyResultsParams extends PaginationParams {}

export function useMyResults(params: UseMyResultsParams = { page: 1, limit: 10 }) {
    return useQuery<ResultsListResponse>({
        queryKey: ['my-results', params],
        queryFn: () => examSessionsApi.getMyResults(params),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}