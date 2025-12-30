/**
 * Hook to fetch current user's dashboard statistics
 *
 * Backend: GET /api/v1/me/stats
 *
 * Response includes:
 * - completedExams: Number of finished exams
 * - averageScore: Average score (null if no finished exams)
 * - totalTimeMinutes: Total time spent on finished exams
 * - activeExams: Number of in-progress exams
 *
 * @example
 * const { data, isLoading, isError } = useMyStats();
 * const stats = data?.stats ?? { completedExams: 0, averageScore: null, totalTimeMinutes: 0, activeExams: 0 };
 */

import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';
import type { UserStatsResponse } from '../types/users.types';

export function useMyStats() {
    return useQuery<UserStatsResponse, Error>({
        queryKey: ['my-stats'],
        queryFn: () => usersApi.getMyStats(),
        staleTime: 60 * 1000, // 1 minute (stats don't change frequently)
        refetchOnMount: 'always', // Always refetch when dashboard is visited
        retry: 1,
    });
}

export default useMyStats;
