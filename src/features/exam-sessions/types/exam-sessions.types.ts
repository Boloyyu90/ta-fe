/**
 * EXAM SESSIONS TYPES
 */

import type {
    ExamStatus,
    QuestionType,
    AnswerOption,
} from '@/shared/types/enum.types';
import type { PaginationMeta } from '@/shared/types/api.types';

// Re-export for convenience (avoids breaking existing imports)
export type { ExamStatus, QuestionType };

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
    correctAnswer: Exclude<AnswerOption, null>;
    questionType: QuestionType;
    defaultScore: number;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Question as seen by participant during exam
 *
 * IMPORTANT: Backend returns BOTH fields:
 * - id: Question bank ID (original question)
 * - examQuestionId: ExamQuestion junction table ID
 *
 * ALWAYS use examQuestionId for answer submission!
 */
export interface ExamQuestion {
    id: number;              // Question bank ID (for reference only)
    examQuestionId: number;  // ExamQuestion ID - USE THIS for answer submission!
    content: string;
    options: QuestionOptions;
    questionType: QuestionType;
    orderNumber: number;
    imageUrl?: string;
}

// ============================================================================
// EXAM MODELS (Simplified for session context)
// ============================================================================

/**
 * Exam info as returned in UserExam and ExamResult responses
 * Note: For list responses (GET /exam-sessions), use ExamInfoInList instead
 *
 * Updated: passingScore is now REQUIRED - backend always sends it
 */
export interface ExamInfo {
    id: number;
    title: string;
    description: string | null;
    passingScore: number;       // ✅ REQUIRED - backend always sends this
    durationMinutes?: number;   // Optional for some contexts
    allowRetake?: boolean;
    maxAttempts?: number | null;
}

/**
 * Exam info for list responses (GET /exam-sessions)
 * Contract requires allowRetake and maxAttempts to be present
 * Source: openapi-spec.yaml UserExamListItem.exam (lines 484-495)
 *
 * ✅ FIX: Added durationMinutes - backend returns this in exam object
 */
export interface ExamInfoInList {
    id: number;
    title: string;
    description: string | null;
    durationMinutes?: number;    // ✅ FIX: Backend returns this in getUserExam
    allowRetake: boolean;        // Required per contract
    maxAttempts: number | null;  // Required (nullable) per contract
}

/**
 * Extended exam info with duration (for exam taking)
 */
export interface ExamWithDuration extends ExamInfo {
    durationMinutes: number;
}

// ============================================================================
// USER EXAM SESSION MODELS
// ============================================================================

/**
 * User exam session (participant's attempt at an exam)
 *
 * NOTE: Backend always provides startedAt when session exists.
 * This matches GET /exam-sessions response structure.
 */
export interface UserExam {
    id: number;
    userId: number;
    attemptNumber: number;
    examId: number;
    status: ExamStatus;
    startedAt: string;              // ✅ FIX: Backend always provides this (non-null)
    submittedAt: string | null;
    totalScore: number | null;
    remainingTimeMs: number | null;
    durationMinutes: number | null;
    answeredQuestions: number;
    totalQuestions: number;
    exam: ExamInfoInList;           // ✅ FIX: Use ExamInfoInList with required retake fields
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

/**
 * Detailed session info (returned by getUserExam and startExam)
 * Source: openapi-spec.yaml UserExamSession schema (lines 424-466)
 */
export interface UserExamSession {
    id: number;
    examId: number;
    attemptNumber: number;
    examTitle: string;
    durationMinutes: number;
    startedAt: string;
    submittedAt: string | null;
    status: ExamStatus;
    remainingTimeMs: number;        // ✅ FIX: Required per OpenAPI spec (server-calculated)
    totalQuestions: number;
    answeredQuestions: number;
}

// ============================================================================
// SCORE BREAKDOWN
// ============================================================================

/**
 * Score breakdown by question type
 *
 * passingGrade and isPassing are provided by backend to avoid
 * frontend calculation of passing status.
 */
export interface ScoreByType {
    type: QuestionType;
    score: number;
    maxScore: number;
    correctAnswers: number;
    totalQuestions: number;
    passingGrade: number;  // Passing grade for this question type (from backend config)
    isPassing: boolean;    // Whether score meets passing grade (calculated by backend)
}

/**
 * Exam result with score breakdown (UI-facing type)
 * Returned by submitExam and getMyResults
 * Source: backend-api-contract.md lines 1018-1047, openapi-spec.yaml ExamResult schema
 *
 * NOTE: OpenAPI spec shows flat fields (examId, examTitle, userId), but UI expects
 * nested objects. Use `normalizeExamResult()` to convert API response if needed.
 */
export interface ExamResult {
    id: number;
    exam: ExamInfo;
    user: {
        id: number;
        name: string;
        email: string;
    };
    startedAt: string;
    submittedAt: string | null;
    totalScore: number | null;
    status: ExamStatus;
    duration: number | null;
    answeredQuestions: number;
    totalQuestions: number;
    attemptNumber: number;          // ✅ FIX: Required per contract (which attempt this result is for)
    scoresByType: ScoreByType[];
}

/**
 * API response shape for ExamResult (matches OpenAPI spec)
 * OpenAPI shows flat fields: examId, examTitle, userId
 * Some backends may return nested objects instead.
 */
export interface ExamResultApiResponse {
    id: number;
    // Flat fields (per OpenAPI spec)
    examId?: number;
    examTitle?: string;
    userId?: number;
    // Nested fields (if backend returns nested)
    exam?: ExamInfo;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    startedAt: string;
    submittedAt: string | null;
    totalScore: number | null;
    status: ExamStatus;
    duration: number | null;
    answeredQuestions: number;
    totalQuestions: number;
    attemptNumber: number;
    scoresByType: ScoreByType[];
}

/**
 * Normalize ExamResult API response to UI-expected shape
 * Handles both flat (OpenAPI) and nested (current) response formats.
 *
 * @param apiResult - Raw API response (flat or nested)
 * @returns Normalized ExamResult with nested objects
 */
export function normalizeExamResult(apiResult: ExamResultApiResponse): ExamResult {
    // If already nested, return as-is
    if (apiResult.exam && apiResult.user) {
        return apiResult as ExamResult;
    }

    // Convert flat to nested
    return {
        id: apiResult.id,
        exam: apiResult.exam ?? {
            id: apiResult.examId ?? 0,
            title: apiResult.examTitle ?? 'Unknown Exam',
            description: null,
            passingScore: 0,  // Fallback - backend should always provide this
        },
        user: apiResult.user ?? {
            id: apiResult.userId ?? 0,
            name: 'Unknown User',
            email: '',
        },
        startedAt: apiResult.startedAt,
        submittedAt: apiResult.submittedAt,
        totalScore: apiResult.totalScore,
        status: apiResult.status,
        duration: apiResult.duration,
        answeredQuestions: apiResult.answeredQuestions,
        totalQuestions: apiResult.totalQuestions,
        attemptNumber: apiResult.attemptNumber,
        scoresByType: apiResult.scoresByType,
    };
}

// ============================================================================
// ANSWER MODELS
// ============================================================================

/**
 * User's submitted answer
 */
export interface ExamAnswer {
    id: number;
    userExamId: number;
    examQuestionId: number;
    selectedOption: AnswerOption;
    isCorrect: boolean | null;
    answeredAt: string | null;
    createdAt: string;
    updatedAt: string;
}

/**
 * Answer for participant view (during exam)
 */
export interface ParticipantAnswer {
    examQuestionId: number;
    selectedOption: AnswerOption;
    answeredAt: string | null;
}

/**
 * Answer with associated question (for review pages)
 */
export interface AnswerWithQuestion {
    examQuestionId: number;
    questionContent: string;
    questionType: QuestionType;
    options: QuestionOptions;
    selectedOption: AnswerOption;
    correctAnswer: string;
    isCorrect: boolean | null;
    score: number;
    orderNumber?: number;           // Optional for display
}

// ============================================================================
// API REQUEST TYPES
// ============================================================================

/**
 * Request to submit an answer
 */
export interface SubmitAnswerRequest {
    examQuestionId: number;
    selectedOption: AnswerOption;
}

/**
 * Query params for getUserExams
 */
export interface GetUserExamsParams {
    examId?: number;
    status?: ExamStatus;
    page?: number;
    limit?: number;
}

/**
 * Query params for getMyResults
 */
export interface GetMyResultsParams {
    page?: number;
    limit?: number;
    examId?: number;  // Filter results by exam ID
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * GET /exam-sessions/:id
 */
export interface ExamSessionDetailResponse {
    userExam: UserExam;
}

/**
 * GET /exam-sessions/:id/questions
 */
export interface ExamQuestionsResponse {
    questions: ExamQuestion[];
    total: number;
}

/**
 * GET /exam-sessions/:id/answers (after submission)
 */
export interface ExamAnswersResponse {
    answers: AnswerWithQuestion[];
    total: number;
}

/**
 * POST /exam-sessions/:id/answers
 */
export interface SubmitAnswerResponse {
    answer: {
        examQuestionId: number;
        selectedOption: AnswerOption;
        answeredAt: string;
    };
    progress: {
        answered: number;
        total: number;
        percentage: number;
    };
}

/**
 * POST /exam-sessions/:id/submit
 * Note: API may return flat or nested result format
 */
export interface SubmitExamResponse {
    message: string;
    result: ExamResultApiResponse;
}

/**
 * Normalized submit exam response (after normalizing result)
 */
export interface SubmitExamResponseNormalized {
    message: string;
    result: ExamResult;
}

/**
 * POST /exams/:id/start
 */
export interface StartExamResponse {
    userExam: UserExamSession;
    questions: ExamQuestion[];
    answers: ParticipantAnswer[];
}

/**
 * GET /exam-sessions
 */
export interface ExamSessionsListResponse {
    data: UserExam[];
    pagination: PaginationMeta;
}

/**
 * GET /results
 * Note: API may return flat or nested result format
 */
export interface MyResultsResponse {
    data: ExamResultApiResponse[];
    pagination: PaginationMeta;
}

/**
 * Normalized my results response (after normalizing results)
 */
export interface MyResultsResponseNormalized {
    data: ExamResult[];
    pagination: PaginationMeta;
}

// NOTE: UserStatsResponse moved to @/features/users/types (uses GET /me/stats backend endpoint)

// ============================================================================
// UI HELPER TYPES
// ============================================================================

export interface StatusConfig {
    label: string;
    color: string;
    icon?: React.ComponentType<{ className?: string }>;
}

/**
 * Status config map - uses ExamStatus (NOT UserExamStatus)
 */
export type ExamStatusConfig = Record<ExamStatus, StatusConfig>;