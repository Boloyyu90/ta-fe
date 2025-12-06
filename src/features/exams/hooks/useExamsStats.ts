// src/features/exams/hooks/useExamsStats.ts

import { useQuery } from '@tanstack/react-query';
import { examsApi } from '../api/exams.api';

/**
 * Hook to fetch exam statistics
 * Calculates aggregate stats from active exams
 *
 * ⚠️ FIXED: examsApi.getExams() returns { data: Exam[], pagination: {...} }
 * NOT a plain array
 */
export function useExamsStats() {
    return useQuery({
        queryKey: ['exams-stats'],
        queryFn: async () => {
            // ✅ FIXED: Destructure the data array from response
            const { data: exams } = await examsApi.getExams({ status: 'active' });

            // Now we can safely use array methods
            const totalExams = exams.length;
            const totalDuration = exams.reduce((sum, exam) => sum + exam.durationMinutes, 0); // ✅ durationMinutes
            const averageDuration = totalExams > 0 ? Math.round(totalDuration / totalExams) : 0;

            const totalPassingScore = exams.reduce((sum, exam) => sum + exam.passingScore, 0);
            const averagePassingScore = totalExams > 0 ? Math.round(totalPassingScore / totalExams) : 0;

            return {
                totalExams,
                averageDuration,
                averagePassingScore,
            };
        },
    });
}