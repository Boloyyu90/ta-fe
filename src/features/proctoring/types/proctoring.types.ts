// src/features/proctoring/types/proctoring.types.ts

/**
 * PROCTORING TYPES - ALIGNED WITH BACKEND CONTRACT
 *
 * ✅ Imports enums from shared (no local redefinitions)
 * ✅ Imports PaginationMeta from shared
 * ✅ Matches backend API contract exactly
 * ✅ Severity: LOW | MEDIUM | HIGH (no INFO)
 *
 * @see backend-api-contract.md Section 7 - Proctoring Module
 */

import type { ProctoringEventType, Severity } from '@/shared/types/enum.types';
import type { PaginationMeta } from '@/shared/types/api.types';

// Re-export for convenience
export type { ProctoringEventType, Severity };

// ============================================================================
// ANALYSIS STATUS (ML Service Response)
// ============================================================================

/**
 * Status of face analysis from ML service
 */
export type AnalysisStatus = 'success' | 'error' | 'timeout';

// ============================================================================
// PROCTORING EVENT (Backend Entity)
// ============================================================================

/**
 * Proctoring event entity
 * Matches backend ProctoringEvent model
 *
 * @see GET /proctoring/exam-sessions/:userExamId/events
 */
export interface ProctoringEvent {
    id: number;
    userExamId: number;
    eventType: ProctoringEventType;
    severity: Severity;
    timestamp: string; // ISO datetime
    metadata: Record<string, unknown> | null;
}

/**
 * Proctoring event with user exam details (admin view)
 *
 * @see GET /admin/proctoring/events
 */
export interface ProctoringEventWithDetails extends ProctoringEvent {
    userExam: {
        id: number;
        userId: number;
        examId: number;
        status: string;
        user: {
            id: number;
            name: string;
            email: string;
        };
        exam: {
            id: number;
            title: string;
        };
    };
}

// ============================================================================
// WEBCAM STATE (Frontend Only)
// ============================================================================

/**
 * Webcam state for UI
 * Used by useWebcam hook and ProctoringMonitor component
 */
export interface WebcamState {
    isActive: boolean;
    stream: MediaStream | null;
    error: string | null;
    lastCapture: string | null; // Base64 image
}

// ============================================================================
// VIOLATION (UI State)
// ============================================================================

/**
 * UI-friendly violation representation
 * Used by Zustand store for real-time violation tracking
 */
export interface Violation {
    id: string;
    type: ProctoringEventType;
    severity: Severity;
    timestamp: string;
    message: string;
}

/**
 * Violation counts for UI display
 */
export interface ViolationCounts {
    low: number;
    medium: number;
    high: number;
    total: number;
}

// ============================================================================
// API REQUEST TYPES
// ============================================================================

/**
 * Face analysis request
 * POST /proctoring/exam-sessions/:userExamId/analyze-face
 */
export interface AnalyzeFaceRequest {
    imageBase64: string;
}

/**
 * Log proctoring event request
 * POST /proctoring/events
 */
export interface LogEventRequest {
    userExamId: number;
    eventType: ProctoringEventType;
    metadata?: Record<string, unknown>;
}

/**
 * Query params for getting proctoring events
 * GET /proctoring/exam-sessions/:userExamId/events
 */
export interface ProctoringEventsParams {
    page?: number;
    limit?: number;
    eventType?: ProctoringEventType;
    startDate?: string; // ISO datetime
    endDate?: string;   // ISO datetime
    sortOrder?: 'asc' | 'desc';
}

/**
 * Query params for admin proctoring events
 * GET /admin/proctoring/events
 */
export interface AdminProctoringEventsParams extends ProctoringEventsParams {
    userExamId?: number;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Face analysis metadata from ML service
 */
export interface FaceAnalysisMetadata {
    processingTimeMs?: number;
    modelVersion?: string;
    faceCount?: number;
    rawDetections?: unknown;
    error?: string;
}

/**
 * Face analysis result from ML service
 *
 * @see POST /proctoring/exam-sessions/:userExamId/analyze-face
 */
export interface FaceAnalysisResult {
    status: AnalysisStatus;
    violations: string[]; // ViolationType values as strings
    confidence: number;
    message: string;
    metadata?: FaceAnalysisMetadata;
}

/**
 * Complete analyze-face response payload
 *
 * Backend returns this inside ApiResponse wrapper:
 * { success: true, data: AnalyzeFaceResponse, ... }
 *
 * @see backend-api-contract.md Section 7.1
 */
export interface AnalyzeFaceResponse {
    analysis: FaceAnalysisResult;
    eventLogged: boolean;
    eventType: ProctoringEventType | null;
    usedFallback: boolean;
}

/**
 * Proctoring events list response payload
 *
 * Backend returns this inside ApiResponse wrapper:
 * { success: true, data: { data: [...], pagination: {...} }, ... }
 *
 * @see GET /proctoring/exam-sessions/:userExamId/events
 */
export interface ProctoringEventsResponse {
    data: ProctoringEvent[];
    pagination: PaginationMeta;
}

/**
 * Admin proctoring events list response payload
 *
 * @see GET /admin/proctoring/events
 */
export interface AdminProctoringEventsResponse {
    data: ProctoringEventWithDetails[];
    pagination: PaginationMeta;
}

/**
 * Log event response payload
 *
 * Backend returns this inside ApiResponse wrapper:
 * { success: true, data: { event: {...} }, ... }
 *
 * @see POST /proctoring/events
 */
export interface LogEventResponse {
    event: ProctoringEvent;
}

// ============================================================================
// HELPER TYPES FOR SEVERITY MAPPING
// ============================================================================

/**
 * Severity configuration for UI display
 */
export interface SeverityConfig {
    label: string;
    color: string;      // Tailwind text color
    bgColor: string;    // Tailwind background color
    icon: string;       // Icon name (lucide-react)
}

/**
 * Map of severity to UI config
 */
export type SeverityConfigMap = Record<Severity, SeverityConfig>;

/**
 * Event type configuration for UI display
 */
export interface EventTypeConfig {
    label: string;
    description: string;
    severity: Severity;
    icon: string;
}

/**
 * Map of event type to UI config
 */
export type EventTypeConfigMap = Record<ProctoringEventType, EventTypeConfig>;

// ============================================================================
// CONSTANTS (for UI)
// ============================================================================

/**
 * Severity UI configuration
 * Use with SeverityBadge component
 */
export const SEVERITY_CONFIG: SeverityConfigMap = {
    LOW: {
        label: 'Low',
        color: 'text-green-600',
        bgColor: 'bg-green-50 dark:bg-green-950/30',
        icon: 'CheckCircle',
    },
    MEDIUM: {
        label: 'Medium',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
        icon: 'AlertTriangle',
    },
    HIGH: {
        label: 'High',
        color: 'text-red-600',
        bgColor: 'bg-red-50 dark:bg-red-950/30',
        icon: 'AlertCircle',
    },
};

/**
 * Event type UI configuration
 * Use with EventTypeBadge component
 */
export const EVENT_TYPE_CONFIG: EventTypeConfigMap = {
    FACE_DETECTED: {
        label: 'Face Detected',
        description: 'Normal state - face properly detected',
        severity: 'LOW',
        icon: 'CheckCircle',
    },
    NO_FACE_DETECTED: {
        label: 'No Face Detected',
        description: 'No face visible in camera frame',
        severity: 'HIGH',
        icon: 'UserX',
    },
    MULTIPLE_FACES: {
        label: 'Multiple Faces',
        description: 'More than one person detected',
        severity: 'HIGH',
        icon: 'Users',
    },
    LOOKING_AWAY: {
        label: 'Looking Away',
        description: 'Face not looking at screen',
        severity: 'MEDIUM',
        icon: 'Eye',
    },
};

/**
 * Violation thresholds for auto-cancellation
 * @see backend-api-contract.md Business Rules - Proctoring
 */
export const VIOLATION_THRESHOLDS = {
    HIGH_VIOLATIONS_LIMIT: 3,    // 3 HIGH violations → exam cancelled
    MEDIUM_VIOLATIONS_LIMIT: 10, // 10 MEDIUM violations → exam cancelled
} as const;