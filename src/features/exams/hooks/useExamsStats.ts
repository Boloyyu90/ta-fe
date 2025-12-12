/**
 * Hook for fetching exam statistics (dashboard)
 */

import { useQuery } from '@tanstack/react-query';
import { examsApi } from '../api/exams.api';

export interface ExamsStats {
    totalExams: number;
    totalQuestions: number;
    averagePassingScore: number;
}

export function useExamsStats() {
    return useQuery<ExamsStats, Error>({
        queryKey: ['exams-stats'],
        queryFn: async () => {
            const response = await examsApi.getExams({
                limit: 100, // Get more exams for stats
            });

            const exams = response.data;
            const totalExams = exams.length;

            // Count total questions
            const totalQuestions = exams.reduce(
                (sum, exam) => sum + (exam._count?.examQuestions ?? 0),
                0
            );

            const totalPassingScore = exams.reduce(
                (sum, exam) => sum + (exam.passingScore ?? 0),
                0
            );
            const averagePassingScore = totalExams > 0
                ? Math.round(totalPassingScore / totalExams)
                : 0;

            return {
                totalExams,
                totalQuestions,
                averagePassingScore,
            };
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export default useExamsStats;