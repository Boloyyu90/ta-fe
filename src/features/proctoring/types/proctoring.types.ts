// src/features/proctoring/types/proctoring.types.ts

// ============================================================================
// EXISTING TYPES (from Part 2)
// ============================================================================
export type EventType =
    | 'PROCTORING_STARTED'
    | 'FACE_DETECTED'
    | 'NO_FACE_DETECTED'
    | 'MULTIPLE_FACES'
    | 'LOOKING_AWAY'
    | 'EXAM_AUTO_CANCELLED';

export type Severity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH';

export type ViolationType =
    | 'NO_FACE'
    | 'MULTIPLE_FACES'
    | 'LOOKING_AWAY'
    | 'UNAUTHORIZED_DEVICE'
    | 'SUSPICIOUS_BEHAVIOR';

export interface ProctoringEvent {
    id: number;
    userExamId: number;
    eventType: EventType;
    severity: Severity;
    details: string | null;
    mlConfidence: number | null;
    timestamp: string;
    createdAt: string;
}

export interface Violation {
    id: number;
    userExamId: number;
    violationType: ViolationType;
    severity: Severity;
    description: string | null;
    evidenceUrl: string | null;
    timestamp: string;
    createdAt: string;
}

export interface AnalyzeFaceRequest {
    image: string; // Base64 encoded image
}

export interface AnalyzeFaceResponse {
    success: boolean;
    message: string;
    data: {
        faceDetected: boolean;
        multipleFaces: boolean;
        lookingAway: boolean;
        confidence: number;
        eventType: EventType;
        severity: Severity;
    };
}

// ============================================================================
// NEW TYPES FOR PART 3
// ============================================================================

// For Proctoring Events List (with pagination)
export interface ProctoringEventsResponse {
    events: ProctoringEvent[];
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

export interface ProctoringEventsParams {
    page?: number;
    limit?: number;
    eventType?: EventType;
    severity?: Severity;
}

// Webcam state management
export interface WebcamState {
    isActive: boolean;
    stream: MediaStream | null;
    error: string | null;
    lastCapture: string | null;
}