// src/features/proctoring/types/proctoring.types.ts

/**
 * Proctoring Types
 *
 * ✅ AUDIT FIX v4:
 * - Added eventLogged to AnalyzeFaceResponse (matches backend)
 * - Export ViolationSeverity and ProctoringEventType
 * - WebcamState has isActive field
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
 */
export interface ProctoringEvent {
    id: number;
    userExamId: number;
    eventType: ProctoringEventType;
    severity: ViolationSeverity;
    timestamp: string;
    metadata?: Record<string, unknown> | null;
    createdAt?: string;
}

// ============================================================================
// VIOLATION TYPES (UI-focused)
// ============================================================================

/**
 * Violation for UI display
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
// ✅ FIX: Added isActive field used by WebcamCapture component
// ============================================================================

export interface WebcamState {
    isActive: boolean;
    stream: MediaStream | null;
    error: string | null;
}

// ============================================================================
// FACE ANALYSIS TYPES
// ============================================================================

/**
 * Backend face analysis result structure
 */
export interface FaceAnalysisData {
    status: string;
    violations: string[];
    confidence: number;
    message: string;
    metadata?: {
        processingTimeMs?: number;
        modelVersion?: string;
        faceCount?: number;
        error?: string;
    };
}

// ============================================================================
// API REQUEST TYPES
// ============================================================================

export interface AnalyzeFaceRequest {
    imageBase64: string;
}

export interface LogEventRequest {
    userExamId: number;
    eventType: ProctoringEventType;
    metadata?: Record<string, unknown>;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * ✅ FIX: AnalyzeFaceResponse now includes eventLogged (matches backend)
 * Backend returns: { analysis, eventLogged, eventType, usedFallback }
 */
export interface AnalyzeFaceResponse {
    analysis: FaceAnalysisData;
    eventLogged: boolean;
    eventType: ProctoringEventType | null;
    usedFallback: boolean;
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
    lastAnalysis: FaceAnalysisData | null;
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
        details: event.metadata?.message as string | undefined,
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