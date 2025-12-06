// src/features/exam-sessions/hooks/useResultDetail.ts

import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { ExamSessionDetailResponse } from '../types/exam-sessions.types';

/**
 * Hook to fetch detailed result information for a completed exam session
 *
 * ⚠️ FIXED: Backend doesn't have getResultDetail endpoint
 * Solution: Use getExamSession which returns ExamSessionDetailResponse = { userExam: UserExam }
 *
 * Backend returns ExamSessionDetailResponse with nested userExam containing:
 * - totalScore, tiuScore, twkScore, tkpScore
 * - violationCount, timeSpent
 * - exam details (title, totalQuestions, etc.)
 * - status (FINISHED, COMPLETED, etc.)
 */
export function useResultDetail(sessionId: number) {
    return useQuery({
        queryKey: ['exam-session', sessionId, 'result'],
        /**
         * Use getExamSession which returns { userExam: UserExam }
         * This returns the full UserExam object which contains all result data
         */
        queryFn: () => examSessionsApi.getExamSession(sessionId),
        enabled: !!sessionId,
        staleTime: 5 * 60 * 1000, // Results don't change often, cache for 5 minutes
        /**
         * ✅ FIXED: Access nested userExam property from ExamSessionDetailResponse
         * ExamSessionDetailResponse = { userExam: UserExam }
         */
        select: (resp: ExamSessionDetailResponse) => {
            // Extract the userExam from the response wrapper
            const data = resp.userExam;

            /**
             * Transform the UserExam data to a result-focused structure
             * This is optional - you can also use the full UserExam object
             */
            return {
                // User exam session data
                id: data.id,
                userId: data.userId,
                examId: data.examId,
                status: data.status,
                startTime: data.startTime,
                endTime: data.endTime,
                submittedAt: data.submittedAt,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,

                // Result scores
                totalScore: data.totalScore,
                tiuScore: data.tiuScore,
                twkScore: data.twkScore,
                tkpScore: data.tkpScore,

                // Performance metrics
                timeSpent: data.timeSpent,
                violationCount: data.violationCount,

                // Associated exam details
                exam: data.exam,

                // Derived data - check if passed based on passing score
                passed: data.totalScore !== null && data.totalScore !== undefined
                    ? data.totalScore >= data.exam.passingScore
                    : null,
            };
        },
    });
}

/**
 * Type for the transformed result detail
 * This matches the structure returned by the select function above
 */
export type ResultDetail = NonNullable<ReturnType<typeof useResultDetail>['data']>;