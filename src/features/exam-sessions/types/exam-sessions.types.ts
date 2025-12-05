// src/features/exam-sessions/types/exam-sessions.types.ts

// Question types
export type QuestionType = 'TIU' | 'TWK' | 'TKP';

// Exam session status
export type ExamStatus =
    | 'NOT_STARTED'
    | 'IN_PROGRESS'
    | 'FINISHED'
    | 'COMPLETED' // ✅ Added for frontend display
    | 'TIMEOUT'
    | 'CANCELLED';

// Question entity
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

// Exam question (question assigned to exam)
export interface ExamQuestion {
    id: number;
    examId: number;
    questionId: number;
    questionOrder: number;
    score: number;
    question: Question;
}

// User's exam session
export interface UserExam {
    id: number;
    userId: number;
    examId: number;
    status: ExamStatus;
    totalScore: number | null;
    startedAt: string | null;
    finishedAt: string | null;
    completedAt?: string | null; // ✅ Added
    timeSpent: number | null;
    totalQuestions: number | null;
    correctAnswers: number | null;
    createdAt: string;
    exam: {
        id: number;
        title: string;
        durationMinutes: number;
        passingScore: number;
    };
}

// User's answer to a question
export interface ExamAnswer {
    id: number;
    userExamId: number;
    questionId: number;
    selectedOption: string | null;
    isCorrect: boolean | null;
    score: number | null;
    question: Question;
}

// Extended answer with flattened question details for easier UI access
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

// Exam session list item
export interface ExamSessionListItem {
    id: number;
    userId: number;
    examId: number;
    status: ExamStatus;
    totalScore: number | null;
    startedAt: string | null;
    finishedAt: string | null;
    completedAt?: string | null; // ✅ Added
    correctAnswers?: number | null; // ✅ Added
    totalQuestions?: number | null; // ✅ Added
    exam: {
        title: string;
        durationMinutes: number;
    };
}

// Pagination
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// API Responses
export interface ExamSessionDetailResponse {
    data: {
        userExam: UserExam;
        questions: ExamQuestion[];
        answers: ExamAnswer[];
    };
}

// Alias for backward compatibility
export type ExamSessionResponse = ExamSessionDetailResponse;

// ✅ Added missing types
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

export interface MyResultsParams {
    page?: number;
    limit?: number;
    status?: 'COMPLETED' | 'CANCELLED';
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

export interface FinishExamResponse {
    data: UserExam;
}