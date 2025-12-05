// src/features/exams/types/exams.types.ts

import type { UserExam } from '@/features/exam-sessions/types/exam-sessions.types';

// Exam entity
export interface Exam {
    id: number;
    title: string;
    description: string | null;
    durationMinutes: number;
    passingScore: number;
    isActive: boolean; // ✅ Added
    startTime: string | null;
    endTime: string | null;
    createdAt: string;
    updatedAt: string;
    _count?: {
        examQuestions: number;
        userExams: number;
    };
}

// Pagination
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// Query params
export interface ExamsQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'active' | 'inactive' | 'all';
    sortBy?: 'title' | 'createdAt' | 'durationMinutes';
    sortOrder?: 'asc' | 'desc';
}

// API Responses
export interface ExamsResponse {
    data: Exam[];
    pagination: PaginationMeta;
}

export interface ExamDetailResponse {
    data: Exam;
}

export interface StartExamResponse {
    data: {
        userExam: UserExam;
    };
}