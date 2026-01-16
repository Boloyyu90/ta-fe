/**
 * Hook to fetch detailed result for a specific exam session
 */

import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { UserExam, ExamStatus } from '../types/exam-sessions.types';

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
    attemptNumber: number;  // HIGH-006 FIX: Include attempt number
    passed: boolean | null;
    scoresByType: Array<{
        type: string;
        score: number;
        maxScore: number;
        correctAnswers: number;
        totalQuestions: number;
        passingGrade: number;  // Passing grade for this question type (from backend)
        isPassing: boolean;    // Whether score meets passing grade (calculated by backend)
    }>;
}

/**
 * Transform UserExam to ResultDetail format
 *
 * ✅ FIX: Handle the actual nested structure from backend:
 * - exam.passingScore (direct field)
 * - exam.examQuestions (array - use length)
 * - _count.answers (nested count)
 */
function transformToResultDetail(userExam: UserExam): ResultDetail {
    // Extract passingScore from exam object (backend now always provides this)
    const passingScore = (userExam.exam as any)?.passingScore ?? 0;
    const totalScore = userExam.totalScore ?? null;

    // ✅ FIX: Extract totalQuestions from examQuestions array length
    // Backend returns exam.examQuestions[] array, not _count.examQuestions
    const examQuestionsArray = (userExam.exam as any)?.examQuestions;
    const totalQuestions = Array.isArray(examQuestionsArray)
        ? examQuestionsArray.length
        : (userExam.exam as any)?._count?.examQuestions ?? userExam.totalQuestions ?? 0;

    // ✅ FIX: Extract answeredQuestions from _count.answers
    const answeredQuestions = (userExam as any)?._count?.answers ?? userExam.answeredQuestions ?? 0;

    // ✅ FIX: Calculate duration from timestamps
    let duration: number | null = null;
    if (userExam.startedAt && userExam.submittedAt) {
        const start = new Date(userExam.startedAt).getTime();
        const end = new Date(userExam.submittedAt).getTime();
        duration = Math.floor((end - start) / 1000); // seconds
    }

    // Calculate passed status with null safety
    let passed: boolean | null = null;
    if (totalScore !== null) {
        passed = totalScore >= passingScore;
    }

    return {
        id: userExam.id,
        exam: {
            id: userExam.exam?.id ?? 0,
            title: userExam.exam?.title ?? 'Unknown Exam',
            description: userExam.exam?.description ?? null,
            passingScore: passingScore,
            durationMinutes: userExam.durationMinutes ?? (userExam.exam as any)?.durationMinutes ?? undefined,
        },
        user: {
            id: userExam.userId ?? (userExam.user as any)?.id ?? 0,
            name: userExam.user?.name ?? '',
            email: userExam.user?.email ?? '',
        },
        startedAt: userExam.startedAt,
        submittedAt: userExam.submittedAt,
        totalScore: totalScore,
        status: userExam.status,
        duration: duration,
        answeredQuestions: answeredQuestions,
        totalQuestions: totalQuestions,
        attemptNumber: userExam.attemptNumber,  // Backend always provides this
        passed: passed,
        // scoresByType would need separate computation or backend enhancement
        scoresByType: [],
    };
}

export function useResultDetail(sessionId: number | undefined) {
    return useQuery<ResultDetail, Error>({
        queryKey: ['result-detail', sessionId],
        queryFn: async () => {
            if (!sessionId) throw new Error('Session ID is required');

            const response = await examSessionsApi.getUserExam(sessionId);

            // Debug logging - remove in production
            if (process.env.NODE_ENV === 'development') {
                console.log('📊 Raw userExam response:', JSON.stringify(response.userExam, null, 2));
            }

            return transformToResultDetail(response.userExam);
        },
        enabled: sessionId !== undefined && sessionId > 0,
    });
}

export default useResultDetail;