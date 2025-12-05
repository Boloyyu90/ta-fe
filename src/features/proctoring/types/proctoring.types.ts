// src/features/proctoring/types/proctoring.types.ts

import type { PaginationMeta } from '@/shared/types/api.types';

// ============================================================================
// PROCTORING REQUEST TYPES
// ============================================================================

export interface AnalyzeFaceRequest {
    imageBase64: string; // ✅ Correct property name
}

// ============================================================================
// PROCTORING RESPONSE TYPES
// ============================================================================

export interface AnalyzeFaceResponse {
    analysis: {
        status: string;
        violations: string[];
        confidence: number;
        message: string;
        metadata?: any;
    };
    eventLogged: boolean;
    eventType: string | null;
    usedFallback?: boolean;
}

// ============================================================================
// VIOLATION TYPES
// ============================================================================

export interface Violation {
    type: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    timestamp: string;
    message: string; // ✅ Added message property
}

// ============================================================================
// PROCTORING EVENTS TYPES
// ============================================================================

export interface ProctoringEvent {
    id: number;
    userExamId: number;
    eventType: 'FACE_DETECTED' | 'NO_FACE_DETECTED' | 'MULTIPLE_FACES' | 'LOOKING_AWAY';
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    metadata: Record<string, any> | null;
    timestamp: string;
}

export interface ProctoringEventsResponse {
    data: ProctoringEvent[];
    pagination: PaginationMeta;
}

export interface ProctoringEventsParams {
    page?: number;
    limit?: number;
    eventType?: string;
    severity?: string;
}