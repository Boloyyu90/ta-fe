/**
 * Exam Sessions API Client
 *
 * CRITICAL: This file handles API responses from the backend which follow this structure:
 * {
 *   success: true,
 *   message: "...",
 *   data: {
 *     data: [...],      // The actual array of items
 *     pagination: {...} // Pagination metadata
 *   }
 * }
 *
 * Our apiClient interceptor unwraps the first level (response.data),
 * so we receive: { data: [...], pagination: {...} }
 *
 * We return this FULL object so components can access .data and .pagination
 */

import { apiClient } from '@/shared/lib/api';
import type { ApiResponse } from '@/features/exam-sessions/types/exam-sessions.types';
import type {
    UserExam,
    ExamSessionDetailResponse,
    ExamQuestionsResponse,
    ExamAnswersResponse,
    SubmitAnswerRequest,
    SubmitAnswerResponse,
    SubmitExamResponse,
    UserExamStatus,
    MyResultsResponse,
} from '../types/exam-sessions.types';

/**
 * Get all exam sessions for the current user
 * @param params - Filter parameters
 * @returns Promise with { data: UserExam[], pagination: PaginationMeta }
 */
export const getUserExams = async (params?: {
    status?: UserExamStatus;
    page?: number;
    limit?: number;
}): Promise<{ data: UserExam[]; pagination: any }> => {
    try {
        // Backend returns: { success, message, data: { data: [...], pagination: {...} } }
        // apiClient unwraps to: { data: [...], pagination: {...} }
        const response = await apiClient.get<ApiResponse<{ data: UserExam[]; pagination: any }>>(
            '/exam-sessions',
            { params }
        );

        // Return the full data object with array and pagination
        return response.data;
    } catch (error) {
        console.error('Error fetching user exams:', error);
        throw error;
    }
};

/**
 * Get a specific exam session detail
 * @param sessionId - User exam ID
 * @returns Promise with { userExam: UserExam }
 */
export const getExamSession = async (sessionId: number): Promise<ExamSessionDetailResponse> => {
    try {
        // Backend returns: { success, message, data: { userExam: {...} } }
        // apiClient unwraps to: { userExam: {...} }
        const response = await apiClient.get<ApiResponse<ExamSessionDetailResponse>>(
            `/exam-sessions/${sessionId}`
        );

        // Return the full data object
        return response.data;
    } catch (error) {
        console.error('Error fetching exam session:', error);
        throw error;
    }
};

/**
 * Get questions for an exam session
 * @param sessionId - User exam ID
 * @returns Promise with { questions: ExamQuestion[], total: number }
 */
export const getExamQuestions = async (sessionId: number): Promise<ExamQuestionsResponse> => {
    try {
        // Backend returns: { success, message, data: { questions: [...], total: number } }
        // apiClient unwraps to: { questions: [...], total: number }
        const response = await apiClient.get<ApiResponse<ExamQuestionsResponse>>(
            `/exam-sessions/${sessionId}/questions`
        );

        // Return the full data object
        return response.data;
    } catch (error) {
        console.error('Error fetching exam questions:', error);
        throw error;
    }
};

/**
 * Submit an answer for a question
 * @param sessionId - User exam ID
 * @param data - Answer submission data
 * @returns Promise with { answer: ExamAnswer }
 */
export const submitAnswer = async (
    sessionId: number,
    data: SubmitAnswerRequest
): Promise<SubmitAnswerResponse> => {
    try {
        // Backend returns: { success, message, data: { answer: {...} } }
        // apiClient unwraps to: { answer: {...} }
        const response = await apiClient.post<ApiResponse<SubmitAnswerResponse>>(
            `/exam-sessions/${sessionId}/answers`,
            data
        );

        // Return the full data object
        return response.data;
    } catch (error) {
        console.error('Error submitting answer:', error);
        throw error;
    }
};

/**
 * Submit (finish) an exam session
 * @param sessionId - User exam ID
 * @returns Promise with { result: UserExam }
 */
export const submitExam = async (sessionId: number): Promise<SubmitExamResponse> => {
    try {
        // Backend returns: { success, message, data: { result: {...} } }
        // apiClient unwraps to: { result: {...} }
        const response = await apiClient.post<ApiResponse<SubmitExamResponse>>(
            `/exam-sessions/${sessionId}/submit`
        );

        // Return the full data object
        return response.data;
    } catch (error) {
        console.error('Error submitting exam:', error);
        throw error;
    }
};

/**
 * Get submitted answers for an exam session
 * @param sessionId - User exam ID
 * @returns Promise with { answers: AnswerWithQuestion[], total: number }
 */
export const getExamAnswers = async (sessionId: number): Promise<ExamAnswersResponse> => {
    try {
        // Backend returns: { success, message, data: { answers: [...], total: number } }
        // apiClient unwraps to: { answers: [...], total: number }
        const response = await apiClient.get<ApiResponse<ExamAnswersResponse>>(
            `/exam-sessions/${sessionId}/answers`
        );

        // Return the full data object
        return response.data;
    } catch (error) {
        console.error('Error fetching exam answers:', error);
        throw error;
    }
};

/**
 * Get user's completed exam results
 * @param params - Filter parameters
 * @returns Promise with { data: UserExam[], pagination: PaginationMeta }
 */
export const getMyResults = async (params?: {
    page?: number;
    limit?: number;
}): Promise<MyResultsResponse> => {
    try {
        // Backend returns: { success, message, data: { data: [...], pagination: {...} } }
        // apiClient unwraps to: { data: [...], pagination: {...} }
        const response = await apiClient.get<ApiResponse<MyResultsResponse>>(
            '/exam-sessions/my-results',
            { params }
        );

        // Return the full data object with array and pagination
        return response.data;
    } catch (error) {
        console.error('Error fetching my results:', error);
        throw error;
    }
};

/**
 * Get a specific result detail
 * @param sessionId - User exam ID
 * @returns Promise with { userExam: UserExam }
 */
export const getResultDetail = async (sessionId: number): Promise<ExamSessionDetailResponse> => {
    try {
        // Same as getExamSession - backend returns: { success, message, data: { userExam: {...} } }
        const response = await apiClient.get<ApiResponse<ExamSessionDetailResponse>>(
            `/exam-sessions/${sessionId}`
        );

        // Return the full data object
        return response.data;
    } catch (error) {
        console.error('Error fetching result detail:', error);
        throw error;
    }
};

// Export all functions
export const examSessionsApi = {
    getUserExams,
    getExamSession,
    getExamQuestions,
    submitAnswer,
    submitExam,
    getExamAnswers,
    getMyResults,
    getResultDetail,
};