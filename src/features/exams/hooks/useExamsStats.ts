import { useQuery } from '@tanstack/react-query';
import { examsApi } from '@/features/exams/api/exams.api';

/**
 * Hook to compute statistics from available exams
 *
 * Calculates:
 * - Total published exams
 * - Average duration
 * - Average passing score
 *
 * NOTE: Uses 'active' status filter (not 'PUBLISHED')
 * as per backend contract
 */
export const useExamsStats = () => {
    return useQuery({
        queryKey: ['exams-stats'],
        queryFn: async () => {
            // Use 'active' status (exams available to participants)
            // Backend accepts: 'active' | 'inactive' | 'all'
            const exams = await examsApi.getExams({ status: 'active' });

            const totalExams = exams.length;
            const totalDuration = exams.reduce((sum, exam) => sum + exam.duration, 0);
            const averageDuration = totalExams > 0 ? totalDuration / totalExams : 0;
            const totalPassingScore = exams.reduce((sum, exam) => sum + exam.passingScore, 0);
            const averagePassingScore = totalExams > 0 ? totalPassingScore / totalExams : 0;

            return {
                totalExams,
                averageDuration: Math.round(averageDuration),
                averagePassingScore: Math.round(averagePassingScore * 100) / 100,
            };
        },
    });
};