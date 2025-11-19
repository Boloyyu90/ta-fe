// src/features/exam-sessions/types/exam-sessions.types.ts

// ============================================================================
// ENUMS (from backend)
// ============================================================================

export type ExamStatus = 'IN_PROGRESS' | 'FINISHED' | 'CANCELLED' | 'TIMEOUT';
export type QuestionType = 'TIU' | 'TKP' | 'TWK';

// ============================================================================
// BASE ENTITIES
// ============================================================================

export interface UserExam {
    id: number; // UserExam session ID
    userId: number;
    examId: number;
    startedAt: string | null; // ISO datetime
    submittedAt: string | null; // ISO datetime
    totalScore: number | null;
    status: ExamStatus;
    createdAt: string; // ISO datetime
}

export interface UserExamWithRelations extends UserExam {
    exam: {
        id: number;
        title: string;
        description: string | null;
        durationMinutes: number;
        _count?: {
            examQuestions: number;
        };
    };
    user?: {
        id: number;
        name: string;
        email: string;
    };
    _count?: {
        answers: number;
    };
}

export interface ExamQuestion {
    id: number; // Question ID
    examQuestionId: number; // ExamQuestion junction ID
    content: string;
    options: {
        A: string;
        B: string;
        C: string;
        D: string;
        E: string;
    };
    questionType: QuestionType;
    orderNumber: number;
    correctAnswer?: string; // Only included after submission for review
}

export interface Answer {
    examQuestionId: number;
    selectedOption: string | null; // "A" | "B" | "C" | "D" | "E" | null
    answeredAt: string | null; // ISO datetime
    isCorrect?: boolean | null; // Only included after submission
}

export interface AnswerWithQuestion extends Answer {
    questionContent: string;
    questionType: QuestionType;
    options: {
        A: string;
        B: string;
        C: string;
        D: string;
        E: string;
    };
    correctAnswer: string; // Only included after submission
    score: number;
}

export interface ScoreByType {
    type: QuestionType;
    score: number;
    maxScore: number;
    correctAnswers: number;
    totalQuestions: number;
}

export interface ExamResult extends UserExam {
    exam: {
        id: number;
        title: string;
        description: string | null;
    };
    user: {
        id: number;
        name: string;
        email: string;
    };
    duration: number | null; // Duration in seconds
    answeredQuestions: number;
    totalQuestions: number;
    scoresByType: ScoreByType[];
}

// ============================================================================
// API REQUEST TYPES
// ============================================================================

export interface SubmitAnswerRequest {
    examQuestionId: number;
    selectedOption?: string | null; // "A" | "B" | "C" | "D" | "E" or null to clear
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface StartExamResponse {
    userExam: {
        id: number; // UserExam session ID
        examId: number;
        examTitle: string;
        durationMinutes: number;
        startedAt: string; // ISO datetime
        submittedAt: string | null;
        status: ExamStatus;
        remainingTimeMs: number | null; // Milliseconds remaining
        totalQuestions: number;
        answeredQuestions: number;
    };
    questions: ExamQuestion[];
    answers: Answer[];
}

export interface UserExamsListResponse {
    data: Array<{
        id: number;
        exam: {
            id: number;
            title: string;
            description: string | null;
        };
        status: ExamStatus;
        startedAt: string | null;
        submittedAt: string | null;
        totalScore: number | null;
        remainingTimeMs: number | null; // Only for IN_PROGRESS
        durationMinutes: number | null;
    }>;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface ExamSessionDetailResponse {
    userExam: UserExamWithRelations;
}

export interface ExamQuestionsResponse {
    questions: ExamQuestion[];
    total: number;
}

export interface SubmitAnswerResponse {
    answer: Answer;
    progress: {
        answered: number;
        total: number;
        percentage: number; // 0-100
    };
}

export interface SubmitExamResponse {
    result: ExamResult;
}

export interface ExamAnswersResponse {
    answers: AnswerWithQuestion[];
    total: number;
}

export interface ResultsListResponse {
    data: ExamResult[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

// ============================================================================
// QUERY PARAMS TYPES
// ============================================================================

export interface UserExamsQueryParams {
    page?: number;
    limit?: number;
}

export interface ResultsQueryParams {
    page?: number;
    limit?: number;
    examId?: number; // Admin only
    userId?: number; // Admin only
    status?: ExamStatus; // Admin only
}