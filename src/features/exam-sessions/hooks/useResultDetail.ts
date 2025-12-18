/**
 * Hook to fetch detailed result for a specific exam session
 *
 * ⚠️ NOTE: Backend does NOT have GET /results/:id endpoint.
 * We use GET /exam-sessions/:id as the backend-aligned workaround.
 * This returns UserExam which contains result data for completed exams.
 */

import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { UserExam, ExamResult, ExamStatus } from '../types/exam-sessions.types';

/**
 * Result detail for display
 */
export interface ResultDetail {
    id: number;
    exam: {
        id: number;
        title: string;
        description: string | null;
        passingScore: number;
        durationMinutes?: number;
    };
    user: {
        id: number;
        name: string;
        email: string;
    };
    startedAt: string | null;
    submittedAt: string | null;
    totalScore: number | null;
    status: ExamStatus;
    duration: number | null;
    answeredQuestions: number;
    totalQuestions: number;
    passed: boolean | null;
    scoresByType: Array<{
        type: string;
        score: number;
        maxScore: number;
        correctAnswers: number;
        totalQuestions: number;
    }>;
}

/**
 * Transform UserExam to ResultDetail format
 */
function transformToResultDetail(userExam: UserExam): ResultDetail {
    const passingScore = userExam.exam.passingScore ?? 0;
    const totalScore = userExam.totalScore ?? null;

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
            description: userExam.exam.description,
            passingScore: passingScore,
            durationMinutes: userExam.durationMinutes ?? undefined,
        },
        user: {
            id: userExam.userId,
            name: userExam.user?.name ?? '',
            email: userExam.user?.email ?? '',
        },
        startedAt: userExam.startedAt,
        submittedAt: userExam.submittedAt,
        totalScore: totalScore,
        status: userExam.status,
        // Duration is calculated on backend or derived
        duration: null,
        answeredQuestions: userExam.answeredQuestions,
        totalQuestions: userExam.totalQuestions,
        passed: passed,
        // scoresByType is empty from UserExam - would need separate API call
        scoresByType: [],
    };
}

export function useResultDetail(sessionId: number | undefined) {
    return useQuery<ResultDetail, Error>({
        queryKey: ['result-detail', sessionId],
        queryFn: async () => {
            if (!sessionId) throw new Error('Session ID is required');

            const response = await examSessionsApi.getUserExam(sessionId);
            return transformToResultDetail(response.userExam);
        },
        enabled: sessionId !== undefined && sessionId > 0,
    });
}

export default useResultDetail;