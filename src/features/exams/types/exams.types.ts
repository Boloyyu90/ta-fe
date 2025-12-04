// src/features/exams/types/exams.types.ts

// ============================================================================
// EXISTING TYPES
// ============================================================================
export interface Exam {
    id: number;
    title: string;
    description: string | null;
    durationMinutes: number;
    startTime: string | null;
    endTime: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    _count?: {
        examQuestions: number;
    };
}

export interface ExamsResponse {
    exams: Exam[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

export interface ExamsQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
}

// ============================================================================
// NEW TYPES FOR PART 3
// ============================================================================

// For Exam Detail Page
export interface ExamDetail {
    id: number;
    title: string;
    description: string | null;
    durationMinutes: number;
    startTime: string | null;
    endTime: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    _count: {
        examQuestions: number;
    };
}

export interface ExamDetailResponse {
    exam: ExamDetail;
}

// For Start Exam Response
export interface StartExamResponse {
    message: string;
    userExam: {
        id: number;
        userId: number;
        examId: number;
        status: 'IN_PROGRESS';
        startedAt: string;
        completedAt: null;
        totalScore: null;
        totalQuestions: number;
        correctAnswers: null;
        createdAt: string;
        updatedAt: string;
    };
}