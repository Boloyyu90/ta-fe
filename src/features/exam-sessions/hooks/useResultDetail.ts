// src/features/exam-sessions/hooks/useResultDetail.ts

/**
 * Hook to fetch detailed result for a specific exam session
 *
 * ✅ AUDIT FIX v3: Fixed type mismatch - now returns ResultDetail properly
 *
 * Backend: GET /api/v1/exam-sessions/:id (for completed sessions)
 */

import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { ResultDetail, ExamResult, UserExam } from '../types/exam-sessions.types';

/**
 * Transform UserExam to ResultDetail format
 */
function transformToResultDetail(userExam: UserExam): ResultDetail {
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
        totalScore: userExam.totalScore ?? null,
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
        passed: userExam.totalScore !== null && userExam.exam.passingScore
            ? userExam.totalScore >= userExam.exam.passingScore
            : null,
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