// src/features/exams/types/exams.types.ts

/**
 * EXAMS TYPES - BACKEND-ALIGNED
 *
 * ✅ REFACTORED: All types match backend Prisma Exam model EXACTLY
 *
 * KEY FIXES:
 * - Uses shared PaginatedResponse<T> (fixed pagination field names)
 * - All dates as ISO strings, not Date objects
 * - ❌ REMOVED ExamStatus enum (doesn't exist for Exam entity in backend)
 * - Backend Exam model doesn't have a "status" field
 * - startTime and endTime are for scheduling, not status
 *
 * Backend Source: backend/prisma/schema.prisma (Exam model)
 */

import type { PaginatedResponse } from '@/shared/types/api.types';
import type { BaseEntity } from '@/shared/types/common.types';
import type { UserExam } from '@/features/exam-sessions/types/exam-sessions.types';

// ============================================================================
// EXAM ENTITY (from Prisma Exam model)
// ============================================================================

/**
 * Exam entity from backend Prisma Exam model
 *
 * Backend Prisma fields:
 * - id, title, description, startTime, endTime, durationMinutes, createdBy, createdAt, updatedAt
 *
 * ⚠️ IMPORTANT: Backend Exam model does NOT have a "status" field!
 * - There's no DRAFT/PUBLISHED/ARCHIVED status on the Exam entity itself
 * - startTime/endTime are for scheduling when exam is available
 * - Use startTime/endTime to determine if exam is currently active/upcoming/past
 */
export interface Exam extends BaseEntity {
    title: string;
    description: string | null;
    startTime: string | null; // ISO datetime - when exam becomes available
    endTime: string | null; // ISO datetime - when exam closes
    durationMinutes: number; // How long participants have to complete (default 60)
    createdBy: number; // User ID of creator (admin)
    // Backend also has relations: examQuestions[], userExams[]
}

/**
 * Exam with aggregated counts (for list/detail views)
 * Backend may return this with _count for statistics
 */
export interface ExamWithCounts extends Exam {
    _count?: {
        examQuestions: number; // Number of questions attached to exam
        userExams: number; // Number of participants who started this exam
    };
}

/**
 * Exam with creator info (for admin views)
 * Backend may return this from admin endpoints
 */
export interface ExamWithCreator extends ExamWithCounts {
    creator: {
        id: number;
        name: string;
        email: string;
    };
}

// ============================================================================
// API REQUEST TYPES (what we send to backend)
// ============================================================================

/**
 * Create exam request (admin only)
 * POST /admin/exams
 */
export interface CreateExamRequest {
    title: string;
    description?: string;
    startTime?: string; // ISO datetime
    endTime?: string; // ISO datetime
    durationMinutes: number;
    // Backend automatically sets createdBy from authenticated user
}

/**
 * Update exam request (admin only)
 * PATCH /admin/exams/:id
 */
export interface UpdateExamRequest {
    title?: string;
    description?: string;
    startTime?: string; // ISO datetime
    endTime?: string; // ISO datetime
    durationMinutes?: number;
}

/**
 * Query params for getExams (participant view)
 * GET /exams?page=1&limit=10&search=CPNS
 *
 * Participant sees only available exams (startTime <= now <= endTime)
 */
export interface ExamsQueryParams {
    page?: number;
    limit?: number;
    search?: string; // Search in title or description
    sortBy?: 'title' | 'createdAt' | 'durationMinutes' | 'startTime';
    sortOrder?: 'asc' | 'desc';
}

/**
 * Query params for getAdminExams (admin view)
 * GET /admin/exams?page=1&limit=10&search=CPNS
 *
 * Admin sees all exams regardless of scheduling
 */
export interface AdminExamsQueryParams extends ExamsQueryParams {
    // Admin may have additional filters in future
}

/**
 * Attach questions request (admin only)
 * POST /admin/exams/:id/questions
 */
export interface AttachQuestionsRequest {
    questionIds: number[]; // Array of question IDs to attach
}

/**
 * Detach questions request (admin only)
 * DELETE /admin/exams/:id/questions
 */
export interface DetachQuestionsRequest {
    questionIds: number[]; // Array of question IDs to remove
}

// ============================================================================
// API RESPONSE TYPES (what backend returns in 'data' field)
// ============================================================================

/**
 * GET /exams response (participant)
 * Returns: { success: true, data: { data: [...], pagination: {...} }, ... }
 *
 * ✅ FIXED: Uses PaginatedResponse with correct field names
 */
export type ExamsListResponse = PaginatedResponse<ExamWithCounts>;

/**
 * GET /admin/exams response (admin)
 * Returns: { success: true, data: { data: [...], pagination: {...} }, ... }
 */
export type AdminExamsListResponse = PaginatedResponse<ExamWithCreator>;

/**
 * GET /exams/:id response (participant)
 * Returns: { success: true, data: { exam: {...} }, ... }
 */
export interface ExamDetailResponse {
    exam: ExamWithCounts;
}

/**
 * GET /admin/exams/:id response (admin)
 * Returns: { success: true, data: { exam: {...} }, ... }
 */
export interface AdminExamDetailResponse {
    exam: ExamWithCreator;
}

/**
 * POST /admin/exams response
 * Returns: { success: true, data: { exam: {...} }, ... }
 */
export interface CreateExamResponse {
    exam: Exam;
}

/**
 * PATCH /admin/exams/:id response
 * Returns: { success: true, data: { exam: {...} }, ... }
 */
export interface UpdateExamResponse {
    exam: Exam;
}

/**
 * DELETE /admin/exams/:id response
 * Returns: { success: true, data: { success: true }, ... }
 */
export interface DeleteExamResponse {
    success: boolean;
}

/**
 * POST /exams/:id/start response
 * Returns: { success: true, data: { userExam: {...}, questions: [...], answers: [...] }, ... }
 *
 * This creates a new UserExam session and returns initial state
 */
export interface StartExamResponse {
    userExam: UserExam;
    questions: Array<{
        id: number;
        examQuestionId: number;
        content: string;
        options: {
            A: string;
            B: string;
            C: string;
            D: string;
            E: string;
        };
        questionType: string;
        orderNumber: number;
    }>;
    answers: Array<{
        examQuestionId: number;
        selectedOption: string | null;
        answeredAt: string | null;
    }>;
}

/**
 * POST /admin/exams/:id/questions response
 * Returns: { success: true, data: { message: "...", attached: N }, ... }
 */
export interface AttachQuestionsResponse {
    message: string;
    attached: number;
}

/**
 * DELETE /admin/exams/:id/questions response
 * Returns: { success: true, data: { message: "...", detached: N }, ... }
 */
export interface DetachQuestionsResponse {
    message: string;
    detached: number;
}

// ============================================================================
// UI HELPER TYPES
// ============================================================================

/**
 * Computed exam availability status (for UI only - not from backend)
 * Frontend calculates this based on startTime/endTime
 */
export type ExamAvailabilityStatus =
    | 'upcoming'    // startTime > now
    | 'active'      // startTime <= now <= endTime
    | 'expired'     // endTime < now
    | 'anytime';    // No time constraints (startTime and endTime both null)

/**
 * Helper function to determine exam availability (for UI)
 * NOT a backend field - computed on frontend
 */
export function getExamAvailability(exam: Exam): ExamAvailabilityStatus {
    const now = new Date();

    // No time constraints
    if (!exam.startTime && !exam.endTime) {
        return 'anytime';
    }

    const start = exam.startTime ? new Date(exam.startTime) : null;
    const end = exam.endTime ? new Date(exam.endTime) : null;

    if (start && now < start) {
        return 'upcoming';
    }

    if (end && now > end) {
        return 'expired';
    }

    return 'active';
}