// src/features/exam-sessions/api/exam-sessions.api.ts
import { apiClient } from '@/shared/lib/api';
import type {
    StartExamResponse,
    UserExamsListResponse,
    ExamSessionDetailResponse,
    ExamQuestionsResponse,
    SubmitAnswerRequest,
    SubmitAnswerResponse,
    SubmitExamResponse,
    ExamAnswersResponse,
    ResultsListResponse,
    UserExamsQueryParams,
    ResultsQueryParams,
} from '../types/exam-sessions.types';

/**
 * Exam Sessions API Client
 * Implements all 9 exam session endpoints from backend
 *
 * NOTE: apiClient.get() returns the unwrapped response body via interceptor
 * Backend response: { success: true, data: {...}, message: string, timestamp: string }
 * Interceptor unwraps to: { success: true, data: {...}, message: string, timestamp: string }
 * We access .data to get the actual payload
 */
export const examSessionsApi = {
    // ============================================================================
    // PARTICIPANT ENDPOINTS (7)
    // ============================================================================

    /**
     * Get my exam sessions
     * GET /exam-sessions
     */
    async getUserExams(params?: UserExamsQueryParams): Promise<UserExamsListResponse> {
        const response = await apiClient.get<{ success: boolean; data: UserExamsListResponse }>(
            '/exam-sessions',
            { params }
        );
        return response.data;
    },

    /**
     * Get exam session detail
     * GET /exam-sessions/:id
     */
    async getExamSession(sessionId: number): Promise<ExamSessionDetailResponse> {
        const response = await apiClient.get<{ success: boolean; data: ExamSessionDetailResponse }>(
            `/exam-sessions/${sessionId}`
        );
        return response.data;
    },

    /**
     * Get exam questions for active session
     * GET /exam-sessions/:id/questions
     */
    async getExamQuestions(sessionId: number): Promise<ExamQuestionsResponse> {
        const response = await apiClient.get<{ success: boolean; data: ExamQuestionsResponse }>(
            `/exam-sessions/${sessionId}/questions`
        );
        return response.data;
    },

    /**
     * Submit/update answer (auto-save)
     * POST /exam-sessions/:id/answers
     */
    async submitAnswer(
        sessionId: number,
        data: SubmitAnswerRequest
    ): Promise<SubmitAnswerResponse> {
        const response = await apiClient.post<{ success: boolean; data: SubmitAnswerResponse }>(
            `/exam-sessions/${sessionId}/answers`,
            data
        );
        return response.data;
    },

    /**
     * Submit exam (finalize)
     * POST /exam-sessions/:id/submit
     */
    async submitExam(sessionId: number): Promise<SubmitExamResponse> {
        const response = await apiClient.post<{ success: boolean; data: SubmitExamResponse }>(
            `/exam-sessions/${sessionId}/submit`
        );
        return response.data;
    },

    /**
     * Get exam answers (for review after submission)
     * GET /exam-sessions/:id/answers
     */
    async getExamAnswers(sessionId: number): Promise<ExamAnswersResponse> {
        const response = await apiClient.get<{ success: boolean; data: ExamAnswersResponse }>(
            `/exam-sessions/${sessionId}/answers`
        );
        return response.data;
    },

    /**
     * Get my results
     * GET /results
     */
    async getMyResults(params?: ResultsQueryParams): Promise<ResultsListResponse> {
        const response = await apiClient.get<{ success: boolean; data: ResultsListResponse }>(
            '/results',
            { params }
        );
        return response.data;
    },

    // ============================================================================
    // ADMIN ENDPOINTS (2)
    // ============================================================================

    /**
     * Get all results (admin only)
     * GET /admin/results
     */
    async getAllResults(params?: ResultsQueryParams): Promise<ResultsListResponse> {
        const response = await apiClient.get<{ success: boolean; data: ResultsListResponse }>(
            '/admin/results',
            { params }
        );
        return response.data;
    },

    /**
     * Get exam session detail (admin view with full details)
     * GET /admin/exam-sessions/:id
     */
    async getExamSessionAdmin(sessionId: number): Promise<ExamSessionDetailResponse> {
        const response = await apiClient.get<{ success: boolean; data: ExamSessionDetailResponse }>(
            `/admin/exam-sessions/${sessionId}`
        );
        return response.data;
    },
};