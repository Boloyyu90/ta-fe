// src/features/exam-sessions/hooks/useMyStats.ts

/**
 * Hook to compute statistics from user's exam results
 *
 * ✅ AUDIT FIX v2:
 * - Uses ExamResult type (not UserExam)
 * - Calculates from correct fields
 *
 * Calculates:
 * - Total completed exams
 * - Average score
 * - Total time spent (in seconds)
 */

import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { ExamResult } from '../types/exam-sessions.types';

export interface MyStatsData {
    completedExams: number;
    averageScore: number;
    totalTime: number; // in seconds
}

export const useMyStats = () => {
    return useQuery<MyStatsData, Error>({
        queryKey: ['my-stats'],
        queryFn: async () => {
            // Fetch all results (with high limit to get everything)
            const results = await examSessionsApi.getMyResults({ limit: 1000 });

            const exams = results.data;
            const completedExams = exams.length;

            // Calculate average score
            const totalScore = exams.reduce(
                (sum: number, exam: ExamResult) => sum + (exam.totalScore ?? 0),
                0
            );
            const averageScore = completedExams > 0 ? totalScore / completedExams : 0;

            // Calculate total time (duration is in seconds)
            const totalTime = exams.reduce(
                (sum: number, exam: ExamResult) => sum + (exam.duration ?? 0),
                0
            );

            return {
                completedExams,
                averageScore: Math.round(averageScore * 100) / 100,
                totalTime,
            };
        },
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });
};

export default useMyStats;