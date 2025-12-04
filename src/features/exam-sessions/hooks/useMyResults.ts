// src/features/exam-sessions/hooks/useMyResults.ts
import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { MyResultsResponse } from '../types/exam-sessions.types';

interface UseMyResultsParams {
    page?: number;
    limit?: number;
    status?: 'COMPLETED' | 'CANCELLED';
}

export function useMyResults(params: UseMyResultsParams = {}) {
    const { page = 1, limit = 10, status } = params;

    return useQuery<MyResultsResponse>({
        queryKey: ['my-results', { page, limit, status }],
        queryFn: () => examSessionsApi.getMyResults({ page, limit, status }),
        staleTime: 1000 * 60, // 1 minute
    });
}