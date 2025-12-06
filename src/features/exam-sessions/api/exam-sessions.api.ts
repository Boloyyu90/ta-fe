// src/features/exam-sessions/api/exam-sessions.api.ts

/**
 * Exam Sessions API Client
 *
 * ⚠️ CRITICAL FIX: Import ApiResponse from shared types, not local types
 */

import { apiClient } from '@/shared/lib/api';
import type { ApiResponse } from '@/shared/types/api.types'; // ✅ FIXED: Import from shared
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
    GetUserExamsParams, // ✅ Now exported from types
} from '../types/exam-sessions.types';

/**
 * Get all exam sessions for the current user
 */
export const getUserExams = async (
    params?: GetUserExamsParams
): Promise<{ data: UserExam[]; pagination: any }> => {
    try {
        const response = await apiClient.get<ApiResponse<{ data: UserExam[]; pagination: any }>>(
            '/exam-sessions',
            { params }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching user exams:', error);
        throw error;
    }
};

/**
 * Get a specific exam session detail
 */
export const getExamSession = async (sessionId: number): Promise<ExamSessionDetailResponse> => {
    try {
        const response = await apiClient.get<ApiResponse<ExamSessionDetailResponse>>(
            `/exam-sessions/${sessionId}`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching exam session:', error);
        throw error;
    }
};

/**
 * Get questions for an exam session
 */
export const getExamQuestions = async (sessionId: number): Promise<ExamQuestionsResponse> => {
    try {
        const response = await apiClient.get<ApiResponse<ExamQuestionsResponse>>(
            `/exam-sessions/${sessionId}/questions`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching exam questions:', error);
        throw error;
    }
};

/**
 * Submit an answer for a question
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
        return response.data;
    } catch (error) {
        console.error('Error submitting answer:', error);
        throw error;
    }
};

/**
 * Submit (finish) an exam session
 */
export const submitExam = async (sessionId: number): Promise<SubmitExamResponse> => {
    try {
        const response = await apiClient.post<ApiResponse<SubmitExamResponse>>(
            `/exam-sessions/${sessionId}/submit`
        );
        return response.data;
    } catch (error) {
        console.error('Error submitting exam:', error);
        throw error;
    }
};

/**
 * Get submitted answers for an exam session
 */
export const getExamAnswers = async (sessionId: number): Promise<ExamAnswersResponse> => {
    try {
        const response = await apiClient.get<ApiResponse<ExamAnswersResponse>>(
            `/exam-sessions/${sessionId}/answers`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching exam answers:', error);
        throw error;
    }
};

/**
 * Get user's completed exam results
 */
export const getMyResults = async (params?: {
    page?: number;
    limit?: number;
}): Promise<MyResultsResponse> => {
    try {
        const response = await apiClient.get<ApiResponse<MyResultsResponse>>(
            '/exam-sessions/my-results',
            { params }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching results:', error);
        throw error;
    }
};

// Export as namespace for cleaner imports
export const examSessionsApi = {
    getUserExams,
    getExamSession,
    getExamQuestions,
    submitAnswer,
    submitExam,
    getExamAnswers,
    getMyResults,
};