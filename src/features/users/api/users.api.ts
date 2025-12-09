// src/features/users/api/users.api.ts

/**
 * USERS API CLIENT - BACKEND-ALIGNED
 *
 * ✅ UPDATED: All types match new users.types.ts
 * ✅ Proper ApiResponse unwrapping
 * ✅ Correct return types for all endpoints
 */

import { apiClient } from '@/shared/lib/api';
import type { ApiResponse } from '@/shared/types/api.types';
import type {
    UsersListResponse,
    UserDetailResponse,
    CreateUserRequest,
    CreateUserResponse,
    UpdateUserRequest,
    UpdateProfileRequest,
    UpdateUserResponse,
    UpdateProfileResponse,
    ProfileResponse,
    DeleteUserResponse,
    UsersQueryParams,
} from '../types/users.types';

export const usersApi = {
    // ============================================================================
    // PARTICIPANT ENDPOINTS
    // ============================================================================

    /**
     * Get my profile
     * GET /me
     *
     * Returns: ApiResponse<{ user: User }>
     * After unwrap: { user: User }
     */
    getProfile: async (): Promise<ProfileResponse> => {
        const response = await apiClient.get<ApiResponse<ProfileResponse>>('/me');
        return response.data; // Unwrap: { user: {...} }
    },

    /**
     * Update my profile
     * PATCH /me
     *
     * Returns: ApiResponse<{ user: User }>
     * After unwrap: { user: User }
     */
    updateProfile: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
        const response = await apiClient.patch<ApiResponse<UpdateProfileResponse>>('/me', data);
        return response.data; // Unwrap: { user: {...} }
    },

    // ============================================================================
    // ADMIN ENDPOINTS
    // ============================================================================

    /**
     * Create user (admin only)
     * POST /admin/users
     *
     * Returns: ApiResponse<{ user: User }>
     * After unwrap: { user: User }
     */
    createUser: async (data: CreateUserRequest): Promise<CreateUserResponse> => {
        const response = await apiClient.post<ApiResponse<CreateUserResponse>>(
            '/admin/users',
            data
        );
        return response.data; // Unwrap: { user: {...} }
    },

    /**
     * Get all users (admin only)
     * GET /admin/users?page=1&limit=10&role=ADMIN&search=john
     *
     * Returns: ApiResponse<{ data: User[], pagination: PaginationMeta }>
     * After unwrap: { data: User[], pagination: {...} }
     */
    getUsers: async (params?: UsersQueryParams): Promise<UsersListResponse> => {
        const response = await apiClient.get<ApiResponse<UsersListResponse>>(
            '/admin/users',
            { params }
        );
        return response.data; // Unwrap: { data: [...], pagination: {...} }
    },

    /**
     * Get user by ID (admin only)
     * GET /admin/users/:id
     *
     * Returns: ApiResponse<{ user: UserWithCounts }>
     * After unwrap: { user: UserWithCounts }
     */
    getUser: async (userId: number): Promise<UserDetailResponse> => {
        const response = await apiClient.get<ApiResponse<UserDetailResponse>>(
            `/admin/users/${userId}`
        );
        return response.data; // Unwrap: { user: {...} }
    },

    /**
     * Update user (admin only)
     * PATCH /admin/users/:id
     *
     * Returns: ApiResponse<{ user: User }>
     * After unwrap: { user: User }
     */
    updateUser: async (
        userId: number,
        data: UpdateUserRequest
    ): Promise<UpdateUserResponse> => {
        const response = await apiClient.patch<ApiResponse<UpdateUserResponse>>(
            `/admin/users/${userId}`,
            data
        );
        return response.data; // Unwrap: { user: {...} }
    },

    /**
     * Delete user (admin only)
     * DELETE /admin/users/:id
     *
     * Returns: ApiResponse<{ success: boolean }>
     * After unwrap: { success: true }
     */
    deleteUser: async (userId: number): Promise<DeleteUserResponse> => {
        const response = await apiClient.delete<ApiResponse<DeleteUserResponse>>(
            `/admin/users/${userId}`
        );
        return response.data; // Unwrap: { success: true }
    },
};