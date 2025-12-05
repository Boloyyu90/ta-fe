// src/features/questions/api/questions.api.ts
import { apiClient } from '@/shared/lib/api';
import type {
    QuestionsListResponse,
    QuestionDetailResponse,
    CreateQuestionRequest,
    UpdateQuestionRequest,
    QuestionsQueryParams,
} from '../types/questions.types';

export const questionsApi = {
    // Get list of questions with pagination and filters
    getQuestions: async (params: QuestionsQueryParams = {}) => {
        const { page = 1, limit = 10, type, search, sortBy = 'createdAt', sortOrder = 'desc' } = params;

        const queryParams = new URLSearchParams({
            page: String(page),
            limit: String(limit),
            sortBy,
            sortOrder,
        });

        if (type) queryParams.append('type', type);
        if (search) queryParams.append('search', search);

        const response = await apiClient.get<QuestionsListResponse>(
            `/admin/questions?${queryParams.toString()}`
        );
        return response.data;
    },

    // Get single question detail
    getQuestion: async (id: string) => {
        const response = await apiClient.get<QuestionDetailResponse>(`/admin/questions/${id}`);
        return response.data;
    },

    // Create new question
    createQuestion: async (data: CreateQuestionRequest) => {
        const response = await apiClient.post<QuestionDetailResponse>('/admin/questions', data);
        return response.data;
    },

    // Update existing question
    updateQuestion: async (id: string, data: UpdateQuestionRequest) => {
        const response = await apiClient.patch<QuestionDetailResponse>(`/admin/questions/${id}`, data);
        return response.data;
    },

    // Delete question
    deleteQuestion: async (id: string) => {
        const response = await apiClient.delete(`/admin/questions/${id}`);
        return response.data;
    },
};