/**
 * PROCTORING TYPES
 *
 * ============================================================================
 * ALIGNED WITH BACKEND CONTRACT (backend-api-contract.md)
 * ============================================================================
 *
 * Key endpoints:
 * - POST /proctoring/exam-sessions/:id/analyze-face → AnalyzeFaceResponse
 * - GET /proctoring/exam-sessions/:id/events → ProctoringEventsResponse
 * - POST /proctoring/events → LogEventResponse
 * - GET /admin/proctoring/events → AdminProctoringEventsResponse
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
    // Optional: included in admin responses
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
    status: 'success' | 'timeout' | 'error';
    violations: string[];
    confidence: number;
    message: string;
    metadata?: {
        processingTimeMs: number;
        error?: string;
    };
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
 * POST /proctoring/exam-sessions/:id/analyze-face
 */
export interface AnalyzeFaceRequest {
    imageBase64: string;
}

/**
 * Request to log proctoring event manually
 * POST /proctoring/events
 */
export interface LogEventRequest {
    userExamId: number;
    eventType: ProctoringEventType;
    metadata?: Record<string, unknown>;
}

/**
 * Query params for proctoring events (participant)
 * GET /proctoring/exam-sessions/:id/events
 */
export interface ProctoringEventsQueryParams {
    page?: number;
    limit?: number;
    eventType?: ProctoringEventType;
    startDate?: string;
    endDate?: string;
    sortOrder?: 'asc' | 'desc';
}

/**
 * Query params for admin proctoring events
 * GET /admin/proctoring/events
 */
export interface AdminProctoringEventsQueryParams extends ProctoringEventsQueryParams {
    userExamId?: number;
}

// ============================================================================
// TYPE ALIASES FOR BACKWARD COMPATIBILITY
// ============================================================================

/** @deprecated Use ProctoringEventsQueryParams instead */
export type ProctoringEventsParams = ProctoringEventsQueryParams;

/** @deprecated Use AdminProctoringEventsQueryParams instead */
export type AdminProctoringEventsParams = AdminProctoringEventsQueryParams;

// ============================================================================
// API RESPONSE TYPES (Aligned with backend contract)
// ============================================================================

/**
 * POST /proctoring/exam-sessions/:id/analyze-face
 *
 * ⚠️ THIS IS THE CORE ML INTEGRATION FOR THESIS DEMONSTRATION
 */
export interface AnalyzeFaceResponse {
    analysis: FaceAnalysisResult;
    eventLogged: boolean;
    eventType: ProctoringEventType | null;
    usedFallback: boolean;
}

/**
 * POST /proctoring/events
 * Returns the logged event
 */
export interface LogEventResponse {
    event: ProctoringEvent;
}

/**
 * GET /proctoring/exam-sessions/:id/events
 * Returns paginated list of proctoring events
 */
export interface ProctoringEventsResponse {
    data: ProctoringEvent[];
    pagination: PaginationMeta;
}

/**
 * GET /admin/proctoring/events
 * Returns paginated list with user exam details
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