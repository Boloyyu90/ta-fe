// src/features/exam-sessions/hooks/useResultDetail.ts

/**
 * Hook to fetch detailed result for a specific exam session
 *
 * ✅ AUDIT FIX v4: Fixed null checks for totalScore and passingScore
 *
 * Backend: GET /api/v1/exam-sessions/:id (for completed sessions)
 */

import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { ResultDetail, UserExam } from '../types/exam-sessions.types';

/**
 * Transform UserExam to ResultDetail format
 * ✅ FIX: Added proper null checks for totalScore and passingScore
 */
function transformToResultDetail(userExam: UserExam): ResultDetail {
    // Safe null checks for passing calculation
    const totalScore = userExam.totalScore ?? null;
    const passingScore = userExam.exam?.passingScore ?? 0;

    // Calculate passed status with null safety
    let passed: boolean | null = null;
    if (totalScore !== null && passingScore > 0) {
        passed = totalScore >= passingScore;
    }

    return {
        id: userExam.id,
        exam: {
            id: userExam.exam.id,
            title: userExam.exam.title,
            description: userExam.exam.description ?? null,
            passingScore: userExam.exam.passingScore,
            durationMinutes: userExam.exam.durationMinutes,
        },
        user: {
            id: userExam.userId,
            name: '', // Will be filled by backend if available
            email: '',
        },
        startedAt: userExam.startTime ?? userExam.createdAt,
        submittedAt: userExam.submittedAt ?? null,
        totalScore: totalScore,
        status: userExam.status,
        duration: userExam.timeSpent ?? null,
        answeredQuestions: userExam.answeredQuestions,
        totalQuestions: userExam.totalQuestions,
        scoresByType: [],
        // Extended fields
        tiuScore: userExam.tiuScore,
        twkScore: userExam.twkScore,
        tkpScore: userExam.tkpScore,
        violationCount: userExam.violationCount,
        passed: passed,
    };
}

export const useResultDetail = (sessionId: number | undefined) => {
    return useQuery<ResultDetail, Error>({
        queryKey: ['result-detail', sessionId],
        queryFn: async () => {
            if (!sessionId) throw new Error('Session ID is required');

            const response = await examSessionsApi.getExamSession(sessionId);
            return transformToResultDetail(response.userExam);
        },
        enabled: sessionId !== undefined && sessionId > 0,
    });
};

export default useResultDetail;