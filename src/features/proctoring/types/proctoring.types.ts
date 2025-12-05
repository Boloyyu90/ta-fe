// Webcam state
export type WebcamState = 'idle' | 'initializing' | 'active' | 'error';

// Violation severity
export type ViolationSeverity = 'LOW' | 'MEDIUM' | 'HIGH';

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
    timestamp: number;
    message: string;
}

// Pagination
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
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
        faceDetected: boolean;
        violations: string[];
        confidence: number;
    };
}