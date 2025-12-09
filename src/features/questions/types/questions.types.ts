// src/features/questions/types/questions.types.ts

/**
 * QUESTIONS TYPES - BACKEND-ALIGNED
 *
 * ✅ REFACTORED: All types match backend Prisma QuestionBank model EXACTLY
 *
 * KEY FIXES:
 * - Uses shared QuestionType enum (removed local definition)
 * - Uses shared PaginatedResponse<T> (fixed pagination field names)
 * - id is number, not string (matches Prisma)
 * - ❌ REMOVED imageUrl field (doesn't exist in backend Prisma schema)
 * - All dates as ISO strings, not Date objects
 *
 * Backend Source: backend/prisma/schema.prisma (QuestionBank model)
 */

import type { QuestionType } from '@/shared/types/enum.types';
import type { PaginatedResponse } from '@/shared/types/api.types';
import type { BaseEntity } from '@/shared/types/common.types';

// ============================================================================
// QUESTION OPTIONS
// ============================================================================

/**
 * Question options structure
 * Stored as JSON in backend: { A: string, B: string, C: string, D: string, E: string }
 */
export interface QuestionOptions {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
}

// ============================================================================
// QUESTION ENTITY (from Prisma QuestionBank model)
// ============================================================================

/**
 * Question entity from backend Prisma QuestionBank model
 *
 * Backend Prisma fields: id, content, options, correctAnswer, defaultScore, questionType, createdAt, updatedAt
 *
 * ⚠️ IMPORTANT: Backend does NOT have imageUrl field!
 * If image support is needed, backend Prisma schema must be updated first.
 */
export interface Question extends BaseEntity {
    content: string;
    options: QuestionOptions;
    correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
    questionType: QuestionType; // ✅ Uses shared enum
    defaultScore: number;
    // ❌ imageUrl field removed - doesn't exist in backend
}

/**
 * Question with aggregated counts (for list view)
 * Backend returns this from getQuestions endpoint
 */
export interface QuestionWithUsage extends Question {
    _count?: {
        examQuestions: number; // Number of exams using this question
    };
}

// ============================================================================
// API REQUEST TYPES (what we send to backend)
// ============================================================================

/**
 * Create question request
 * POST /admin/questions
 */
export interface CreateQuestionRequest {
    content: string;
    options: QuestionOptions;
    correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
    questionType: QuestionType; // ✅ Uses shared enum
    defaultScore: number;
    // ❌ imageUrl removed - not supported by backend
}

/**
 * Update question request
 * PATCH /admin/questions/:id
 */
export interface UpdateQuestionRequest {
    content?: string;
    options?: QuestionOptions; // Update entire options object
    correctAnswer?: 'A' | 'B' | 'C' | 'D' | 'E';
    questionType?: QuestionType; // ✅ Uses shared enum
    defaultScore?: number;
    // ❌ imageUrl removed - not supported by backend
}

/**
 * Query params for getQuestions
 * GET /admin/questions?page=1&limit=10&type=TIU&search=intelegensia
 */
export interface QuestionsQueryParams {
    page?: number;
    limit?: number;
    type?: QuestionType; // ✅ Uses shared enum (filter by question type)
    search?: string; // Search in content field
    sortBy?: 'content' | 'questionType' | 'createdAt' | 'updatedAt' | 'defaultScore';
    sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// API RESPONSE TYPES (what backend returns in 'data' field)
// ============================================================================

/**
 * GET /admin/questions response
 * Returns: { success: true, data: { data: [...], pagination: {...} }, ... }
 *
 * ✅ FIXED: Uses PaginatedResponse with correct field names
 * Backend returns questions WITH _count for usage statistics
 */
export type QuestionsListResponse = PaginatedResponse<QuestionWithUsage>;

/**
 * GET /admin/questions/:id response
 * Returns: { success: true, data: { question: {...} }, ... }
 */
export interface QuestionDetailResponse {
    question: QuestionWithUsage;
}

/**
 * POST /admin/questions response
 * Returns: { success: true, data: { question: {...} }, ... }
 */
export interface CreateQuestionResponse {
    question: Question;
}

/**
 * PATCH /admin/questions/:id response
 * Returns: { success: true, data: { question: {...} }, ... }
 */
export interface UpdateQuestionResponse {
    question: Question;
}

/**
 * DELETE /admin/questions/:id response
 * Returns: { success: true, data: { success: true }, ... }
 */
export interface DeleteQuestionResponse {
    success: boolean;
}