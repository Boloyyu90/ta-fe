// src/shared/types/enum.types.ts

/**
 * SHARED ENUM TYPES
 *
 * ⚠️ CRITICAL: These MUST match backend Prisma enums EXACTLY
 * Source: backend/prisma/schema.prisma
 *
 * DO NOT modify without verifying backend first!
 */

// ============================================================================
// USER ENUMS
// ============================================================================

/**
 * User roles
 * Backend Prisma: enum UserRole { ADMIN, PARTICIPANT }
 */
export type UserRole = 'ADMIN' | 'PARTICIPANT';

// ============================================================================
// EXAM SESSION STATUS (for UserExam model)
// ============================================================================

/**
 * ⚠️ CRITICAL FIX: This is UserExam.status, NOT Exam.status!
 * Backend Prisma: enum ExamStatus { IN_PROGRESS, FINISHED, CANCELLED, TIMEOUT }
 *
 * Applied to: UserExam.status field
 * Represents: Status of a participant's exam session
 */
export type UserExamStatus = 'IN_PROGRESS' | 'FINISHED' | 'CANCELLED' | 'TIMEOUT';

// ❌ REMOVED: Frontend was using 'NOT_STARTED' | 'COMPLETED' - these DON'T exist in backend
// ❌ REMOVED: Separate 'ExamStatus' for exam entity - that's not an enum in backend

// ============================================================================
// QUESTION TYPES
// ============================================================================

/**
 * Question types for CPNS exam
 * Backend Prisma: enum QuestionType { TIU, TKP, TWK }
 */
export type QuestionType = 'TIU' | 'TKP' | 'TWK';

// ============================================================================
// PROCTORING ENUMS
// ============================================================================

/**
 * Proctoring event types
 * Backend Prisma: enum ProctoringEventType { FACE_DETECTED, NO_FACE_DETECTED, MULTIPLE_FACES, LOOKING_AWAY }
 */
export type ProctoringEventType =
    | 'FACE_DETECTED'
    | 'NO_FACE_DETECTED'
    | 'MULTIPLE_FACES'
    | 'LOOKING_AWAY';

/**
 * ⚠️ CRITICAL FIX: Backend stores as string, only uses 3 levels
 * Backend: severity is stored as string with values 'LOW' | 'MEDIUM' | 'HIGH'
 *
 * ❌ REMOVED 'INFO' - backend never returns this value
 */
export type ViolationSeverity = 'LOW' | 'MEDIUM' | 'HIGH';

// ============================================================================
// TOKEN ENUMS
// ============================================================================

/**
 * Token types for authentication
 * Backend Prisma: enum TokenType { ACCESS, REFRESH, RESET_PASSWORD, VERIFY_EMAIL }
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
 * User exam status options for filters
 */
export const USER_EXAM_STATUS_OPTIONS = [
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