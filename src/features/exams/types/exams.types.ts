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
import type { QuestionType } from '@/shared/types/enum.types';
import type { Question } from '@/features/questions/types/questions.types';


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
    allowRetake: boolean;           // Whether users can retake this exam
    maxAttempts: number | null;     // Maximum attempts (null = unlimited when retakes enabled)
    price: number | null;           // Price for paid exams (null = free)
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
    allowRetake: boolean;           // Whether users can retake this exam
    maxAttempts: number | null;     // Maximum attempts (null = unlimited when retakes enabled)
    price: number | null;           // Price for paid exams (null = free)
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
    allowRetake?: boolean;          // Optional, backend default: false
    maxAttempts?: number | null;    // Optional, backend default: null
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
    allowRetake?: boolean;          // Optional for PATCH
    maxAttempts?: number | null;    // Optional for PATCH
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
 * Returns paginated list of all exams with guaranteed question counts
 * Backend returns ExamWithCount[] (not Exam[]) - _count.examQuestions is guaranteed
 */
export interface AdminExamsListResponse {
    data: ExamWithCount[];
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
 * Attempt info as returned by GET /exams/:id for participants
 * Backend returns this for completed attempts (FINISHED, TIMEOUT, CANCELLED)
 * Only included when userId is present (participant view)
 */
export interface ExamAttemptInfo {
    id: number;
    attemptNumber: number;
    totalScore: number | null;
    status: 'FINISHED' | 'TIMEOUT' | 'CANCELLED';
    startedAt: string;
    submittedAt: string | null;
}

/**
 * GET /exams/:id (participant view with attempts info)
 *
 * Backend returns attempts info for participants:
 * - attemptsCount: number of completed attempts for THIS exam
 * - firstAttempt: first attempt info (if any)
 * - latestAttempt: most recent attempt info (if any)
 *
 * This allows showing accurate button states without separate session queries
 * Source: backend exams.service.ts getExamById()
 */
export interface ExamDetailWithAttemptsResponse {
    exam: Exam;
    attemptsCount?: number;
    firstAttempt?: ExamAttemptInfo | null;
    latestAttempt?: ExamAttemptInfo | null;
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
 * Backend returns: { success: true }
 */
export interface DeleteExamResponse {
    success: boolean;
}

/**
 * POST /admin/exams/:id/questions
 * Backend returns: { attached: number, alreadyAttached: number }
 */
export interface AttachQuestionsResponse {
    attached: number;
    alreadyAttached: number;
}

/**
 * DELETE /admin/exams/:id/questions
 * Backend returns: { detached: number }
 */
export interface DetachQuestionsResponse {
    detached: number;
}

/**
 * A single item in GET /admin/exams/:id/questions
 *
 * Backend returns full question with correctAnswer (admin-only endpoint).
 * This allows admins to verify exam content including question options and correct answers.
 *
 * @see Backend: GET /api/v1/admin/exams/:id/questions
 * @see Backend contract: backend-api-contract.md lines 814-839
 */
export interface ExamQuestionItem {
    id: number;              // ExamQuestion (junction) ID
    orderNumber: number;
    question: Question;      // Full question from question bank
}

/**
 * GET /admin/exams/:id/questions
 * Backend-style list response (matches other list endpoints in the project)
 */
export interface ExamQuestionsListResponse {
    questions: ExamQuestionItem[];
    total: number;
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
    const questionCount = exam._count?.examQuestions ?? 0;
    if (questionCount === 0) {
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