// src/features/exam-sessions/types/exam-sessions.types.ts

/**
 * Exam Sessions Types
 *
 * ⚠️ CRITICAL: Backend uses `selectedOption` NOT `selectedAnswer`
 * See Backend API Contract page 22
 *
 * ✅ AUDIT FIX v2: Corrected all types to match backend contract exactly
 * - Fixed PaginationMeta structure
 * - Fixed ExamResult to be standalone (not extend UserExam)
 * - Fixed API endpoint awareness in comments
 *
 * DISTINCTIONS:
 * 1. ExamStatus: Status of exam definition (DRAFT, PUBLISHED, ARCHIVED)
 * 2. UserExamStatus: Status of participant's session (NOT_STARTED, IN_PROGRESS, etc.)
 */

import type { PaginationMeta } from '@/shared/types/api.types';

// ============================================================================
// STATUS ENUMS
// ============================================================================

export type ExamStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type UserExamStatus =
    | 'NOT_STARTED'
    | 'IN_PROGRESS'
    | 'FINISHED'
    | 'TIMEOUT'
    | 'CANCELLED'
    | 'COMPLETED';

export type QuestionType = 'TIU' | 'TWK' | 'TKP';

// ============================================================================
// QUESTION MODELS
// ============================================================================

export interface QuestionOptions {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
}

export interface Question {
    id: number;
    content: string;
    options: QuestionOptions;
    correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
    questionType: QuestionType;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Question as returned during exam (without correctAnswer)
 * Used by GET /exam-sessions/:id/questions
 */
export interface ExamQuestion {
    id: number;
    examQuestionId: number;
    content: string;
    options: QuestionOptions;
    questionType: QuestionType;
    orderNumber: number;
    imageUrl?: string;
}

export type ParticipantQuestion = ExamQuestion;

// ============================================================================
// EXAM MODELS
// ============================================================================

/**
 * Exam entity as used within UserExam
 */
export interface Exam {
    id: number;
    title: string;
    description?: string | null;
    durationMinutes: number;
    passingScore: number;
    totalQuestions?: number;
    isActive?: boolean;
    startTime?: string | null;
    endTime?: string | null;
    createdAt: string;
    updatedAt: string;
}

/**
 * Minimal exam info in result responses
 */
export interface ExamSummary {
    id: number;
    title: string;
    description: string | null;
}

// ============================================================================
// USER EXAM SESSION MODELS
// ============================================================================

/**
 * User's exam session (UserExam)
 * Used by GET /exam-sessions and GET /exam-sessions/:id
 */
export interface UserExam {
    id: number;
    userId: number;
    examId: number;
    status: UserExamStatus;
    remainingTimeMs: number | null;
    durationMinutes: number | null;
    answeredQuestions: number;
    totalQuestions: number;
    startTime?: string;
    endTime?: string;
    submittedAt?: string | null;
    timeSpent?: number;
    totalScore?: number | null;
    tiuScore?: number | null;
    twkScore?: number | null;
    tkpScore?: number | null;
    violationCount?: number;
    createdAt: string;
    updatedAt: string;
    exam: Exam;
}

// ============================================================================
// SCORE BREAKDOWN TYPES
// ============================================================================

/**
 * Score breakdown by question type
 * ✅ Matches backend API contract page 23-24
 */
export interface ScoreByType {
    type: QuestionType; // 'TIU' | 'TWK' | 'TKP'
    score: number;
    maxScore: number;
    correctAnswers: number;
    totalQuestions: number;
}

/**
 * User info in result responses
 */
export interface ResultUserInfo {
    id: number;
    name: string;
    email: string;
}

/**
 * ExamResult - Result object returned by /results endpoint
 *
 * ⚠️ CRITICAL: This is NOT the same as UserExam!
 * The backend returns a different shape for results.
 *
 * Backend source: GET /api/v1/results
 */
export interface ExamResult {
    id: number;
    exam: ExamSummary;
    user: ResultUserInfo;
    startedAt: string;
    submittedAt: string | null;
    totalScore: number | null;
    status: UserExamStatus;
    duration: number | null; // in seconds
    answeredQuestions: number;
    totalQuestions: number;
    scoresByType: ScoreByType[]; // May be empty array
}

// ============================================================================
// ANSWER MODELS (⚠️ Backend uses selectedOption, not selectedAnswer!)
// ============================================================================

/**
 * User's submitted answer
 * ⚠️ CRITICAL: Backend field is `selectedOption` not `selectedAnswer`
 */
export interface ExamAnswer {
    id: number;
    userExamId: number;
    examQuestionId: number;
    selectedOption: 'A' | 'B' | 'C' | 'D' | 'E' | null;
    isCorrect: boolean;
    answeredAt?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Answer with associated question (for review pages)
 */
export interface AnswerWithQuestion extends ExamAnswer {
    examQuestion: ExamQuestion;
}

// ============================================================================
// API REQUEST TYPES
// ============================================================================

/**
 * Request to submit an answer
 * ⚠️ Backend expects `selectedOption` not `selectedAnswer`
 */
export interface SubmitAnswerRequest {
    examQuestionId: number;
    selectedOption: 'A' | 'B' | 'C' | 'D' | 'E' | null;
}

/**
 * Query params for getUserExams
 */
export interface GetUserExamsParams {
    status?: UserExamStatus;
    page?: number;
    limit?: number;
}

/**
 * Query params for getMyResults
 */
export interface GetMyResultsParams {
    page?: number;
    limit?: number;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * GET /exam-sessions/:id response
 */
export interface ExamSessionDetailResponse {
    userExam: UserExam;
}

/**
 * GET /exam-sessions/:id/questions response
 */
export interface ExamQuestionsResponse {
    questions: ExamQuestion[];
    total: number;
}

/**
 * GET /exam-sessions/:id/answers response
 */
export interface ExamAnswersResponse {
    answers: AnswerWithQuestion[];
    total: number;
}

/**
 * POST /exam-sessions/:id/answers response
 * ✅ AUDIT FIX: Added progress field (Backend API Contract page 22)
 */
export interface SubmitAnswerResponse {
    answer: {
        examQuestionId: number;
        selectedOption: 'A' | 'B' | 'C' | 'D' | 'E' | null;
        answeredAt: string;
    };
    progress: {
        answered: number;
        total: number;
        percentage: number;
    };
}

/**
 * POST /exam-sessions/:id/submit response
 * ✅ AUDIT FIX: Uses ExamResult, not UserExam
 */
export interface SubmitExamResponse {
    result: ExamResult;
}

/**
 * GET /exam-sessions response (user's exam sessions list)
 * ✅ AUDIT FIX: Uses correct PaginationMeta structure
 */
export interface ExamSessionsListResponse {
    data: UserExam[];
    pagination: PaginationMeta;
}

/**
 * GET /results response (user's completed exam results)
 *
 * ⚠️ CRITICAL: This is from /results endpoint, NOT /exam-sessions
 * ✅ AUDIT FIX: Uses correct PaginationMeta structure
 */
export interface MyResultsResponse {
    data: ExamResult[];
    pagination: PaginationMeta;
}

// ============================================================================
// UI HELPER TYPES
// ============================================================================

export interface StatusConfig {
    label: string;
    color: string;
    icon?: React.ComponentType<{ className?: string }>;
}

export type UserExamStatusConfig = Record<UserExamStatus, StatusConfig>;

// ============================================================================
// UTILITY TYPE GUARDS
// ============================================================================

/**
 * Check if an exam result is passing based on exam's passingScore
 */
export function isPassingResult(result: ExamResult, passingScore: number): boolean {
    return (result.totalScore ?? 0) >= passingScore;
}

/**
 * Check if a session is active (can be continued)
 */
export function isActiveSession(status: UserExamStatus): boolean {
    return status === 'IN_PROGRESS' || status === 'NOT_STARTED';
}

/**
 * Check if a session is completed (shows in results)
 */
export function isCompletedSession(status: UserExamStatus): boolean {
    return status === 'FINISHED' || status === 'TIMEOUT' || status === 'CANCELLED' || status === 'COMPLETED';
}