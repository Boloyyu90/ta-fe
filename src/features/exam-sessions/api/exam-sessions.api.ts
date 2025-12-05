// src/features/exam-sessions/api/exam-sessions.api.ts

/**
 * EXAM SESSIONS API CLIENT
 *
 * ✅ Correct response unwrapping for ApiResponse wrapper
 * ✅ Returns actual data payload, not wrapped response
 */

import { apiClient } from '@/shared/lib/api';
import type { ApiResponse } from '@/shared/types/api.types';
import type {
    ExamSessionDetailResponse,
    ExamQuestionsResponse,
    SubmitAnswerRequest,
    SubmitAnswerResponse,
    SubmitExamResponse,
    ExamAnswersResponse,
    MyResultsResponse,
    MyResultsParams,
    GetUserExamsParams,
    UserExam,
    PaginationMeta,
} from '../types/exam-sessions.types';

export const examSessionsApi = {
    /**
     * Get user's exam sessions
     * GET /api/v1/exam-sessions
     */
    getUserExams: async (params?: GetUserExamsParams) => {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.status) queryParams.append('status', params.status);

        const queryString = queryParams.toString();
        const url = queryString ? `/exam-sessions?${queryString}` : '/exam-sessions';

        const response = await apiClient.get<ApiResponse<{ data: UserExam[], pagination: PaginationMeta }>>(url);
        // Backend returns: { success: true, data: { data: [...], pagination: {...} } }
        return response.data.data; // Unwrap to get { data: [...], pagination: {...} }
    },

    /**
     * Get exam session details
     * GET /api/v1/exam-sessions/:id
     */
    getExamSession: async (sessionId: number) => {
        const response = await apiClient.get<ApiResponse<ExamSessionDetailResponse>>(
            `/exam-sessions/${sessionId}`
        );
        // Backend returns: { success: true, data: { data: { userExam: {...}, questions: [...], answers: [...] } } }
        return response.data.data; // Unwrap to get the data object
    },

    /**
     * Get exam questions for a session
     * GET /api/v1/exam-sessions/:id/questions
     */
    getExamQuestions: async (sessionId: number) => {
        const response = await apiClient.get<ApiResponse<ExamQuestionsResponse>>(
            `/exam-sessions/${sessionId}/questions`
        );
        // Backend returns: { success: true, data: { data: [...questions...] } }
        return response.data.data; // Unwrap to get the data object
    },

    /**
     * Submit answer for a question (auto-save)
     * POST /api/v1/exam-sessions/:id/answers
     */
    submitAnswer: async (
        sessionId: number,
        data: SubmitAnswerRequest
    ) => {
        const response = await apiClient.post<ApiResponse<SubmitAnswerResponse>>(
            `/exam-sessions/${sessionId}/answers`,
            data
        );
        // Backend returns: { success: true, data: { data: { answer: {...} } } }
        return response.data.data; // Unwrap to get { data: {...} }
    },

    /**
     * Submit entire exam (finalize)
     * POST /api/v1/exam-sessions/:id/submit
     */
    submitExam: async (sessionId: number) => {
        const response = await apiClient.post<ApiResponse<SubmitExamResponse>>(
            `/exam-sessions/${sessionId}/submit`
        );
        // Backend returns: { success: true, data: { data: { result: {...} } } }
        return response.data.data; // Unwrap to get { data: { result: {...} } }
    },

    /**
     * Get exam answers with correctness (for review page)
     * GET /api/v1/exam-sessions/:id/answers
     */
    getExamAnswers: async (sessionId: number) => {
        const response = await apiClient.get<ApiResponse<ExamAnswersResponse>>(
            `/exam-sessions/${sessionId}/answers`
        );
        // Backend returns: { success: true, data: { data: [...answers...] } }
        return response.data.data; // Unwrap to get { data: [...] }
    },

    /**
     * Get my results (completed exams)
     * GET /api/v1/results
     */
    getMyResults: async (params?: MyResultsParams) => {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.status) queryParams.append('status', params.status);

        const queryString = queryParams.toString();
        const url = queryString ? `/results?${queryString}` : '/results';

        const response = await apiClient.get<ApiResponse<MyResultsResponse>>(url);
        // Backend returns: { success: true, data: { data: [...], pagination: {...} } }
        return response.data.data; // Unwrap to get { data: [...], pagination: {...} }
    },

    /**
     * Get result detail
     * GET /api/v1/results/:id
     */
    getResultDetail: async (sessionId: number) => {
        const response = await apiClient.get<ApiResponse<ExamSessionDetailResponse>>(
            `/results/${sessionId}`
        );
        // Backend returns: { success: true, data: { data: { userExam: {...} } } }
        return response.data.data; // Unwrap to get { data: { userExam: {...} } }
    },
};