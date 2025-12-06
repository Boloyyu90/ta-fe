// src/features/exam-sessions/hooks/useResultDetail.ts

import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { UserExam } from '../types/exam-sessions.types';

/**
 * Hook to fetch detailed result for a specific exam session
 *
 * ✅ CRITICAL FIX: ExamSessionDetailResponse has nested structure: { userExam: UserExam }
 * Backend response wraps the UserExam data inside a userExam property
 */

interface ResultDetail extends UserExam {
    // Add computed field
    passed: boolean | null;
}

export function useResultDetail(sessionId: number) {
    return useQuery<ResultDetail>({
        queryKey: ['result', sessionId],
        queryFn: async () => {
            const response = await examSessionsApi.getExamSession(sessionId);

            /**
             * ✅ FIX: Access data.userExam instead of data directly
             * ExamSessionDetailResponse structure: { userExam: UserExam }
             * So all properties are under response.userExam, not response directly
             */
            const data = response.userExam;

            return {
                // Session info
                id: data.id,
                userId: data.userId,
                examId: data.examId,
                status: data.status,
                startTime: data.startTime,
                endTime: data.endTime,
                submittedAt: data.submittedAt,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,

                // Scores
                totalScore: data.totalScore,
                tiuScore: data.tiuScore,
                twkScore: data.twkScore,
                tkpScore: data.tkpScore,

                // Metrics
                timeSpent: data.timeSpent,
                violationCount: data.violationCount,

                // Exam details
                exam: data.exam,

                // Computed: Pass/fail status
                passed: data.totalScore != null && data.totalScore !== undefined
                    ? data.totalScore >= data.exam.passingScore
                    : null,
            };
        },
        enabled: !!sessionId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}