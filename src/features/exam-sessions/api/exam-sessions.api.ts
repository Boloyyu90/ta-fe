// src/features/exam-sessions/api/exam-sessions.api.ts

/**
 * EXAM SESSIONS API CLIENT
 *
 * ============================================================================
 * PHASE 2 FIX: Correct type parameter usage
 * ============================================================================
 *
 * apiClient methods return Promise<ApiResponse<T>>
 * We pass T (payload type), not ApiResponse<T>
 * Access payload via response.data
 *
 * Types imported from: @/features/exam-sessions/types/exam-sessions.types.ts (Phase 1)
 *
 * Backend endpoints:
 * - GET /api/v1/exam-sessions (user's sessions)
 * - GET /api/v1/exam-sessions/:id (session detail)
 * - GET /api/v1/exam-sessions/:id/questions (exam questions)
 * - POST /api/v1/exam-sessions/:id/answers (submit answer)
 * - POST /api/v1/exam-sessions/:id/submit (finish exam)
 * - GET /api/v1/exam-sessions/:id/answers (review answers)
 * - GET /api/v1/results (user's completed results)
 */

import { apiClient } from '@/shared/lib/api';
import type {
    // Query params
    GetUserExamsParams,
    GetMyResultsParams,
    // Request types
    SubmitAnswerRequest,
    // Response types (Phase 1 aligned)
    ExamSessionsListResponse,
    ExamSessionDetailResponse,
    ExamQuestionsResponse,
    SubmitAnswerResponse,
    SubmitExamResponse,
    ExamAnswersResponse,
    MyResultsResponse,
} from '../types/exam-sessions.types';

/**
 * Get user's exam sessions with optional status filter
 * GET /api/v1/exam-sessions
 *
 * @returns ExamSessionsListResponse = { data: UserExam[], pagination: PaginationMeta }
 */
export const getUserExams = async (
    params: GetUserExamsParams = {}
): Promise<ExamSessionsListResponse> => {
    const response = await apiClient.get<ExamSessionsListResponse>('/exam-sessions', {
        params,
    });
    return response.data;
};

/**
 * Get single exam session details
 * GET /api/v1/exam-sessions/:id
 *
 * @returns ExamSessionDetailResponse = { userExam: UserExam }
 */
export const getUserExam = async (sessionId: number): Promise<ExamSessionDetailResponse> => {
    const response = await apiClient.get<ExamSessionDetailResponse>(
        `/exam-sessions/${sessionId}`
    );
    return response.data;
};

/**
 * Get questions for active exam session
 * GET /api/v1/exam-sessions/:id/questions
 *
 * @returns ExamQuestionsResponse = { questions: ExamQuestion[], total: number }
 */
export const getExamQuestions = async (sessionId: number): Promise<ExamQuestionsResponse> => {
    const response = await apiClient.get<ExamQuestionsResponse>(
        `/exam-sessions/${sessionId}/questions`
    );
    return response.data;
};

/**
 * Submit a single answer
 * POST /api/v1/exam-sessions/:id/answers
 *
 * ⚠️ CRITICAL: Backend expects `selectedOption` not `selectedAnswer`
 *
 * @returns SubmitAnswerResponse = { answer: {...}, progress: {...} }
 */
export const submitAnswer = async (
    sessionId: number,
    data: SubmitAnswerRequest
): Promise<SubmitAnswerResponse> => {
    const response = await apiClient.post<SubmitAnswerResponse>(
        `/exam-sessions/${sessionId}/answers`,
        data
    );
    return response.data;
};

/**
 * Submit/finish exam
 * POST /api/v1/exam-sessions/:id/submit
 *
 * @returns SubmitExamResponse = { result: ExamResult }
 */
export const submitExam = async (sessionId: number): Promise<SubmitExamResponse> => {
    const response = await apiClient.post<SubmitExamResponse>(
        `/exam-sessions/${sessionId}/submit`
    );
    return response.data;
};

/**
 * Get answers for review (after submission)
 * GET /api/v1/exam-sessions/:id/answers
 *
 * @returns ExamAnswersResponse = { answers: AnswerWithQuestion[], total: number }
 */
export const getExamAnswers = async (sessionId: number): Promise<ExamAnswersResponse> => {
    const response = await apiClient.get<ExamAnswersResponse>(
        `/exam-sessions/${sessionId}/answers`
    );
    return response.data;
};

/**
 * Get user's exam results
 * GET /api/v1/results
 *
 * @returns MyResultsResponse = { data: ExamResult[], pagination: PaginationMeta }
 */
export const getMyResults = async (
    params: GetMyResultsParams = {}
): Promise<MyResultsResponse> => {
    const response = await apiClient.get<MyResultsResponse>('/results', { params });
    return response.data;
};

/**
 * Get single result details
 * GET /api/v1/results/:id
 *
 * @returns ExamSessionDetailResponse = { userExam: UserExam }
 */
export const getResultDetail = async (sessionId: number): Promise<ExamSessionDetailResponse> => {
    const response = await apiClient.get<ExamSessionDetailResponse>(`/results/${sessionId}`);
    return response.data;
};

// ============================================================================
// NAMED EXPORT OBJECT
// ============================================================================

export const examSessionsApi = {
    getUserExams,
    getUserExam,
    getExamQuestions,
    submitAnswer,
    submitExam,
    getExamAnswers,
    getMyResults,
    getResultDetail,
};