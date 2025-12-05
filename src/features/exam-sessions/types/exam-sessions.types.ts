// src/features/exam-sessions/types/exam-sessions.types.ts

/**
 * EXAM SESSIONS TYPES
 * ✅ Fixed to match backend response structure exactly
 */

import type { PaginationMeta } from '@/shared/types/api.types';

// ============================================================================
// QUESTION TYPES
// ============================================================================

export interface Question {
    id: number;
    content: string;
    options: {
        A: string;
        B: string;
        C: string;
        D: string;
        E: string;
    };
    correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
    questionType: 'TIU' | 'TWK' | 'TKP';
    defaultScore: number;
    imageUrl?: string | null;
}

export interface ExamQuestion {
    id: number;
    examQuestionId: number;
    orderNumber: number;
    question: Question; // ✅ Nested question object
}

// ============================================================================
// EXAM SESSION TYPES
// ============================================================================

export interface UserExam {
    id: number;
    examId: number;
    userId: number;
    startedAt: string | null;
    submittedAt: string | null;
    totalScore: number | null;
    status: 'IN_PROGRESS' | 'FINISHED' | 'TIMEOUT' | 'CANCELLED';
    exam: {
        id: number;
        title: string;
        description: string | null;
        durationMinutes: number;
        _count?: {
            examQuestions: number;
        };
    };
    user?: {
        id: number;
        name: string;
        email: string;
    };
    _count?: {
        answers: number;
    };
}

export interface ExamSessionDetailResponse {
    userExam: UserExam;
}

export interface ExamQuestionsResponse {
    questions: ExamQuestion[]; // ✅ Array of exam questions
    total: number;
}

// ============================================================================
// ANSWER SUBMISSION TYPES
// ============================================================================

export interface SubmitAnswerRequest {
    questionId: number;
    selectedOption: 'A' | 'B' | 'C' | 'D' | 'E';
}

export interface SubmitAnswerResponse {
    answer: {
        id: number;
        userExamId: number;
        questionId: number;
        selectedOption: string;
        isCorrect: boolean | null;
    };
}

export interface SubmitExamResponse {
    result: {
        totalScore: number;
        correctAnswers: number;
        totalQuestions: number;
        status: string;
    };
}

// ============================================================================
// RESULTS TYPES
// ============================================================================

export interface ExamResult {
    id: number;
    exam: {
        id: number;
        title: string;
        description: string | null;
    };
    user: {
        id: number;
        name: string;
        email: string;
    };
    startedAt: string;
    submittedAt: string | null;
    totalScore: number | null;
    status: 'IN_PROGRESS' | 'FINISHED' | 'TIMEOUT' | 'CANCELLED';
    duration: number | null;
    answeredQuestions: number;
    totalQuestions: number;
    correctAnswers?: number;
}

export interface MyResultsResponse {
    data: ExamResult[]; // ✅ Array of results
    pagination: PaginationMeta;
}

export interface MyResultsParams {
    page?: number;
    limit?: number;
    status?: string;
}

// ============================================================================
// EXAM ANSWERS (FOR REVIEW)
// ============================================================================

export interface ExamAnswer {
    id: number;
    questionId: number;
    selectedOption: string | null;
    isCorrect: boolean | null;
    score: number | null;
    question: Question;
}

export interface ExamAnswersResponse {
    answers: ExamAnswer[];
    total: number;
}

// ============================================================================
// SESSION QUERY PARAMS
// ============================================================================

export interface UserExamsParams {
    page?: number;
    limit?: number;
    status?: string;
}