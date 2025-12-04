// src/features/exam-sessions/api/exam-sessions.api.ts
import { apiClient } from '@/shared/lib/api';
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
    // Get exam session details
    getExamSession: async (sessionId: number): Promise<ExamSessionDetailResponse> => {
        const response = await apiClient.get(`/exam-sessions/${sessionId}`);
        return response.data;
    },

    // Get exam questions for a session
    getExamQuestions: async (sessionId: number): Promise<ExamQuestionsResponse> => {
        const response = await apiClient.get(`/exam-sessions/${sessionId}/questions`);
        return response.data;
    },

    // Submit answer for a question
    submitAnswer: async (
        sessionId: number,
        data: SubmitAnswerRequest
    ): Promise<SubmitAnswerResponse> => {
        const response = await apiClient.post(`/exam-sessions/${sessionId}/answers`, data);
        return response.data;
    },

    // Submit entire exam
    submitExam: async (sessionId: number): Promise<SubmitExamResponse> => {
        const response = await apiClient.post(`/exam-sessions/${sessionId}/submit`);
        return response.data;
    },

    // Get exam answers with correctness (for review page)
    getExamAnswers: async (sessionId: number): Promise<ExamAnswersResponse> => {
        const response = await apiClient.get(`/exam-sessions/${sessionId}/answers`);
        return response.data;
    },

    // Get my results (paginated list)
    getMyResults: async (params: MyResultsParams = {}): Promise<MyResultsResponse> => {
        const { page = 1, limit = 10, status } = params;

        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (status) {
            queryParams.append('status', status);
        }

        const response = await apiClient.get(`/exam-sessions/my-results?${queryParams.toString()}`);
        return response.data;
    },
};