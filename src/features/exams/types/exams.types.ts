/**
 * EXAMS TYPES
 */

import type { PaginationMeta } from '@/shared/types/api.types';
import type {
    UserExam,
    UserExamSession,
    ExamQuestion,
    ParticipantAnswer,
} from '@/features/exam-sessions/types/exam-sessions.types';

// Re-export for convenience
export type { UserExam };

// ============================================================================
// EXAM ENTITY (matches backend Exam model)
// ============================================================================

/**
 * Full Exam entity as returned by backend
 * Source: backend-api-contract.md Section 4.1
 */
export interface Exam {
    id: number;
    title: string;
    description: string | null;
    durationMinutes: number;
    passingScore: number;
    startTime: string | null;
    endTime: string | null;
    createdBy: number;
    createdAt: string;
    updatedAt: string;
    // Optional relations (included in some responses)
    _count?: {
        examQuestions: number;
        userExams?: number;
    };
    creator?: {
        id: number;
        name: string;
        email: string;
    };
}

/**
 * ExamWithCount - Exam with question count (used in list views)
 * Source: backend-api-contract.md Section 4.1
 */
export interface ExamWithCount extends Exam {
    _count: {
        examQuestions: number;
    };
}

/**
 * Public exam view for participants (excludes sensitive fields)
 */
export interface ExamPublic {
    id: number;
    title: string;
    description: string | null;
    durationMinutes: number;
    passingScore: number;
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
 * POST /admin/exams
 */
export interface CreateExamRequest {
    title: string;
    description?: string;
    durationMinutes: number;
    passingScore?: number;
    startTime?: string;
    endTime?: string;
}

/**
 * Request to update exam
 * PATCH /admin/exams/:id
 */
export interface UpdateExamRequest {
    title?: string;
    description?: string;
    durationMinutes?: number;
    passingScore?: number;
    startTime?: string;
    endTime?: string;
}

/**
 * Request to attach questions to exam
 * POST /admin/exams/:id/questions
 */
export interface AttachQuestionsRequest {
    questionIds: number[];
}

/**
 * Request to detach questions from exam
 * DELETE /admin/exams/:id/questions
 */
export interface DetachQuestionsRequest {
    questionIds: number[];
}

// ============================================================================
// API RESPONSE TYPES (Aligned with backend contract)
// ============================================================================

/**
 * GET /exams (participant list)
 * Returns paginated list of available exams
 */
export interface ExamsListResponse {
    data: ExamPublic[];
    pagination: PaginationMeta;
}

/**
 * GET /admin/exams (admin list)
 * Returns paginated list of all exams with creator info
 */
export interface AdminExamsListResponse {
    data: Exam[];
    pagination: PaginationMeta;
}

/**
 * GET /exams/:id (single exam detail)
 * Returns exam wrapped in { exam: Exam }
 */
export interface ExamDetailResponse {
    exam: Exam;
}

/**
 * GET /admin/exams/:id (admin exam detail)
 * Same structure as ExamDetailResponse but with full data
 */
export interface AdminExamDetailResponse {
    exam: Exam;
}

/**
 * POST /exams/:id/start
 * Returns started session with questions and existing answers
 */
export interface StartExamResponse {
    userExam: UserExamSession;
    questions: ExamQuestion[];
    answers: ParticipantAnswer[];
}

/**
 * POST /admin/exams
 * Returns created exam
 */
export interface CreateExamResponse {
    exam: Exam;
}

/**
 * PATCH /admin/exams/:id
 * Returns updated exam
 */
export interface UpdateExamResponse {
    exam: Exam;
}

/**
 * DELETE /admin/exams/:id
 * Returns success message
 */
export interface DeleteExamResponse {
    message: string;
}

/**
 * POST /admin/exams/:id/questions
 * Returns attach result
 */
export interface AttachQuestionsResponse {
    message: string;
    attached: number;
    alreadyAttached?: number;
}

/**
 * DELETE /admin/exams/:id/questions
 * Returns detach result
 */
export interface DetachQuestionsResponse {
    message: string;
    detached: number;
}

/**
 * GET /admin/exams/:id/questions
 * Returns exam's questions with pagination
 */
export interface ExamQuestionsListResponse {
    data: Array<{
        id: number;
        orderNumber: number;
        question: {
            id: number;
            content: string;
            questionType: string;
            defaultScore: number;
        };
    }>;
    pagination: PaginationMeta;
}

// ============================================================================
// TYPE ALIASES FOR BACKWARD COMPATIBILITY
// ============================================================================

/** @deprecated Use ExamsListResponse instead */
export type ExamsResponse = ExamsListResponse;

/** @deprecated Use AdminExamsListResponse instead */
export type AdminExamsResponse = AdminExamsListResponse;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if an exam is currently available (within time window)
 */
export function isExamAvailable(exam: Exam | ExamPublic): boolean {
    const now = new Date();

    // If no time restrictions, exam is always available
    if (!exam.startTime && !exam.endTime) {
        return true;
    }

    // Check start time
    if (exam.startTime && new Date(exam.startTime) > now) {
        return false; // Not started yet
    }

    // Check end time
    if (exam.endTime && new Date(exam.endTime) < now) {
        return false; // Already ended
    }

    return true;
}

/**
 * Get exam availability status for display
 */
export type ExamAvailabilityStatus = 'available' | 'upcoming' | 'ended' | 'no-questions';

export function getExamAvailabilityStatus(exam: Exam | ExamPublic): ExamAvailabilityStatus {
    const now = new Date();

    // Check if exam has questions
    if (exam._count && exam._count.examQuestions === 0) {
        return 'no-questions';
    }

    // Check if upcoming (not started yet)
    if (exam.startTime && new Date(exam.startTime) > now) {
        return 'upcoming';
    }

    // Check if ended
    if (exam.endTime && new Date(exam.endTime) < now) {
        return 'ended';
    }

    return 'available';
}

/**
 * Format duration in minutes to human readable string
 */
export function formatDuration(minutes: number): string {
    if (minutes < 60) {
        return `${minutes} menit`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
        return `${hours} jam`;
    }
    return `${hours} jam ${remainingMinutes} menit`;
}