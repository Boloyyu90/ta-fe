// src/features/exam-sessions/api/exam-sessions.api.ts

/**
 * Exam Sessions API Client
 *
 * ✅ AUDIT FIX v2:
 * - Fixed getMyResults to use /results endpoint (was /exam-sessions/my-results)
 * - Consistent response unwrapping pattern
 * - All endpoints return the inner data (not ApiResponse wrapper)
 *
 * Backend endpoints:
 * - GET /api/v1/exam-sessions (user's sessions)
 * - GET /api/v1/exam-sessions/:id (session detail)
 * - GET /api/v1/exam-sessions/:id/questions (exam questions)
 * - POST /api/v1/exam-sessions/:id/answers (submit answer)
 * - POST /api/v1/exam-sessions/:id/submit (finish exam)
 * - GET /api/v1/exam-sessions/:id/answers (review answers)
 * - GET /api/v1/results (user's completed results) ← Note: different base path!
 */

import { apiClient } from '@/shared/lib/api';
import type { ApiResponse } from '@/shared/types/api.types';
import type {
    GetUserExamsParams,
    GetMyResultsParams,
    ExamSessionsListResponse,
    ExamSessionDetailResponse,
    ExamQuestionsResponse,
    SubmitAnswerRequest,
    SubmitAnswerResponse,
    SubmitExamResponse,
    ExamAnswersResponse,
    MyResultsResponse,
    UserExam,
} from '../types/exam-sessions.types';

/**
 * Get user's exam sessions with optional status filter
 * GET /api/v1/exam-sessions
 */
export const getUserExams = async (
    params: GetUserExamsParams = {}
): Promise<ExamSessionsListResponse> => {
    try {
        const response = await apiClient.get<ApiResponse<ExamSessionsListResponse>>(
            '/exam-sessions',
            { params }
        );
        // Unwrap ApiResponse to get inner data
        return response.data.data;
    } catch (error) {
        console.error('Error fetching user exams:', error);
        throw error;
    }
};

/**
 * Get a specific exam session detail
 * GET /api/v1/exam-sessions/:id
 */
export const getExamSession = async (sessionId: number): Promise<ExamSessionDetailResponse> => {
    try {
        const response = await apiClient.get<ApiResponse<ExamSessionDetailResponse>>(
            `/exam-sessions/${sessionId}`
        );
        return response.data.data;
    } catch (error) {
        console.error('Error fetching exam session:', error);
        throw error;
    }
};

/**
 * Get questions for an exam session
 * GET /api/v1/exam-sessions/:id/questions
 */
export const getExamQuestions = async (sessionId: number): Promise<ExamQuestionsResponse> => {
    try {
        const response = await apiClient.get<ApiResponse<ExamQuestionsResponse>>(
            `/exam-sessions/${sessionId}/questions`
        );
        return response.data.data;
    } catch (error) {
        console.error('Error fetching exam questions:', error);
        throw error;
    }
};

/**
 * Submit an answer for a question (auto-save)
 * POST /api/v1/exam-sessions/:id/answers
 *
 * ⚠️ Request uses `selectedOption` not `selectedAnswer`
 */
export const submitAnswer = async (
    sessionId: number,
    data: SubmitAnswerRequest
): Promise<SubmitAnswerResponse> => {
    try {
        const response = await apiClient.post<ApiResponse<SubmitAnswerResponse>>(
            `/exam-sessions/${sessionId}/answers`,
            data
        );
        return response.data.data;
    } catch (error) {
        console.error('Error submitting answer:', error);
        throw error;
    }
};

/**
 * Submit (finish) an exam session
 * POST /api/v1/exam-sessions/:id/submit
 */
export const submitExam = async (sessionId: number): Promise<SubmitExamResponse> => {
    try {
        const response = await apiClient.post<ApiResponse<SubmitExamResponse>>(
            `/exam-sessions/${sessionId}/submit`
        );
        return response.data.data;
    } catch (error) {
        console.error('Error submitting exam:', error);
        throw error;
    }
};

/**
 * Get submitted answers for an exam session (review after submit)
 * GET /api/v1/exam-sessions/:id/answers
 */
export const getExamAnswers = async (sessionId: number): Promise<ExamAnswersResponse> => {
    try {
        const response = await apiClient.get<ApiResponse<ExamAnswersResponse>>(
            `/exam-sessions/${sessionId}/answers`
        );
        return response.data.data;
    } catch (error) {
        console.error('Error fetching exam answers:', error);
        throw error;
    }
};

/**
 * Get user's completed exam results
 *
 * ⚠️ CRITICAL FIX: This uses /results, NOT /exam-sessions/my-results
 * GET /api/v1/results
 */
export const getMyResults = async (
    params: GetMyResultsParams = {}
): Promise<MyResultsResponse> => {
    try {
        const response = await apiClient.get<ApiResponse<MyResultsResponse>>(
            '/results', // ✅ FIXED: Was '/exam-sessions/my-results'
            { params }
        );
        return response.data.data;
    } catch (error) {
        console.error('Error fetching results:', error);
        throw error;
    }
};

// ============================================================================
// NAMED EXPORT OBJECT
// ============================================================================

export const examSessionsApi = {
    getUserExams,
    getExamSession,
    getExamQuestions,
    submitAnswer,
    submitExam,
    getExamAnswers,
    getMyResults,
};