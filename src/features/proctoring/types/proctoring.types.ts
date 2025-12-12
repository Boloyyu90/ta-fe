/**
 * Proctoring Types
 */

import type {
    ProctoringEventType,
    Severity,
} from '@/shared/types/enum.types';
import type { PaginationMeta } from '@/shared/types/api.types';

// Re-export for convenience
export type { ProctoringEventType, Severity };

// ============================================================================
// PROCTORING EVENT MODELS
// ============================================================================

/**
 * Proctoring event as returned by backend
 */
export interface ProctoringEvent {
    id: number;
    userExamId: number;
    eventType: ProctoringEventType;
    severity: Severity;
    timestamp: string;
    metadata: Record<string, unknown> | null;
    userExam?: {
        id: number;
        userId: number;
        examId: number;
        status: string;
        user?: {
            id: number;
            name: string;
            email: string;
        };
        exam?: {
            id: number;
            title: string;
        };
    };
}

/**
 * Metadata structure for face detection events
 * Extracted from metadata JSON
 */
export interface FaceDetectionMetadata {
    confidence: number;
    faceCount: number;
    boundingBox?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}

// ============================================================================
// UI TYPES (for proctoring monitor)
// ============================================================================

/**
 * Violation for UI display (simplified)
 */
export interface Violation {
    id: string;
    type: ProctoringEventType;
    severity: Severity;
    timestamp: string;
    message: string;
}

/**
 * Face analysis result from YOLO service
 */
export interface FaceAnalysisResult {
    eventType: ProctoringEventType;
    severity: Severity;
    confidence: number;
    faceCount: number;
    message: string;
}

/**
 * Webcam state for proctoring store
 */
export interface WebcamState {
    isActive: boolean;
    stream: MediaStream | null;
    error: string | null;
    hasPermission: boolean | null;
}

// ============================================================================
// API REQUEST TYPES
// ============================================================================

/**
 * Request to analyze face
 */
export interface AnalyzeFaceRequest {
    imageBase64: string;
}

/**
 * Query params for proctoring events
 */
export interface ProctoringEventsQueryParams {
    page?: number;
    limit?: number;
    eventType?: ProctoringEventType;
    userExamId?: number;
    startDate?: string;
    endDate?: string;
    sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * POST /proctoring/exam-sessions/:id/analyze-face
 */
export interface AnalyzeFaceResponse {
    event: ProctoringEvent;
    analysis: FaceAnalysisResult;
}

/**
 * GET /proctoring/exam-sessions/:id/events
 */
export interface ProctoringEventsResponse {
    data: ProctoringEvent[];
    pagination: PaginationMeta;
}

/**
 * GET /admin/proctoring/events
 */
export interface AdminProctoringEventsResponse {
    data: ProctoringEvent[];
    pagination: PaginationMeta;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Extract confidence from metadata
 */
export function getConfidenceFromMetadata(
    metadata: Record<string, unknown> | null
): number | null {
    if (!metadata) return null;
    const confidence = metadata.confidence;
    if (typeof confidence === 'number') return confidence;
    return null;
}

/**
 * Extract face count from metadata
 */
export function getFaceCountFromMetadata(
    metadata: Record<string, unknown> | null
): number | null {
    if (!metadata) return null;
    const faceCount = metadata.faceCount;
    if (typeof faceCount === 'number') return faceCount;
    return null;
}

/**
 * Create violation message from event
 */
export function createViolationMessage(eventType: ProctoringEventType): string {
    const messages: Record<ProctoringEventType, string> = {
        FACE_DETECTED: 'Wajah terdeteksi dengan baik',
        NO_FACE_DETECTED: 'Wajah tidak terdeteksi. Pastikan wajah Anda terlihat di kamera.',
        MULTIPLE_FACES: 'Terdeteksi lebih dari satu wajah. Pastikan hanya Anda yang terlihat.',
        LOOKING_AWAY: 'Anda terdeteksi tidak melihat ke layar.',
    };
    return messages[eventType] ?? 'Event proctoring terdeteksi';
}