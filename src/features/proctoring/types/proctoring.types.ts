// src/features/proctoring/types/proctoring.types.ts

// Webcam state - changed from union to object interface
export interface WebcamState {
    isActive: boolean;
    stream: MediaStream | null;
    error: string | null;
    lastCapture: string | null;
}

// Violation severity
export type ViolationSeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH';

// Proctoring event
export interface ProctoringEvent {
    id: number;
    userExamId: number;
    eventType: string;
    severity: ViolationSeverity;
    timestamp: string;
    details: string | null;
    mlConfidence: number | null;
    createdAt: string;
}

// Violation for UI state
export interface Violation {
    id: string;
    type: string;
    severity: ViolationSeverity;
    timestamp: string;
    message: string;
}

// Pagination
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// Query params for events
export interface ProctoringEventsParams {
    page?: number;
    limit?: number;
    eventType?: string;
    severity?: ViolationSeverity;
}

// API Responses
export interface ProctoringEventsResponse {
    data: ProctoringEvent[];
    pagination: PaginationMeta;
}

export interface AnalyzeFaceRequest {
    imageBase64: string;
}

export interface AnalyzeFaceResponse {
    data: {
        analysis: {
            faceDetected: boolean;
            violations: string[];
            message: string;
            confidence: number;
        };
        eventLogged: boolean;
    };
}