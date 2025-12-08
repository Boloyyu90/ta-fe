// src/features/exam-sessions/types/exam-sessions.types.ts

/**
 * Exam Sessions Types
 *
 * ⚠️ CRITICAL: Backend uses `selectedOption` NOT `selectedAnswer`
 * See Backend API Contract page 22
 *
 * ✅ INTEGRATION FIX: Added progress and scoresByType to match backend responses
 *
 * DISTINCTIONS:
 * 1. ExamStatus: Status of exam definition (DRAFT, PUBLISHED, ARCHIVED)
 * 2. UserExamStatus: Status of participant's session (NOT_STARTED, IN_PROGRESS, etc.)
 */

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

export interface Exam {
    id: number;
    title: string;
    description?: string;
    durationMinutes: number; // ⚠️ Changed from 'duration' to 'durationMinutes'
    passingScore: number;
    totalQuestions: number;
    status: ExamStatus;
    examDate?: string;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// USER EXAM SESSION MODELS
// ============================================================================

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
    submittedAt?: string;
    timeSpent?: number;
    totalScore?: number;
    tiuScore?: number;
    twkScore?: number;
    tkpScore?: number;
    violationCount?: number;
    createdAt: string;
    updatedAt: string;
    exam: Exam;
}

// ============================================================================
// SCORE BREAKDOWN (NEW - for results display)
// ============================================================================

/**
 * Score breakdown by question type
 * ✅ NEW: Matches backend API contract page 23-24
 */
export interface ScoreByType {
    type: QuestionType; // 'TIU' | 'TWK' | 'TKP'
    score: number;
    maxScore: number;
    correctAnswers: number;
    totalQuestions: number;
}

/**
 * Extended UserExam with score breakdown
 * ✅ NEW: For results pages that need detailed score analysis
 */
export interface ExamResult extends UserExam {
    scoresByType: ScoreByType[];
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
    selectedOption: 'A' | 'B' | 'C' | 'D' | 'E' | null; // ⚠️ selectedOption!
    isCorrect: boolean;
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
    selectedOption: 'A' | 'B' | 'C' | 'D' | 'E' | null; // ⚠️ Changed to selectedOption!
}

/**
 * Query params for getUserExams
 * ✅ NOW EXPORTED (fixes TS2305 error)
 */
export interface GetUserExamsParams {
    status?: UserExamStatus;
    page?: number;
    limit?: number;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ExamSessionDetailResponse {
    userExam: UserExam;
}

export interface ExamQuestionsResponse {
    questions: ExamQuestion[];
    total: number;
}

export interface ExamAnswersResponse {
    answers: AnswerWithQuestion[];
    total: number;
}

/**
 * ✅ INTEGRATION FIX: Added progress field
 * Backend API Contract page 22
 */
export interface SubmitAnswerResponse {
    answer: ExamAnswer;
    progress: {
        answered: number;
        total: number;
        percentage: number;
    };
}

/**
 * ✅ INTEGRATION FIX: Changed to use ExamResult (includes scoresByType)
 * Backend API Contract page 23
 */
export interface SubmitExamResponse {
    result: ExamResult; // ✅ Changed from UserExam
}

export interface ExamSessionsListResponse {
    data: UserExam[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

/**
 * ✅ INTEGRATION FIX: Changed to use ExamResult (includes scoresByType)
 * Backend API Contract page 27
 */
export interface MyResultsResponse {
    data: ExamResult[]; // ✅ Changed from UserExam[]
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

// ============================================================================
// UI HELPER TYPES
// ============================================================================

export interface StatusConfig {
    label: string;
    color: string;
    icon: any;
}

export type UserExamStatusConfig = Record<UserExamStatus, StatusConfig>;