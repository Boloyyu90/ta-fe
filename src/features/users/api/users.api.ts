// src/features/users/api/users.api.ts

/**
 * Users API Client
 *
 * ✅ AUDIT FIX v3:
 * - Fixed response unwrapping: use `response.data` (interceptor already unwraps AxiosResponse)
 *
 * Backend endpoints:
 * - Participant: /api/v1/me
 * - Admin: /api/v1/admin/users/*
 */

import { apiClient } from '@/shared/lib/api';
import type { ApiResponse } from '@/shared/types/api.types';
import type {
    UsersQueryParams,
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
} from '../types/users.types';

// ============================================================================
// PARTICIPANT ENDPOINTS
// ============================================================================

/**
 * Get current user profile
 * GET /api/v1/me
 */
export const getProfile = async (): Promise<ProfileResponse> => {
    const response = await apiClient.get<ApiResponse<ProfileResponse>>('/me');
    // response is ApiResponse<ProfileResponse> (interceptor unwraps AxiosResponse)
    // response.data is ProfileResponse
    return response.data;
};

/**
 * Update current user profile
 * PATCH /api/v1/me
 */
export const updateProfile = async (
    data: UpdateProfileRequest
): Promise<UpdateProfileResponse> => {
    const response = await apiClient.patch<ApiResponse<UpdateProfileResponse>>('/me', data);
    return response.data;
};

// ============================================================================
// ADMIN ENDPOINTS
// ============================================================================

/**
 * Create user (admin only)
 * POST /api/v1/admin/users
 */
export const createUser = async (
    data: CreateUserRequest
): Promise<CreateUserResponse> => {
    const response = await apiClient.post<ApiResponse<CreateUserResponse>>(
        '/admin/users',
        data
    );
    return response.data;
};

/**
 * Get all users (admin only)
 * GET /api/v1/admin/users
 */
export const getUsers = async (
    params: UsersQueryParams = {}
): Promise<UsersListResponse> => {
    const { page = 1, limit = 10, role, search, sortBy, sortOrder } = params;

    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    if (role) queryParams.append('role', role);
    if (search) queryParams.append('search', search);
    if (sortBy) queryParams.append('sortBy', sortBy);
    if (sortOrder) queryParams.append('sortOrder', sortOrder);

    const response = await apiClient.get<ApiResponse<UsersListResponse>>(
        `/admin/users?${queryParams.toString()}`
    );
    return response.data;
};

/**
 * Get user by ID (admin only)
 * GET /api/v1/admin/users/:id
 */
export const getUser = async (userId: number): Promise<UserDetailResponse> => {
    const response = await apiClient.get<ApiResponse<UserDetailResponse>>(
        `/admin/users/${userId}`
    );
    return response.data;
};

/**
 * Update user (admin only)
 * PATCH /api/v1/admin/users/:id
 */
export const updateUser = async (
    userId: number,
    data: UpdateUserRequest
): Promise<UpdateUserResponse> => {
    const response = await apiClient.patch<ApiResponse<UpdateUserResponse>>(
        `/admin/users/${userId}`,
        data
    );
    return response.data;
};

/**
 * Delete user (admin only)
 * DELETE /api/v1/admin/users/:id
 */
export const deleteUser = async (userId: number): Promise<DeleteUserResponse> => {
    const response = await apiClient.delete<ApiResponse<DeleteUserResponse>>(
        `/admin/users/${userId}`
    );
    return response.data;
};

// ============================================================================
// NAMED EXPORT OBJECT
// ============================================================================

export const usersApi = {
    // Participant
    getProfile,
    updateProfile,
    // Admin
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
};