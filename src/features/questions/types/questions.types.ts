// src/features/questions/types/questions.types.ts

// Question type enum
export type QuestionType = 'TIU' | 'TWK' | 'TKP';

// Base Question entity
export interface Question {
    id: string;
    content: string;
    options: {
        A: string;
        B: string;
        C: string;
        D: string;
        E: string;
    };
    correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
    questionType: QuestionType;
    defaultScore: number;
    createdAt: string;
    updatedAt: string;
}

// Question with usage count (for list view)
export interface QuestionWithUsage extends Question {
    _count?: {
        examQuestions: number;
    };
}

// API Request types
export interface CreateQuestionRequest {
    content: string;
    options: {
        A: string;
        B: string;
        C: string;
        D: string;
        E: string;
    };
    correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
    questionType: QuestionType;
    defaultScore: number;
}

export interface UpdateQuestionRequest {
    content?: string;
    options?: {
        A?: string;
        B?: string;
        C?: string;
        D?: string;
        E?: string;
    };
    correctAnswer?: 'A' | 'B' | 'C' | 'D' | 'E';
    questionType?: QuestionType;
    defaultScore?: number;
}

// API Response types
export interface QuestionsListResponse {
    success: boolean;
    data: QuestionWithUsage[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        from: number;
        to: number;
    };
}

export interface QuestionDetailResponse {
    success: boolean;
    data: QuestionWithUsage;
}

// Query params for filtering
export interface QuestionsQueryParams {
    page?: number;
    limit?: number;
    type?: QuestionType;
    search?: string;
    sortBy?: 'content' | 'questionType' | 'createdAt' | 'updatedAt';
    sortOrder?: 'asc' | 'desc';
}