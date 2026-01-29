// src/shared/types/enum.types.ts

/**
 * SHARED ENUM TYPES
 *
 * ⚠️ CRITICAL: These MUST match backend Prisma enums EXACTLY
 * Source: backend/prisma/schema.prisma + backend-api-contract.md
 *
 * DO NOT modify these without checking backend first!
 */

// ============================================================================
// USER ENUMS
// ============================================================================

/**
 * User roles
 * Backend: enum UserRole { ADMIN, PARTICIPANT }
 */
export type UserRole = 'ADMIN' | 'PARTICIPANT';

// ============================================================================
// EXAM ENUMS
// ============================================================================

/**
 * Exam session status
 * Backend: enum ExamStatus { IN_PROGRESS, FINISHED, CANCELLED, TIMEOUT }
 *
 * ⚠️ NOTE: Backend uses FINISHED, not COMPLETED!
 */
export type ExamStatus = 'IN_PROGRESS' | 'FINISHED' | 'CANCELLED' | 'TIMEOUT';

/**
 * Question types for CPNS exam
 * Backend: enum QuestionType { TIU, TKP, TWK }
 *
 * TIU = Tes Intelegensia Umum (General Intelligence Test)
 * TKP = Tes Karakteristik Pribadi (Personal Characteristics Test)
 * TWK = Tes Wawasan Kebangsaan (National Insight Test)
 */
export type QuestionType = 'TIU' | 'TKP' | 'TWK';

/**
 * Answer options for multiple choice questions
 * Backend: Stored as string, validated as A-E or null
 */
export type AnswerOption = 'A' | 'B' | 'C' | 'D' | 'E' | null;

// ============================================================================
// PROCTORING ENUMS
// ============================================================================

/**
 * Proctoring event types
 * Backend: enum ProctoringEventType { FACE_DETECTED, NO_FACE_DETECTED, MULTIPLE_FACES, LOOKING_AWAY }
 */
export type ProctoringEventType =
    | 'FACE_DETECTED'
    | 'NO_FACE_DETECTED'
    | 'MULTIPLE_FACES'
    | 'LOOKING_AWAY';

/**
 * Proctoring violation severity levels
 * Backend: Stored as string in database ('LOW', 'MEDIUM', 'HIGH')
 */
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH';

// ============================================================================
// TOKEN ENUMS
// ============================================================================

/**
 * Token types for authentication
 * Backend: enum TokenType { ACCESS, REFRESH, RESET_PASSWORD, VERIFY_EMAIL }
 */
export type TokenType = 'ACCESS' | 'REFRESH' | 'RESET_PASSWORD' | 'VERIFY_EMAIL';

// ============================================================================
// ENUM CONSTANTS (for dropdowns, filters, validation)
// ============================================================================

/** All user roles */
export const USER_ROLES: readonly UserRole[] = ['ADMIN', 'PARTICIPANT'] as const;

/** All exam statuses */
export const EXAM_STATUSES: readonly ExamStatus[] = [
    'IN_PROGRESS',
    'FINISHED',
    'CANCELLED',
    'TIMEOUT',
] as const;

/** All question types */
export const QUESTION_TYPES: readonly QuestionType[] = ['TIU', 'TKP', 'TWK'] as const;

/** All answer options (without null) */
export const ANSWER_OPTIONS: readonly Exclude<AnswerOption, null>[] = [
    'A',
    'B',
    'C',
    'D',
    'E',
] as const;

/** All proctoring event types */
export const PROCTORING_EVENT_TYPES: readonly ProctoringEventType[] = [
    'FACE_DETECTED',
    'NO_FACE_DETECTED',
    'MULTIPLE_FACES',
    'LOOKING_AWAY',
] as const;

/** All severity levels */
export const SEVERITY_LEVELS: readonly Severity[] = ['LOW', 'MEDIUM', 'HIGH'] as const;

// ============================================================================
// DISPLAY LABELS (for UI rendering)
// ============================================================================

/** Human-readable labels for exam statuses */
export const EXAM_STATUS_LABELS: Record<ExamStatus, string> = {
    IN_PROGRESS: 'In Progress',
    FINISHED: 'Finished',
    CANCELLED: 'Cancelled',
    TIMEOUT: 'Timed Out',
};

/** Human-readable labels for question types */
export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
    TIU: 'TIU - Tes Intelegensia Umum',
    TKP: 'TKP - Tes Karakteristik Pribadi',
    TWK: 'TWK - Tes Wawasan Kebangsaan',
};

/** Short labels for question types */
export const QUESTION_TYPE_SHORT_LABELS: Record<QuestionType, string> = {
    TIU: 'TIU',
    TKP: 'TKP',
    TWK: 'TWK',
};

/** Human-readable labels for proctoring events */
export const PROCTORING_EVENT_LABELS: Record<ProctoringEventType, string> = {
    FACE_DETECTED: 'Face Detected',
    NO_FACE_DETECTED: 'No Face Detected',
    MULTIPLE_FACES: 'Multiple Faces',
    LOOKING_AWAY: 'Looking Away',
};

/** Human-readable labels for severity */
export const SEVERITY_LABELS: Record<Severity, string> = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
};

/** Severity colors for UI (Tailwind classes) */
export const SEVERITY_COLORS: Record<Severity, string> = {
    LOW: 'text-success bg-success/10',
    MEDIUM: 'text-warning bg-warning/10',
    HIGH: 'text-destructive bg-destructive/10',
};