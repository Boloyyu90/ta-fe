// src/features/exams/types/exams.types.ts

// ============================================================================
// ENUMS (from backend)
// ============================================================================

export type QuestionType = 'TIU' | 'TKP' | 'TWK';

// ============================================================================
// BASE ENTITIES
// ============================================================================

export interface Exam {
    id: number;
    title: string;
    description: string | null;
    startTime: string | null; // ISO datetime
    endTime: string | null; // ISO datetime
    durationMinutes: number;
    createdBy: number;
    createdAt: string; // ISO datetime
    updatedAt: string; // ISO datetime
}

export interface ExamWithCounts extends Exam {
    _count: {
        examQuestions: number;
        userExams?: number;
    };
}

export interface ExamWithCreator extends ExamWithCounts {
    creator: {
        id: number;
        name: string;
        email: string;
    };
}

export interface ExamQuestion {
    id: number; // ExamQuestion ID (junction table)
    orderNumber: number;
    question: {
        id: number; // Question ID
        content: string;
        questionType: QuestionType;
        defaultScore: number;
        options: {
            A: string;
            B: string;
            C: string;
            D: string;
            E: string;
        };
        correctAnswer: string; // Only included for admin
    };
}

// ============================================================================
// API REQUEST TYPES
// ============================================================================

export interface CreateExamRequest {
    title: string;
    description?: string;
    startTime?: string; // ISO datetime
    endTime?: string; // ISO datetime
    durationMinutes: number;
}

export interface UpdateExamRequest {
    title?: string;
    description?: string | null;
    startTime?: string | null;
    endTime?: string | null;
    durationMinutes?: number;
}

export interface AttachQuestionsRequest {
    questionIds: number[];
}

export interface DetachQuestionsRequest {
    questionIds: number[];
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ExamsListResponse {
    data: ExamWithCounts[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface ExamDetailResponse {
    exam: ExamWithCreator;
}

export interface CreateExamResponse {
    exam: ExamWithCreator;
}

export interface UpdateExamResponse {
    exam: ExamWithCreator;
}

export interface DeleteExamResponse {
    success: boolean;
}

export interface AttachQuestionsResponse {
    attached: number;
    alreadyAttached: number;
}

export interface DetachQuestionsResponse {
    detached: number;
}

export interface ExamQuestionsResponse {
    questions: ExamQuestion[];
    total: number;
}

// ============================================================================
// QUERY PARAMS TYPES
// ============================================================================

export interface ExamsQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: 'createdAt' | 'startTime' | 'title';
    sortOrder?: 'asc' | 'desc';
    createdBy?: number; // Admin only
}

export interface ExamQuestionsQueryParams {
    type?: QuestionType;
}