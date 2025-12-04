// src/features/exam-sessions/types/exam-sessions.types.ts

// ============================================================================
// EXISTING TYPES (from Part 2)
// ============================================================================
export type QuestionType = 'TIU' | 'TWK' | 'TKP';
export type ExamStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Question {
    id: number;
    questionId: number;
    content: string;
    type: QuestionType;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    optionE: string;
    correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
    score: number;
}

export interface ExamQuestion {
    id: number;
    examId: number;
    questionId: number;
    order: number;
    question: Question;
}

export interface Exam {
    id: number;
    title: string;
    description: string | null;
    durationMinutes: number;
    startTime: string | null;
    endTime: string | null;
    createdAt: string;
    updatedAt: string;
    _count?: {
        examQuestions: number;
    };
}

export interface UserExam {
    id: number;
    userId: number;
    examId: number;
    status: ExamStatus;
    startedAt: string;
    completedAt: string | null;
    totalScore: number | null;
    totalQuestions: number | null;
    correctAnswers: number | null;
    createdAt: string;
    updatedAt: string;
    exam: Exam;
}

export interface ExamSessionResponse {
    userExam: UserExam;
}

export interface ExamQuestionsResponse {
    examQuestions: ExamQuestion[];
}

export interface SubmitAnswerRequest {
    examQuestionId: number;
    selectedOption: 'A' | 'B' | 'C' | 'D' | 'E';
}

export interface SubmitAnswerResponse {
    message: string;
    answer: {
        id: number;
        userExamId: number;
        examQuestionId: number;
        selectedOption: string;
        isCorrect: boolean;
        score: number;
    };
}

export interface SubmitExamResponse {
    message: string;
    userExam: UserExam;
}

// ============================================================================
// NEW TYPES FOR PART 3
// ============================================================================

// For Answer Review Page
export interface AnswerWithQuestion {
    id: number;
    userExamId: number;
    examQuestionId: number;
    selectedOption: 'A' | 'B' | 'C' | 'D' | 'E' | null;
    isCorrect: boolean | null;
    score: number;
    createdAt: string;
    updatedAt: string;
    // Populated question data
    questionType: QuestionType;
    questionContent: string;
    options: {
        A: string;
        B: string;
        C: string;
        D: string;
        E: string;
    };
    correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
}

export interface ExamAnswersResponse {
    answers: AnswerWithQuestion[];
}

// For Results List Page
export interface ExamSessionListItem {
    id: number;
    userId: number;
    examId: number;
    status: ExamStatus;
    startedAt: string;
    completedAt: string | null;
    totalScore: number | null;
    totalQuestions: number | null;
    correctAnswers: number | null;
    createdAt: string;
    updatedAt: string;
    exam: {
        id: number;
        title: string;
        durationMinutes: number;
    };
}

export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

export interface MyResultsResponse {
    userExams: ExamSessionListItem[];
    pagination: PaginationMeta;
}

// For Result Detail Page (reuses UserExam but with expanded relations)
export interface ExamSessionDetail extends UserExam {
    // Already has exam relation from UserExam
    user?: {
        id: number;
        username: string;
        fullName: string;
    };
}

export interface ExamSessionDetailResponse {
    userExam: ExamSessionDetail;
}

// Query parameters
export interface MyResultsParams {
    page?: number;
    limit?: number;
    status?: 'COMPLETED' | 'CANCELLED';
}