// src/features/exams/types/exams.types.ts

/**
 * Exam Types
 *
 * ✅ AUDIT FIX v2:
 * - Fixed Exam entity to match backend (isActive, not status)
 * - Added all missing fields from backend
 * - Uses shared PaginationMeta
 *
 * Backend endpoints:
 * - Participant: /api/v1/exams/*
 * - Admin: /api/v1/admin/exams/*
 */

import type { PaginationMeta } from '@/shared/types/api.types';
import type { UserExam } from '@/features/exam-sessions/types/exam-sessions.types';

// ============================================================================
// BASE ENTITIES
// ============================================================================

/**
 * Exam entity - matches backend Prisma model
 *
 * ⚠️ CRITICAL: Backend uses `isActive` boolean, NOT `status` enum
 */
export interface Exam {
    id: number;
    title: string;
    description: string | null;
    durationMinutes: number;
    passingScore: number;
    isActive: boolean; // ✅ Backend uses this, NOT status enum
    startTime: string | null; // ISO datetime
    endTime: string | null; // ISO datetime
    createdBy: number;
    createdAt: string;
    updatedAt: string;
}

/**
 * Exam with counts (for list views)
 */
export interface ExamWithCounts extends Exam {
    _count: {
        examQuestions: number;
        userExams: number;
    };
}

/**
 * Exam with creator info (for admin views)
 */
export interface ExamWithCreator extends ExamWithCounts {
    creator: {
        id: number;
        name: string;
        email: string;
    };
}

/**
 * Exam question in exam context
 */
export interface ExamQuestionItem {
    id: number;
    orderNumber: number;
    question: {
        id: number;
        content: string;
        questionType: 'TIU' | 'TWK' | 'TKP';
        defaultScore: number;
        options?: {
            A: string;
            B: string;
            C: string;
            D: string;
            E: string;
        };
        correctAnswer?: 'A' | 'B' | 'C' | 'D' | 'E';
    };
}

/**
 * Exam with questions attached
 */
export interface ExamWithQuestions extends ExamWithCreator {
    examQuestions: ExamQuestionItem[];
}

// ============================================================================
// API REQUEST TYPES
// ============================================================================

export interface CreateExamRequest {
    title: string;
    description?: string;
    durationMinutes: number;
    passingScore: number;
    isActive?: boolean;
    startTime?: string;
    endTime?: string;
}

export interface UpdateExamRequest {
    title?: string;
    description?: string | null;
    durationMinutes?: number;
    passingScore?: number;
    isActive?: boolean;
    startTime?: string | null;
    endTime?: string | null;
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

/**
 * GET /exams response (participant list)
 */
export interface ExamsResponse {
    data: ExamWithCounts[];
    pagination: PaginationMeta;
}

/**
 * GET /exams/:id response (participant single)
 */
export interface ExamDetailResponse {
    exam: ExamWithCounts;
}

/**
 * POST /exams/:id/start response
 */
export interface StartExamResponse {
    userExam: UserExam;
}

/**
 * GET /admin/exams response
 */
export interface AdminExamsResponse {
    data: ExamWithCreator[];
    pagination: PaginationMeta;
}

/**
 * GET /admin/exams/:id response
 */
export interface AdminExamDetailResponse {
    exam: ExamWithCreator;
}

/**
 * GET /admin/exams/:id/questions response
 */
export interface ExamQuestionsResponse {
    questions: ExamQuestionItem[];
    total: number;
}

/**
 * POST /admin/exams response
 */
export interface CreateExamResponse {
    exam: Exam;
}

/**
 * PATCH /admin/exams/:id response
 */
export interface UpdateExamResponse {
    exam: ExamWithCreator;
}

/**
 * DELETE /admin/exams/:id response
 */
export interface DeleteExamResponse {
    success: boolean;
    message?: string;
}

/**
 * POST /admin/exams/:id/questions response
 */
export interface AttachQuestionsResponse {
    message: string;
    attached: number;
    alreadyAttached?: number;
}

/**
 * DELETE /admin/exams/:id/questions response
 */
export interface DetachQuestionsResponse {
    message: string;
    detached: number;
}

// ============================================================================
// QUERY PARAMS TYPES
// ============================================================================

export interface ExamsQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'active' | 'inactive' | 'all'; // UI filter, maps to isActive
    sortBy?: 'title' | 'createdAt' | 'durationMinutes' | 'startTime';
    sortOrder?: 'asc' | 'desc';
}

export interface AdminExamsQueryParams extends ExamsQueryParams {
    createdBy?: number;
}

// ============================================================================
// UI HELPER TYPES
// ============================================================================

/**
 * Check if exam is currently available for registration
 */
export function isExamAvailable(exam: Exam): boolean {
    if (!exam.isActive) return false;

    const now = new Date();

    if (exam.startTime && new Date(exam.startTime) > now) {
        return false; // Hasn't started yet
    }

    if (exam.endTime && new Date(exam.endTime) < now) {
        return false; // Already ended
    }

    return true;
}

/**
 * Get exam availability status text
 */
export function getExamAvailabilityStatus(exam: Exam): {
    status: 'available' | 'upcoming' | 'ended' | 'inactive';
    label: string;
} {
    if (!exam.isActive) {
        return { status: 'inactive', label: 'Tidak Aktif' };
    }

    const now = new Date();

    if (exam.startTime && new Date(exam.startTime) > now) {
        return { status: 'upcoming', label: 'Belum Dimulai' };
    }

    if (exam.endTime && new Date(exam.endTime) < now) {
        return { status: 'ended', label: 'Sudah Berakhir' };
    }

    return { status: 'available', label: 'Tersedia' };
}