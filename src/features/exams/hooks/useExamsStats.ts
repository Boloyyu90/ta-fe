/**
 * Hook for computing exam statistics from list data
 */

import { useMemo } from 'react';
import type { ExamPublic, Exam } from '../types/exams.types';

export interface ExamStats {
    totalExams: number;
    totalQuestions: number;
    totalDuration: number;
    averageDuration: number;
    averageQuestionsPerExam: number;
}

export function useExamsStats(exams: ExamPublic[] | Exam[] | undefined): ExamStats {
    return useMemo(() => {
        if (!exams || exams.length === 0) {
            return {
                totalExams: 0,
                totalQuestions: 0,
                totalDuration: 0,
                averageDuration: 0,
                averageQuestionsPerExam: 0,
            };
        }

        const totalExams = exams.length;

        const totalQuestions = exams.reduce(
            (sum: number, exam: ExamPublic | Exam) =>
                sum + (exam._count?.examQuestions ?? 0),
            0
        );

        const totalDuration = exams.reduce(
            (sum: number, exam: ExamPublic | Exam) =>
                sum + exam.durationMinutes,
            0
        );

        return {
            totalExams,
            totalQuestions,
            totalDuration,
            averageDuration: totalExams > 0 ? Math.round(totalDuration / totalExams) : 0,
            averageQuestionsPerExam: totalExams > 0 ? Math.round(totalQuestions / totalExams) : 0,
        };
    }, [exams]);
}

export default useExamsStats;