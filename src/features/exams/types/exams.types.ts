// src/features/exams/types/exams.types.ts

/**
 * Exams Types
 *
 * Source: backend-api-contract.md + backend exams.validation.ts
 */

import type { PaginationMeta } from '@/shared/types/api.types';
import type { UserExam, UserExamSession, ExamQuestion, ParticipantAnswer } from '@/features/exam-sessions/types/exam-sessions.types';

// Re-export for convenience
export type { UserExam };

// ============================================================================
// EXAM ENTITY
// ============================================================================

/**
 * Exam entity (matches backend Prisma Exam model)
 */
export interface Exam {
    id: number;
    title: string;
    description: string | null;
    durationMinutes: number;
    startTime: string | null;
    endTime: string | null;
    createdBy: number;
    createdAt: string;
    updatedAt: string;
    _count?: {
        examQuestions: number;
        userExams: number;
    };
    creator?: {
        id: number;
        name: string;
        email: string;
    };
}

/**
 * Exam for participant view (published exams only)
 */
export interface ExamPublic {
    id: number;
    title: string;
    description: string | null;
    durationMinutes: number;
    startTime: string | null;
    endTime: string | null;
    createdAt: string;
    _count: {
        examQuestions: number;
    };
}

// ============================================================================
// API REQUEST TYPES
// ============================================================================

/**
 * Query params for GET /exams (participant)
 */
export interface ExamsQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: 'title' | 'createdAt' | 'durationMinutes';
    sortOrder?: 'asc' | 'desc';
}

/**
 * Query params for GET /admin/exams
 */
export interface AdminExamsQueryParams extends ExamsQueryParams {
    createdBy?: number;
}

/**
 * Request to create exam
 */
export interface CreateExamRequest {
    title: string;
    description?: string;
    durationMinutes: number;
    startTime?: string;
    endTime?: string;
}

/**
 * Request to update exam
 */
export interface UpdateExamRequest {
    title?: string;
    description?: string;
    durationMinutes?: number;
    startTime?: string;
    endTime?: string;
}

/**
 * Request to attach questions to exam
 */
export interface AttachQuestionsRequest {
    questionIds: number[];
}

/**
 * Request to detach questions from exam
 */
export interface DetachQuestionsRequest {
    questionIds: number[];
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * GET /exams (participant list)
 * ✅ Uses correct PaginationMeta from shared types
 */
export interface ExamsResponse {
    data: ExamPublic[];
    pagination: PaginationMeta;
}

/**
 * GET /exams/:id (participant detail)
 */
export interface ExamDetailResponse {
    exam: Exam;
}

/**
 * POST /exams/:id/start
 */
export interface StartExamResponse {
    userExam: UserExamSession;
    questions: ExamQuestion[];
    answers: ParticipantAnswer[];
}

/**
 * GET /admin/exams
 */
export interface AdminExamsResponse {
    data: Exam[];
    pagination: PaginationMeta;
}

/**
 * GET /admin/exams/:id
 */
export interface AdminExamDetailResponse {
    exam: Exam;
}

/**
 * POST /admin/exams
 */
export interface CreateExamResponse {
    exam: Exam;
}

/**
 * PATCH /admin/exams/:id
 */
export interface UpdateExamResponse {
    exam: Exam;
}

/**
 * DELETE /admin/exams/:id
 */
export interface DeleteExamResponse {
    success: boolean;
    message: string;
}

/**
 * POST /admin/exams/:id/questions (attach)
 */
export interface AttachQuestionsResponse {
    attached: number;
    total: number;
}

/**
 * DELETE /admin/exams/:id/questions (detach)
 */
export interface DetachQuestionsResponse {
    detached: number;
    remaining: number;
}

/**
 * GET /admin/exams/:id/questions
 */
export interface ExamQuestionsListResponse {
    questions: Array<{
        id: number;
        orderNumber: number;
        question: {
            id: number;
            content: string;
            questionType: string;
            defaultScore: number;
        };
    }>;
    total: number;
}