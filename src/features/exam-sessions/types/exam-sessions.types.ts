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
 */
export interface ExamQuestion {
    id: number;              // ExamQuestion.id (junction table)
    examQuestionId: number;  // Same as id, for compatibility
    content: string;
    options: QuestionOptions;
    questionType: QuestionType;
    orderNumber: number;
    imageUrl?: string;
}

/** @deprecated Use ExamQuestion instead */
export type ParticipantQuestion = ExamQuestion;

// ============================================================================
// EXAM MODELS (Simplified for session context)
// ============================================================================

/**
 * Exam info as returned in UserExam and ExamResult responses
 */
export interface ExamInfo {
    id: number;
    title: string;
    description: string | null;
    passingScore?: number;
    durationMinutes?: number;   // Optional for some contexts
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
 */
export interface UserExam {
    id: number;
    userId: number;
    examId: number;
    status: ExamStatus;
    startedAt: string | null;
    submittedAt: string | null;
    totalScore: number | null;
    remainingTimeMs: number | null;
    durationMinutes: number | null;
    answeredQuestions: number;
    totalQuestions: number;
    exam: ExamInfo;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

/**
 * Detailed session info (returned by getUserExam and startExam)
 */
export interface UserExamSession {
    id: number;
    examId: number;
    examTitle: string;
    durationMinutes: number;
    startedAt: string;
    submittedAt: string | null;
    status: ExamStatus;
    remainingTimeMs: number | null;
    totalQuestions: number;
    answeredQuestions: number;
}

// ============================================================================
// SCORE BREAKDOWN
// ============================================================================

/**
 * Score breakdown by question type
 */
export interface ScoreByType {
    type: QuestionType;
    score: number;
    maxScore: number;
    correctAnswers: number;
    totalQuestions: number;
}

/**
 * Exam result with score breakdown
 * Returned by submitExam and getMyResults
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
    scoresByType: ScoreByType[];
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
 */
export interface SubmitExamResponse {
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

/**
 * Status config map - uses ExamStatus (NOT UserExamStatus)
 */
export type ExamStatusConfig = Record<ExamStatus, StatusConfig>;