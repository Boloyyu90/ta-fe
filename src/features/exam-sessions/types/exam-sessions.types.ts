// src/features/exam-sessions/types/exam-sessions.types.ts

/**
 * EXAM SESSIONS TYPES - ALIGNED WITH CURRENT FRONTEND
 *
 * ✅ All exports that are being imported elsewhere
 * ✅ Matches existing backend contract
 */

// ============================================================================
// ENUMS (EXPORTED - used by components)
// ============================================================================

export type QuestionType = 'TIU' | 'TWK' | 'TKP';

export type ExamStatus =
    | 'NOT_STARTED'
    | 'IN_PROGRESS'
    | 'FINISHED'
    | 'COMPLETED' // Frontend display alias for FINISHED
    | 'TIMEOUT'
    | 'CANCELLED';

// ============================================================================
// BASE ENTITIES
// ============================================================================

/**
 * Question entity from question bank
 */
export interface Question {
    id: number;
    content: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    optionE: string;
    correctAnswer: string;
    questionType: QuestionType;
    imageUrl: string | null;
    defaultScore: number;
}

/**
 * Exam question (question assigned to exam)
 * ⚠️ IMPORTANT: Has nested `question` property
 */
export interface ExamQuestion {
    id: number;
    examId: number;
    questionId: number;
    questionOrder: number;
    score: number;
    question: Question; // ✅ Nested structure
}

/**
 * User's exam session
 */
export interface UserExam {
    id: number;
    userId: number;
    examId: number;
    status: ExamStatus;
    totalScore: number | null;
    startedAt: string | null;
    finishedAt: string | null;
    completedAt?: string | null; // ✅ Added for frontend
    timeSpent: number | null;
    totalQuestions: number | null;
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
// API RESPONSES
// ============================================================================

export interface ExamSessionDetailResponse {
    data: {
        userExam: UserExam;
        questions: ExamQuestion[];
        answers: ExamAnswer[];
    };
}

export type ExamSessionResponse = ExamSessionDetailResponse;

export interface ExamQuestionsResponse {
    data: ExamQuestion[];
}

export interface ExamAnswersResponse {
    data: AnswerWithQuestion[];
}

export interface MyResultsResponse {
    data: UserExam[];
    pagination: PaginationMeta;
}

export interface StartExamResponse {
    data: {
        userExam: UserExam;
    };
}

export interface SubmitAnswerRequest {
    questionId: number;
    selectedOption: string;
}

export interface SubmitAnswerResponse {
    data: ExamAnswer;
}

export interface SubmitExamResponse {
    data: {
        result: UserExam;
    };
}

export interface MyResultsParams {
    page?: number;
    limit?: number;
    status?: 'COMPLETED' | 'CANCELLED' | 'FINISHED';
}

export interface GetUserExamsParams {
    page?: number;
    limit?: number;
    status?: ExamStatus;
}