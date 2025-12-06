import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';

/**
 * Hook to compute statistics from user's exam results
 *
 * Calculates:
 * - Total completed exams
 * - Average score
 * - Total time spent
 */
export const useMyStats = () => {
    return useQuery({
        queryKey: ['my-stats'],
        queryFn: async () => {
            // Fetch all results (no pagination, get everything)
            const results = await examSessionsApi.getMyResults({ limit: 1000 });

            // results is { data: UserExam[], pagination: {...} }
            const completedExams = results.data.length;
            const totalScore = results.data.reduce((sum: number, exam) => sum + (exam.totalScore || 0), 0);
            const averageScore = completedExams > 0 ? totalScore / completedExams : 0;
            const totalTime = results.data.reduce((sum: number, exam) => sum + (exam.timeSpent || 0), 0);

            return {
                completedExams,
                averageScore: Math.round(averageScore * 100) / 100,
                totalTime,
            };
        },
    });
};