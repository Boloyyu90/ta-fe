/**
 * Hook to compute statistics from user's exam results
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

            // ✅ FILTER: Only count FINISHED exams (exclude TIMEOUT and CANCELLED)
            const finishedExams = results.data.filter(
                (exam: ExamResult) => exam.status === 'FINISHED'
            );

            const completedExams = finishedExams.length;

            // Calculate average score from FINISHED exams only
            const totalScore = finishedExams.reduce(
                (sum: number, exam: ExamResult) => sum + (exam.totalScore ?? 0),
                0
            );
            const averageScore = completedExams > 0 ? totalScore / completedExams : 0;

            // Calculate total time from FINISHED exams only (duration is in seconds)
            const totalTime = finishedExams.reduce(
                (sum: number, exam: ExamResult) => sum + (exam.duration ?? 0),
                0
            );

            // Calculate passed/failed counts from FINISHED exams only
            // Assuming passed if totalScore >= (totalQuestions * 0.6)
            const passedExams = finishedExams.filter((exam: ExamResult) => {
                const passingScore = (exam.totalQuestions ?? 0) * 0.6;
                return (exam.totalScore ?? 0) >= passingScore;
            }).length;
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