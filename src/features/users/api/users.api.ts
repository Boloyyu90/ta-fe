// src/features/users/api/users.api.ts
import { apiClient } from '@/shared/lib/api';
import type {
    UsersListResponse,
    UserDetailResponse,
    CreateUserRequest,
    CreateUserResponse,
    UpdateUserRequest,
    UpdateUserResponse,
    DeleteUserResponse,
    ProfileResponse,
    UpdateProfileRequest,
    UpdateProfileResponse,
    UsersQueryParams,
} from '../types/users.types';

/**
 * Users API Client
 * Implements all 7 user-related endpoints from backend
 *
 * NOTE: apiClient.get() returns the unwrapped response body via interceptor
 * Backend response: { success: true, data: {...}, message: string, timestamp: string }
 * Interceptor unwraps to: { success: true, data: {...}, message: string, timestamp: string }
 * We access .data to get the actual payload
 */
export const usersApi = {
    // ============================================================================
    // PARTICIPANT ENDPOINTS (2)
    // ============================================================================

    /**
     * Get my profile
     * GET /me
     */
    async getProfile(): Promise<ProfileResponse> {
        const response = await apiClient.get<{ success: boolean; data: ProfileResponse }>('/me');
        return response.data;
    },

    /**
     * Update my profile
     * PATCH /me
     */
    async updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
        const response = await apiClient.patch<{ success: boolean; data: UpdateProfileResponse }>('/me', data);
        return response.data;
    },

    // ============================================================================
    // ADMIN ENDPOINTS (5)
    // ============================================================================

    /**
     * Create user (admin only)
     * POST /admin/users
     */
    async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
        const response = await apiClient.post<{ success: boolean; data: CreateUserResponse }>('/admin/users', data);
        return response.data;
    },

    /**
     * Get all users (admin only)
     * GET /admin/users
     */
    async getUsers(params?: UsersQueryParams): Promise<UsersListResponse> {
        const response = await apiClient.get<{ success: boolean; data: UsersListResponse }>('/admin/users', { params });
        return response.data;
    },

    /**
     * Get user by ID (admin only)
     * GET /admin/users/:id
     */
    async getUser(userId: number): Promise<UserDetailResponse> {
        const response = await apiClient.get<{ success: boolean; data: UserDetailResponse }>(`/admin/users/${userId}`);
        return response.data;
    },

    /**
     * Update user (admin only)
     * PATCH /admin/users/:id
     */
    async updateUser(userId: number, data: UpdateUserRequest): Promise<UpdateUserResponse> {
        const response = await apiClient.patch<{ success: boolean; data: UpdateUserResponse }>(
            `/admin/users/${userId}`,
            data
        );
        return response.data;
    },

    /**
     * Delete user (admin only)
     * DELETE /admin/users/:id
     */
    async deleteUser(userId: number): Promise<DeleteUserResponse> {
        const response = await apiClient.delete<{ success: boolean; data: DeleteUserResponse }>(
            `/admin/users/${userId}`
        );
        return response.data;
    },
};