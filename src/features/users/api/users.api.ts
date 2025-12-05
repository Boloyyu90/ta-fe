// src/features/users/api/users.api.ts
import { apiClient } from '@/shared/lib/api';
import type { ApiResponse } from '@/shared/types/api.types';
import type {
    UsersListResponse,
    UserDetailResponse,
    CreateUserRequest,
    CreateUserResponse,
    UpdateUserRequest,
    UpdateProfileRequest,
    UsersQueryParams,
} from '../types/users.types';

export const usersApi = {
    // ============================================================================
    // PARTICIPANT ENDPOINTS
    // ============================================================================

    /**
     * Get my profile
     * GET /me
     */
    getProfile: async () => {
        const response = await apiClient.get<ApiResponse<{ user: any }>>('/me');
        return response.data; // Returns { user: {...} }
    },

    /**
     * Update my profile
     * PATCH /me
     */
    updateProfile: async (data: UpdateProfileRequest) => {
        const response = await apiClient.patch<ApiResponse<{ user: any }>>('/me', data);
        return response.data; // Returns { user: {...} }
    },

    // ============================================================================
    // ADMIN ENDPOINTS
    // ============================================================================

    /**
     * Create user (admin only)
     * POST /admin/users
     */
    createUser: async (data: CreateUserRequest) => {
        const response = await apiClient.post<ApiResponse<{ user: any }>>('/admin/users', data);
        return response.data;
    },

    /**
     * Get all users (admin only)
     * GET /admin/users
     */
    getUsers: async (params?: UsersQueryParams) => {
        const response = await apiClient.get<ApiResponse<UsersListResponse>>('/admin/users', { params });
        return response.data;
    },

    /**
     * Get user by ID (admin only)
     * GET /admin/users/:id
     */
    getUser: async (userId: number) => {
        const response = await apiClient.get<ApiResponse<UserDetailResponse>>(`/admin/users/${userId}`);
        return response.data;
    },

    /**
     * Update user (admin only)
     * PATCH /admin/users/:id
     */
    updateUser: async (userId: number, data: UpdateUserRequest) => {
        const response = await apiClient.patch<ApiResponse<{ user: any }>>(
            `/admin/users/${userId}`,
            data
        );
        return response.data;
    },

    /**
     * Delete user (admin only)
     * DELETE /admin/users/:id
     */
    deleteUser: async (userId: number) => {
        const response = await apiClient.delete<ApiResponse<{ success: boolean }>>(`/admin/users/${userId}`);
        return response.data;
    },
};