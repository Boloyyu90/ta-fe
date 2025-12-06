/**
 * Exam Sessions Types
 *
 * CRITICAL DISTINCTIONS:
 * 1. ExamStatus: Status of the exam definition itself (DRAFT, PUBLISHED, ARCHIVED)
 * 2. UserExamStatus: Status of a participant's exam session (NOT_STARTED, IN_PROGRESS, FINISHED, etc.)
 *
 * QUESTION STRUCTURE:
 * - Backend sends: { id, content, options: { A, B, C, D, E }, questionType, ... }
 * - NOT: { question: { optionA, optionB, ... } }
 */

// ============================================================================
// STATUS ENUMS
// ============================================================================

/**
 * Status of the exam definition (admin perspective)
 */
export type ExamStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

/**
 * Status of a user's exam session (participant perspective)
 */
export type UserExamStatus =
    | 'NOT_STARTED'
    | 'IN_PROGRESS'
    | 'FINISHED'
    | 'TIMEOUT'
    | 'CANCELLED'
    | 'COMPLETED';

/**
 * Question types in CPNS exams
 */
export type QuestionType = 'TIU' | 'TWK' | 'TKP';

// ============================================================================
// QUESTION MODELS
// ============================================================================

/**
 * Question options structure (backend format)
 */
export interface QuestionOptions {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
}

/**
 * Base Question model
 */
export interface Question {
    id: number;
    content: string;
    options: QuestionOptions; // NOT optionA, optionB, etc.
    correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
    questionType: QuestionType;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Question as it appears in an exam session
 * Note: This extends Question and adds exam-specific fields
 */
export interface ExamQuestion {
    id: number;
    examQuestionId: number;
    content: string;
    options: QuestionOptions; // Access via question.options.A, not question.question.optionA
    questionType: QuestionType;
    orderNumber: number;
    imageUrl?: string;
}

// ============================================================================
// EXAM MODELS
// ============================================================================

/**
 * Exam definition (from exams module)
 */
export interface Exam {
    id: number;
    title: string;
    description?: string;
    duration: number; // in minutes
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

/**
 * User's exam session (participant's active/completed exam)
 */
export interface UserExam {
    id: number;
    userId: number;
    examId: number;
    status: UserExamStatus; // NOT ExamStatus!
    startTime?: string;
    endTime?: string;
    submittedAt?: string;
    timeSpent?: number; // in seconds
    totalScore?: number;
    tiuScore?: number;
    twkScore?: number;
    tkpScore?: number;
    violationCount?: number;
    createdAt: string;
    updatedAt: string;
    exam: Exam; // Populated exam details
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
    selectedAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
    isCorrect: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Answer with associated question (for review)
 */
export interface AnswerWithQuestion extends ExamAnswer {
    examQuestion: ExamQuestion;
}

// ============================================================================
// API REQUEST TYPES
// ============================================================================

/**
 * Request to submit an answer
 */
export interface SubmitAnswerRequest {
    examQuestionId: number;
    selectedAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Response from GET /exam-sessions/:id
 * Backend returns: { success, message, data: { userExam: {...} } }
 * After apiClient unwrap: { userExam: {...} }
 */
export interface ExamSessionDetailResponse {
    userExam: UserExam;
}

/**
 * Response from GET /exam-sessions/:id/questions
 * Backend returns: { success, message, data: { questions: [...], total: number } }
 * After apiClient unwrap: { questions: [...], total: number }
 */
export interface ExamQuestionsResponse {
    questions: ExamQuestion[];
    total: number;
}

/**
 * Response from GET /exam-sessions/:id/answers
 * Backend returns: { success, message, data: { answers: [...], total: number } }
 * After apiClient unwrap: { answers: [...], total: number }
 */
export interface ExamAnswersResponse {
    answers: AnswerWithQuestion[];
    total: number;
}

/**
 * Response from POST /exam-sessions/:id/answers
 * Backend returns: { success, message, data: { answer: {...} } }
 * After apiClient unwrap: { answer: {...} }
 */
export interface SubmitAnswerResponse {
    answer: ExamAnswer;
}

/**
 * Response from POST /exam-sessions/:id/submit
 * Backend returns: { success, message, data: { result: {...} } }
 * After apiClient unwrap: { result: {...} }
 */
export interface SubmitExamResponse {
    result: UserExam;
}

/**
 * Response from GET /exam-sessions (list)
 * Backend returns: { success, message, data: { data: [...], pagination: {...} } }
 * After apiClient unwrap: { data: [...], pagination: {...} }
 */
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
 * Response from GET /exam-sessions/my-results
 * Backend returns: { success, message, data: { data: [...], pagination: {...} } }
 * After apiClient unwrap: { data: [...], pagination: {...} }
 */
export interface MyResultsResponse {
    data: UserExam[];
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

/**
 * Status configuration for UI display
 */
export interface StatusConfig {
    label: string;
    color: string;
    icon: any; // LucideIcon type
}

/**
 * Map of user exam statuses to their UI configurations
 */
export type UserExamStatusConfig = Record<UserExamStatus, StatusConfig>;