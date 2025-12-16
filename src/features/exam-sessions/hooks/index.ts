/**
 * Exam Sessions Hooks - Centralized exports
 *
 * Participant hooks:
 * - useUserExams: Get user's exam sessions (GET /exam-sessions)
 * - useExamSession: Get session detail (GET /exam-sessions/:id)
 * - useExamQuestions: Get exam questions (GET /exam-sessions/:id/questions)
 * - useSubmitAnswer: Submit answer (POST /exam-sessions/:id/answers)
 * - useSubmitExam: Submit/finish exam (POST /exam-sessions/:id/submit)
 * - useExamAnswers: Get answers for review (GET /exam-sessions/:id/answers)
 * - useMyResults: Get user's results (GET /results)
 * - useResultDetail: Get result detail (GET /exam-sessions/:id)
 * - useMyStats: Get dashboard stats (aggregated)
 *
 * Admin hooks:
 * - useAdminSessions: Get all sessions (GET /admin/exam-sessions)
 * - useAdminSessionAnswers: Get session answers (GET /admin/exam-sessions/:id/answers)
 */

// Participant hooks
export { useExamSession } from './useExamSession';
export { useExamQuestions } from './useExamQuestions';
export { useExamAnswers } from './useExamAnswers';
export { useSubmitAnswer } from './useSubmitAnswer';
export { useSubmitExam } from './useSubmitExam';
export { useMyResults } from './useMyResults';
export { useResultDetail } from './useResultDetail';
export { useUserExams } from './useUserExams';
export { useMyStats } from './useMyStats';

// Admin hooks
export { useAdminSessions } from './useAdminSessions';
export { useAdminSessionAnswers } from './useAdminSessionAnswers';