// src/shared/types/enum.types.ts

/**
 * SHARED ENUM TYPES
 *
 * ⚠️ CRITICAL: These MUST match backend Prisma enums EXACTLY
 * Source: backend/prisma/schema.prisma
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
export type ProctoringEventSeverity = 'LOW' | 'MEDIUM' | 'HIGH';

// ============================================================================
// TOKEN ENUMS
// ============================================================================

/**
 * Token types for authentication
 * Backend: enum TokenType { ACCESS, REFRESH, RESET_PASSWORD, VERIFY_EMAIL }
 */
export type TokenType = 'ACCESS' | 'REFRESH' | 'RESET_PASSWORD' | 'VERIFY_EMAIL';

// ============================================================================
// ENUM CONSTANTS (for dropdowns, filters, etc)
// ============================================================================

/**
 * User role options for forms
 */
export const USER_ROLE_OPTIONS = [
    { value: 'PARTICIPANT' as const, label: 'Participant' },
    { value: 'ADMIN' as const, label: 'Administrator' },
] as const;

/**
 * Exam status options for filters
 */
export const EXAM_STATUS_OPTIONS = [
    { value: 'IN_PROGRESS' as const, label: 'In Progress' },
    { value: 'FINISHED' as const, label: 'Finished' },
    { value: 'CANCELLED' as const, label: 'Cancelled' },
    { value: 'TIMEOUT' as const, label: 'Timeout' },
] as const;

/**
 * Question type options for forms/filters
 */
export const QUESTION_TYPE_OPTIONS = [
    { value: 'TIU' as const, label: 'TIU - General Intelligence' },
    { value: 'TKP' as const, label: 'TKP - Personal Characteristics' },
    { value: 'TWK' as const, label: 'TWK - National Insight' },
] as const;

/**
 * Proctoring event type options for filters
 */
export const PROCTORING_EVENT_TYPE_OPTIONS = [
    { value: 'FACE_DETECTED' as const, label: 'Face Detected' },
    { value: 'NO_FACE_DETECTED' as const, label: 'No Face Detected' },
    { value: 'MULTIPLE_FACES' as const, label: 'Multiple Faces' },
    { value: 'LOOKING_AWAY' as const, label: 'Looking Away' },
] as const;

/**
 * Severity level options for filters
 */
export const SEVERITY_OPTIONS = [
    { value: 'LOW' as const, label: 'Low' },
    { value: 'MEDIUM' as const, label: 'Medium' },
    { value: 'HIGH' as const, label: 'High' },
] as const;

// ============================================================================
// ENUM HELPERS
// ============================================================================

/**
 * Get color class for exam status badge
 */
export const getExamStatusColor = (status: ExamStatus): string => {
    switch (status) {
        case 'IN_PROGRESS':
            return 'bg-blue-500';
        case 'FINISHED':
            return 'bg-green-500';
        case 'CANCELLED':
            return 'bg-red-500';
        case 'TIMEOUT':
            return 'bg-orange-500';
        default:
            return 'bg-gray-500';
    }
};

/**
 * Get color class for proctoring severity badge
 */
export const getSeverityColor = (severity: ProctoringEventSeverity): string => {
    switch (severity) {
        case 'LOW':
            return 'bg-green-500';
        case 'MEDIUM':
            return 'bg-yellow-500';
        case 'HIGH':
            return 'bg-red-500';
        default:
            return 'bg-gray-500';
    }
};

/**
 * Get human-readable label for exam status
 */
export const getExamStatusLabel = (status: ExamStatus): string => {
    switch (status) {
        case 'IN_PROGRESS':
            return 'In Progress';
        case 'FINISHED':
            return 'Finished';
        case 'CANCELLED':
            return 'Cancelled';
        case 'TIMEOUT':
            return 'Timeout';
        default:
            return status;
    }
};

/**
 * Get human-readable label for question type
 */
export const getQuestionTypeLabel = (type: QuestionType): string => {
    switch (type) {
        case 'TIU':
            return 'General Intelligence';
        case 'TKP':
            return 'Personal Characteristics';
        case 'TWK':
            return 'National Insight';
        default:
            return type;
    }
};