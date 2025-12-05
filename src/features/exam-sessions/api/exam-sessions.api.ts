// src/features/exam-sessions/api/exam-sessions.api.ts
import { apiClient } from '@/shared/lib/api';
import type { ApiResponse } from '@/shared/types/api.types';
import type {
    ExamSessionResponse,
    ExamQuestionsResponse,
    SubmitAnswerRequest,
    SubmitAnswerResponse,
    SubmitExamResponse,
    ExamAnswersResponse,
    MyResultsResponse,
    MyResultsParams,
    ExamSessionDetailResponse,
} from '../types/exam-sessions.types';

export const examSessionsApi = {
    /**
     * Get exam session details
     * GET /api/v1/exam-sessions/:id
     */
    getExamSession: async (sessionId: number): Promise<ExamSessionDetailResponse> => {
        const response = await apiClient.get<ApiResponse<ExamSessionDetailResponse>>(
            `/exam-sessions/${sessionId}`
        );
        return response.data;
    },

    /**
     * Get exam questions for a session
     * GET /api/v1/exam-sessions/:id/questions
     */
    getExamQuestions: async (sessionId: number): Promise<ExamQuestionsResponse> => {
        const response = await apiClient.get<ApiResponse<ExamQuestionsResponse>>(
            `/exam-sessions/${sessionId}/questions`
        );
        return response.data;
    },

    /**
     * Submit answer for a question
     * POST /api/v1/exam-sessions/:id/answers
     */
    submitAnswer: async (
        sessionId: number,
        data: SubmitAnswerRequest
    ): Promise<SubmitAnswerResponse> => {
        const response = await apiClient.post<ApiResponse<SubmitAnswerResponse>>(
            `/exam-sessions/${sessionId}/answers`,
            data
        );
        return response.data;
    },

    /**
     * Submit entire exam
     * POST /api/v1/exam-sessions/:id/submit
     */
    submitExam: async (sessionId: number): Promise<SubmitExamResponse> => {
        const response = await apiClient.post<ApiResponse<SubmitExamResponse>>(
            `/exam-sessions/${sessionId}/submit`
        );
        return response.data;
    },

    /**
     * Get exam answers with correctness (for review page)
     * GET /api/v1/exam-sessions/:id/answers
     */
    getExamAnswers: async (sessionId: number): Promise<ExamAnswersResponse> => {
        const response = await apiClient.get<ApiResponse<ExamAnswersResponse>>(
            `/exam-sessions/${sessionId}/answers`
        );
        return response.data;
    },

    /**
     * Get user's exam sessions
     * GET /api/v1/exam-sessions
     *
     * ✅ FIXED: This is the correct endpoint (not /my-exams)
     * Backend automatically filters by authenticated user
     */
    getUserExams: async (params?: { page?: number; limit?: number; status?: string }) => {
        const { page = 1, limit = 10, status } = params || {};

        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (status) queryParams.append('status', status);

        const response = await apiClient.get<ApiResponse<any>>(
            `/exam-sessions?${queryParams.toString()}`
        );
        return response.data;
    },

    /**
     * Get my results (paginated list)
     * GET /api/v1/results
     *
     * ✅ FIXED: Correct endpoint is /results (not /exam-sessions/my-results)
     */
    getMyResults: async (params: MyResultsParams = {}): Promise<MyResultsResponse> => {
        const { page = 1, limit = 10, status } = params;

        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (status) {
            queryParams.append('status', status);
        }

        const response = await apiClient.get<ApiResponse<MyResultsResponse>>(
            `/results?${queryParams.toString()}`
        );
        return response.data;
    },
};