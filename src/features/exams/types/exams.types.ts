// src/features/exams/types/exams.types.ts

import type { PaginationMeta } from '@/shared/types/api.types';

// ============================================================================
// EXAM TYPES
// ============================================================================

export interface Exam {
    id: number;
    title: string;
    description: string | null;
    durationMinutes: number;
    isActive: boolean;
    createdBy: number;
    createdAt: string;
    updatedAt: string;
    _count?: {
        examQuestions: number;
        userExams: number;
    };
}

export interface ExamsResponse {
    data: Exam[]; // ✅ Array of exams
    pagination: PaginationMeta;
}

export interface ExamDetailResponse {
    exam: Exam;
}

export interface ExamsQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
}

// ============================================================================
// START EXAM TYPES
// ============================================================================

export interface StartExamResponse {
    userExam: {
        id: number;
        examId: number;
        userId: number;
        status: string;
        startedAt: string;
        createdAt: string;
    };
}