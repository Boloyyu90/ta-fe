// src/features/proctoring/types/proctoring.types.ts

/**
 * Proctoring Types
 *
 * ✅ AUDIT FIX v3:
 * - Export ViolationSeverity and ProctoringEventType from shared
 * - Re-export Violation (renamed from UIViolation)
 * - Added details and mlConfidence to ProctoringEvent
 *
 * Backend: /api/v1/proctoring/*
 */

import type { PaginationMeta } from '@/shared/types/api.types';

// ============================================================================
// RE-EXPORT FROM SHARED (for components that import from here)
// ============================================================================

export type { ProctoringEventType, ViolationSeverity } from '@/shared/types/enum.types';

// Import for use in this file
import type { ProctoringEventType, ViolationSeverity } from '@/shared/types/enum.types';

// ============================================================================
// PROCTORING EVENT MODEL
// ============================================================================

/**
 * Proctoring event entity
 * ✅ FIX: Added details and mlConfidence fields
 */
export interface ProctoringEvent {
    id: number;
    userExamId: number;
    eventType: ProctoringEventType;
    severity: ViolationSeverity;
    timestamp: string;
    details?: string | null;
    mlConfidence?: number | null;
    imageUrl?: string | null;
    createdAt: string;
}

// ============================================================================
// VIOLATION TYPES (UI-focused)
// ============================================================================

/**
 * Violation for UI display
 * ✅ FIX: Exported as both Violation and UIViolation for compatibility
 */
export interface UIViolation {
    id: number;
    type: ProctoringEventType;
    severity: ViolationSeverity;
    message: string;
    timestamp: string;
    details?: string | null;
}

// Alias for backwards compatibility
export type Violation = UIViolation;

// ============================================================================
// WEBCAM STATE
// ============================================================================

export interface WebcamState {
    isEnabled: boolean;
    isStreaming: boolean;
    hasPermission: boolean | null;
    error: string | null;
}

// ============================================================================
// FACE ANALYSIS TYPES
// ============================================================================

export interface FaceDetectionResult {
    faceDetected: boolean;
    faceCount: number;
    confidence: number;
    lookingAway: boolean;
    violations: Array<{
        type: ProctoringEventType;
        severity: ViolationSeverity;
        message: string;
    }>;
}

// ============================================================================
// API REQUEST TYPES
// ============================================================================

export interface AnalyzeFaceRequest {
    imageData: string; // Base64 encoded image
}

export interface LogEventRequest {
    userExamId: number;
    eventType: ProctoringEventType;
    severity?: ViolationSeverity;
    details?: string;
    imageUrl?: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface AnalyzeFaceResponse {
    success: boolean;
    analysis: FaceDetectionResult;
    event?: ProctoringEvent;
}

export interface LogEventResponse {
    event: ProctoringEvent;
}

export interface ProctoringEventsResponse {
    data: ProctoringEvent[];
    pagination: PaginationMeta;
}

// ============================================================================
// QUERY PARAMS TYPES
// ============================================================================

export interface ProctoringEventsParams {
    page?: number;
    limit?: number;
    eventType?: ProctoringEventType;
    severity?: ViolationSeverity;
}

// ============================================================================
// STORE STATE TYPES
// ============================================================================

export interface ProctoringState {
    webcam: WebcamState;
    violations: UIViolation[];
    isAnalyzing: boolean;
    lastAnalysis: FaceDetectionResult | null;
    violationCount: number;
    highViolationCount: number;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert ProctoringEvent to UIViolation
 */
export function eventToViolation(event: ProctoringEvent): UIViolation {
    return {
        id: event.id,
        type: event.eventType,
        severity: event.severity,
        message: getViolationMessage(event.eventType),
        timestamp: event.timestamp,
        details: event.details,
    };
}

/**
 * Get human-readable message for violation type
 */
export function getViolationMessage(type: ProctoringEventType): string {
    const messages: Record<ProctoringEventType, string> = {
        FACE_DETECTED: 'Wajah terdeteksi',
        NO_FACE_DETECTED: 'Wajah tidak terdeteksi',
        MULTIPLE_FACES: 'Terdeteksi lebih dari satu wajah',
        LOOKING_AWAY: 'Tidak melihat ke layar',
    };
    return messages[type] || 'Pelanggaran terdeteksi';
}

/**
 * Get severity color class
 */
export function getSeverityColor(severity: ViolationSeverity): string {
    const colors: Record<ViolationSeverity, string> = {
        LOW: 'text-yellow-600 bg-yellow-100',
        MEDIUM: 'text-orange-600 bg-orange-100',
        HIGH: 'text-red-600 bg-red-100',
    };
    return colors[severity] || 'text-gray-600 bg-gray-100';
}