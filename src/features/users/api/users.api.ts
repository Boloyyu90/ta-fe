// src/features/users/api/users.api.ts

/**
 * USERS API CLIENT
 *
 * ============================================================================
 * PHASE 2 FIX: Correct type parameter usage
 * ============================================================================
 *
 * apiClient methods return Promise<ApiResponse<T>>
 * We pass T (payload type), not ApiResponse<T>
 * Access payload via response.data
 *
 * Types imported from: @/features/users/types/users.types.ts (Phase 1)
 *
 * Backend endpoints:
 * - Participant: /api/v1/me
 * - Admin: /api/v1/admin/users/*
 */

import { apiClient } from '@/shared/lib/api';
import type {
    // Query params
    UsersQueryParams,
    // Request types
    CreateUserRequest,
    UpdateUserRequest,
    UpdateProfileRequest,
    // Response types (Phase 1 aligned)
    UsersListResponse,
    UserDetailResponse,
    CreateUserResponse,
    UpdateUserResponse,
    DeleteUserResponse,
    ProfileResponse,
    UpdateProfileResponse,
    UserStatsResponse,
} from '../types/users.types';

// ============================================================================
// PARTICIPANT ENDPOINTS
// ============================================================================

/**
 * Get current user profile
 * GET /api/v1/me
 *
 * @returns ProfileResponse = { user: User }
 */
export const getProfile = async (): Promise<ProfileResponse> => {
    const response = await apiClient.get<ProfileResponse>('/me');
    return response.data;
};

/**
 * Update current user profile
 * PATCH /api/v1/me
 *
 * @returns UpdateProfileResponse = { user: User }
 */
export const updateProfile = async (
    data: UpdateProfileRequest
): Promise<UpdateProfileResponse> => {
    const response = await apiClient.patch<UpdateProfileResponse>('/me', data);
    return response.data;
};

/**
 * Get current user's dashboard statistics
 * GET /api/v1/me/stats
 *
 * Returns aggregated statistics:
 * - completedExams: Count of FINISHED exams
 * - averageScore: Average score (null if no completed exams)
 * - totalTimeMinutes: Total time spent on finished exams
 * - activeExams: Count of IN_PROGRESS exams
 *
 * @returns UserStatsResponse = { stats: UserStats }
 */
export const getMyStats = async (): Promise<UserStatsResponse> => {
    const response = await apiClient.get<UserStatsResponse>('/me/stats');
    return response.data;
};

// ============================================================================
// ADMIN ENDPOINTS
// ============================================================================

/**
 * Create user (admin only)
 * POST /api/v1/admin/users
 *
 * @returns CreateUserResponse = { user: User }
 */
export const createUser = async (data: CreateUserRequest): Promise<CreateUserResponse> => {
    const response = await apiClient.post<CreateUserResponse>('/admin/users', data);
    return response.data;
};

/**
 * Get all users (admin only)
 * GET /api/v1/admin/users
 *
 * @returns UsersListResponse = { data: User[], pagination: PaginationMeta }
 */
export const getUsers = async (params: UsersQueryParams = {}): Promise<UsersListResponse> => {
    const { page = 1, limit = 10, role, search, sortBy, sortOrder } = params;

    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    if (role) queryParams.append('role', role);
    if (search) queryParams.append('search', search);
    if (sortBy) queryParams.append('sortBy', sortBy);
    if (sortOrder) queryParams.append('sortOrder', sortOrder);

    const response = await apiClient.get<UsersListResponse>(
        `/admin/users?${queryParams.toString()}`
    );
    return response.data;
};

/**
 * Get user by ID (admin only)
 * GET /api/v1/admin/users/:id
 *
 * @returns UserDetailResponse = { user: UserWithCounts }
 */
export const getUser = async (userId: number): Promise<UserDetailResponse> => {
    const response = await apiClient.get<UserDetailResponse>(`/admin/users/${userId}`);
    return response.data;
};

/**
 * Update user (admin only)
 * PATCH /api/v1/admin/users/:id
 *
 * @returns UpdateUserResponse = { user: User }
 */
export const updateUser = async (
    userId: number,
    data: UpdateUserRequest
): Promise<UpdateUserResponse> => {
    const response = await apiClient.patch<UpdateUserResponse>(`/admin/users/${userId}`, data);
    return response.data;
};

/**
 * Delete user (admin only)
 * DELETE /api/v1/admin/users/:id
 *
 * @returns DeleteUserResponse = { success: boolean, message: string }
 */
export const deleteUser = async (userId: number): Promise<DeleteUserResponse> => {
    const response = await apiClient.delete<DeleteUserResponse>(`/admin/users/${userId}`);
    return response.data;
};

// ============================================================================
// NAMED EXPORT OBJECT
// ============================================================================

export const usersApi = {
    // Participant
    getProfile,
    updateProfile,
    getMyStats,
    // Admin
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
};