// src/features/exam-sessions/hooks/useMyStats.ts

/**
 * Hook to compute statistics from user's exam results
 *
 * ✅ AUDIT FIX v3:
 * - Uses UserStatsResponse type (centralized)
 * - Calculates from correct fields
 * - Added passedExams and failedExams counts
 *
 * Calculates:
 * - Total completed exams
 * - Average score
 * - Total time spent (in seconds)
 * - Passed/failed exam counts
 */

import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { ExamResult, UserStatsResponse } from '../types/exam-sessions.types';

export const useMyStats = () => {
    return useQuery<UserStatsResponse, Error>({
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

            // Calculate passed/failed counts
            // Assuming passed if totalScore >= (totalQuestions * 0.6)
            const passedExams = exams.filter(
                (exam: ExamResult) => {
                    const passingScore = (exam.totalQuestions ?? 0) * 0.6;
                    return (exam.totalScore ?? 0) >= passingScore;
                }
            ).length;
            const failedExams = completedExams - passedExams;

            return {
                completedExams,
                averageScore: Math.round(averageScore * 100) / 100,
                totalTime,
                passedExams,
                failedExams,
            };
        },
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });
};

export default useMyStats;