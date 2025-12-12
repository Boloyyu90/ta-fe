import type { PaginationMeta } from '@/shared/types/api.types';
import type { UserExam, UserExamSession, ExamQuestion, ParticipantAnswer } from '@/features/exam-sessions/types/exam-sessions.types';

// Re-export for convenience
export type { UserExam };

// ============================================================================
// EXAM ENTITY
// ============================================================================

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
 */
export interface AttachQuestionsRequest {
    questionIds: number[];
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * GET /exams (participant list)
 */
export interface ExamsListResponse {
    data: ExamPublic[];
    pagination: PaginationMeta;
}

/**
 * GET /admin/exams (admin list)
 */
export interface AdminExamsListResponse {
    data: Exam[];
    pagination: PaginationMeta;
}

/**
 * GET /exams/:id (single exam)
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