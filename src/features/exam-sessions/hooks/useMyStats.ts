// src/features/exam-sessions/hooks/useMyStats.ts
import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';

/**
 * Hook to fetch user's exam statistics
 */
export function useMyStats() {
    return useQuery({
        queryKey: ['my-stats'],
        queryFn: async () => {
            const results = await examSessionsApi.getMyResults({ status: 'COMPLETED' });

            const completedExams = results.data.length;
            const totalScore = results.data.reduce((sum, exam) => sum + (exam.totalScore || 0), 0);
            const avgScore = completedExams > 0 ? Math.round(totalScore / completedExams) : 0;
            const totalTime = results.data.reduce((sum, exam) => sum + (exam.timeSpent || 0), 0);

            return {
                completedExams,
                avgScore,
                totalTimeMinutes: Math.round(totalTime / 60000), // Convert ms to minutes
            };
        },
    });
}