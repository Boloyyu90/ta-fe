// src/features/exam-sessions/types/exam-sessions.types.ts

/**
 * EXAM SESSIONS TYPES
 *
 * ✅ Aligned with backend API responses
 * ✅ Matches actual controller response structure
 */

// ============================================================================
// CORE DOMAIN TYPES
// ============================================================================

export type ExamStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type QuestionType = 'TWK' | 'TIU' | 'TKP';
export type UserExamStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'FINISHED' | 'TIMEOUT' | 'CANCELLED' | 'COMPLETED';

/**
 * Question data structure (without correct answer for active exams)
 */
export interface Question {
    id: number;
    questionType: QuestionType;
    content: string;
    options: {
        A: string;
        B: string;
        C: string;
        D: string;
        E: string;
    };
    correctAnswer?: string; // Only present after submission
    imageUrl?: string | null;
}

/**
 * Exam question with order number
 */
export interface ExamQuestion extends Question {
    examQuestionId: number;
    orderNumber: number;
}

/**
 * User's exam session
 */
export interface UserExam {
    id: number;
    userId: number;
    examId: number;
    status: UserExamStatus;
    startedAt: string | null;
    finishedAt: string | null;
    submittedAt: string | null;
    totalScore: number | null;
    answeredQuestions: number;
    totalQuestions: number;
    durationMinutes: number;
    remainingTimeMs: number | null;
    completedAt?: string | null; // ✅ Added for frontend
    timeSpent: number | null;
    correctAnswers: number | null;
    createdAt: string;
    exam?: {
        id: number;
        title: string;
        durationMinutes: number;
        passingScore?: number;
    };
}

/**
 * User's answer to a question
 */
export interface ExamAnswer {
    id: number;
    userExamId: number;
    questionId: number;
    selectedOption: string | null;
    isCorrect: boolean | null;
    score: number | null;
    question: Question;
}

/**
 * Answer with flattened question details for review UI
 */
export interface AnswerWithQuestion {
    id: number;
    userExamId: number;
    questionId: number;
    selectedOption: string | null;
    isCorrect: boolean;
    score: number;
    // Flattened question properties
    questionType: QuestionType;
    questionContent: string;
    correctAnswer: string;
    options: {
        A: string;
        B: string;
        C: string;
        D: string;
        E: string;
    };
}

/**
 * Exam session list item (EXPORTED - used by ResultCard, UserExamCard)
 */
export interface ExamSessionListItem {
    id: number;
    userId: number;
    examId: number;
    status: ExamStatus;
    totalScore: number | null;
    startedAt: string | null;
    finishedAt: string | null;
    completedAt?: string | null;
    correctAnswers?: number | null;
    totalQuestions?: number | null;
    exam?: {
        title: string;
        durationMinutes: number;
    };
}

// ============================================================================
// PAGINATION
// ============================================================================

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext?: boolean;
    hasPrev?: boolean;
}

// ============================================================================
// API RESPONSES (✅ CORRECTED to match backend controller responses)
// ============================================================================

/**
 * GET /api/v1/exam-sessions/:id
 * Controller sends: { userExam: {...} }
 */
export interface ExamSessionDetailResponse {
    userExam: UserExam;
}

export type ExamSessionResponse = ExamSessionDetailResponse;

/**
 * GET /api/v1/exam-sessions/:id/questions
 * Controller sends: { questions: [...], total: number }
 */
export interface ExamQuestionsResponse {
    questions: ExamQuestion[];
    total: number;
}

/**
 * GET /api/v1/exam-sessions/:id/answers
 * Controller sends: { answers: [...], total: number }
 */
export interface ExamAnswersResponse {
    answers: AnswerWithQuestion[];
    total: number;
}

/**
 * GET /api/v1/exam-sessions OR GET /api/v1/results
 * Service returns: { data: [...], pagination: {...} }
 */
export interface MyResultsResponse {
    data: UserExam[];
    pagination: PaginationMeta;
}

/**
 * POST /api/v1/exams/:id/start
 * Controller sends: { userExam: {...} }
 */
export interface StartExamResponse {
    userExam: UserExam;
}

/**
 * POST /api/v1/exam-sessions/:id/answers
 * Controller sends: { answer: {...} }
 */
export interface SubmitAnswerRequest {
    questionId: number;
    selectedOption: string;
}

export interface SubmitAnswerResponse {
    answer: ExamAnswer;
}

/**
 * POST /api/v1/exam-sessions/:id/submit
 * Controller sends: { result: {...} }
 */
export interface SubmitExamResponse {
    result: UserExam;
}

// ============================================================================
// REQUEST PARAMS
// ============================================================================

export interface MyResultsParams {
    page?: number;
    limit?: number;
    status?: 'COMPLETED' | 'CANCELLED' | 'FINISHED';
}

export interface GetUserExamsParams {
    page?: number;
    limit?: number;
    status?: UserExamStatus;
}