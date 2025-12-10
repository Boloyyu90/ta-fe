// src/features/questions/types/questions.types.ts

/**
 * Question Bank Types
 *
 * ✅ AUDIT FIX v2:
 * - Fixed id type from string to number
 * - Fixed response types to not duplicate ApiResponse fields
 * - Added proper pagination using shared PaginationMeta
 *
 * Backend: /api/v1/admin/questions/*
 */

import type { PaginationMeta } from '@/shared/types/api.types';

// ============================================================================
// ENUMS
// ============================================================================

export type QuestionType = 'TIU' | 'TWK' | 'TKP';

export type AnswerOption = 'A' | 'B' | 'C' | 'D' | 'E';

// ============================================================================
// BASE ENTITIES
// ============================================================================

export interface QuestionOptions {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
}

/**
 * Base Question entity
 * ✅ AUDIT FIX: id is number, not string
 */
export interface Question {
    id: number; // ✅ FIXED: Was string
    content: string;
    options: QuestionOptions;
    correctAnswer: AnswerOption;
    questionType: QuestionType;
    defaultScore: number;
    imageUrl?: string | null;
    createdAt: string;
    updatedAt: string;
}

/**
 * Question with usage count (for list view)
 */
export interface QuestionWithUsage extends Question {
    _count?: {
        examQuestions: number;
    };
}

// ============================================================================
// API REQUEST TYPES
// ============================================================================

export interface CreateQuestionRequest {
    content: string;
    options: QuestionOptions;
    correctAnswer: AnswerOption;
    questionType: QuestionType;
    defaultScore: number;
    imageUrl?: string;
}

export interface UpdateQuestionRequest {
    content?: string;
    options?: Partial<QuestionOptions>;
    correctAnswer?: AnswerOption;
    questionType?: QuestionType;
    defaultScore?: number;
    imageUrl?: string | null;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Response for GET /admin/questions (list)
 *
 * ✅ AUDIT FIX: Removed `success` field (it's in ApiResponse wrapper)
 * ✅ AUDIT FIX: Uses shared PaginationMeta
 */
export interface QuestionsListResponse {
    data: QuestionWithUsage[];
    pagination: PaginationMeta;
}

/**
 * Response for GET /admin/questions/:id (single question)
 *
 * ✅ AUDIT FIX: Backend returns { question: {...} }, not { data: {...} }
 */
export interface QuestionDetailResponse {
    question: QuestionWithUsage;
}

/**
 * Response for POST /admin/questions (create)
 */
export interface CreateQuestionResponse {
    question: Question;
}

/**
 * Response for PATCH /admin/questions/:id (update)
 */
export interface UpdateQuestionResponse {
    question: Question;
}

/**
 * Response for DELETE /admin/questions/:id
 */
export interface DeleteQuestionResponse {
    success: boolean;
    message?: string;
}

// ============================================================================
// QUERY PARAMS TYPES
// ============================================================================

export interface QuestionsQueryParams {
    page?: number;
    limit?: number;
    type?: QuestionType;
    search?: string;
    sortBy?: 'content' | 'questionType' | 'createdAt' | 'updatedAt' | 'defaultScore';
    sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// FORM TYPES (for UI components)
// ============================================================================

/**
 * Form data for create/edit question
 * Uses string id for form compatibility
 */
export interface QuestionFormData {
    content: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    optionE: string;
    correctAnswer: AnswerOption;
    questionType: QuestionType;
    defaultScore: number;
    imageUrl?: string;
}

/**
 * Transform form data to API request format
 */
export function formDataToRequest(formData: QuestionFormData): CreateQuestionRequest {
    return {
        content: formData.content,
        options: {
            A: formData.optionA,
            B: formData.optionB,
            C: formData.optionC,
            D: formData.optionD,
            E: formData.optionE,
        },
        correctAnswer: formData.correctAnswer,
        questionType: formData.questionType,
        defaultScore: formData.defaultScore,
        imageUrl: formData.imageUrl,
    };
}

/**
 * Transform question entity to form data
 */
export function questionToFormData(question: Question): QuestionFormData {
    return {
        content: question.content,
        optionA: question.options.A,
        optionB: question.options.B,
        optionC: question.options.C,
        optionD: question.options.D,
        optionE: question.options.E,
        correctAnswer: question.correctAnswer,
        questionType: question.questionType,
        defaultScore: question.defaultScore,
        imageUrl: question.imageUrl ?? undefined,
    };
}