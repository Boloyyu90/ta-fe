// Exam entity matching backend Prisma schema
export interface Exam {
    id: number;
    title: string;
    description: string | null;
    durationMinutes: number;
    passingScore: number;
    instructions: string | null;
    isPublished: boolean;
    startTime: string | null;
    endTime: string | null;
    createdAt: string;
    updatedAt: string;
    _count?: {
        examQuestions: number;
        userExams: number;
    };
}

// Pagination metadata matching backend response
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// API response structure with wrapper
export interface ExamsResponse {
    data: Exam[];
    pagination: PaginationMeta;
}

export interface ExamDetailResponse {
    data: Exam;
}

// Form data for creating/updating exams
export interface CreateExamRequest {
    title: string;
    description?: string;
    durationMinutes: number;
    passingScore: number;
    instructions?: string;
    isPublished?: boolean;
    startTime?: string;
    endTime?: string;
}

export interface UpdateExamRequest extends Partial<CreateExamRequest> {}