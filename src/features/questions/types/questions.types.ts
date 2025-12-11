// src/features/questions/types/questions.types.ts

/**
 * Questions Types (Admin Question Bank)
 *
 * Source: backend-api-contract.md + backend questions.validation.ts
 */

import type { QuestionType, AnswerOption } from '@/shared/types/enum.types';
import type { PaginationMeta } from '@/shared/types/api.types';

// Re-export for convenience
export type { QuestionType };

// ============================================================================
// QUESTION ENTITY
// ============================================================================

export interface QuestionOptions {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
}

/**
 * Question entity (matches backend Prisma QuestionBank model)
 * ⚠️ CRITICAL: id is NUMBER, not string
 */
export interface Question {
    id: number;  // ✅ FIXED: Was string, now number
    content: string;
    options: QuestionOptions;
    correctAnswer: Exclude<AnswerOption, null>;
    questionType: QuestionType;
    defaultScore: number;
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

/**
 * Request to create question
 */
export interface CreateQuestionRequest {
    content: string;
    options: QuestionOptions;
    correctAnswer: Exclude<AnswerOption, null>;
    questionType: QuestionType;
    defaultScore: number;
}

/**
 * Request to update question
 */
export interface UpdateQuestionRequest {
    content?: string;
    options?: Partial<QuestionOptions>;
    correctAnswer?: Exclude<AnswerOption, null>;
    questionType?: QuestionType;
    defaultScore?: number;
}

/**
 * Query params for GET /admin/questions
 */
export interface QuestionsQueryParams {
    page?: number;
    limit?: number;
    questionType?: QuestionType;  // ✅ Renamed from 'type' to match backend
    search?: string;
    sortBy?: 'content' | 'questionType' | 'createdAt' | 'defaultScore';
    sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * GET /admin/questions
 * ✅ FIXED: Uses correct PaginationMeta structure
 */
export interface QuestionsListResponse {
    data: QuestionWithUsage[];
    pagination: PaginationMeta;
}

/**
 * GET /admin/questions/:id
 */
export interface QuestionDetailResponse {
    question: QuestionWithUsage;
}

/**
 * POST /admin/questions
 */
export interface CreateQuestionResponse {
    question: Question;
}

/**
 * PATCH /admin/questions/:id
 */
export interface UpdateQuestionResponse {
    question: Question;
}

/**
 * DELETE /admin/questions/:id
 */
export interface DeleteQuestionResponse {
    success: boolean;
    message: string;
}