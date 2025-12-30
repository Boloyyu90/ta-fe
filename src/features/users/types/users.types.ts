// src/features/users/types/users.types.ts

/**
 * Users Types
 *
 * Source: backend-api-contract.md + backend users.validation.ts
 */

import type { UserRole } from '@/shared/types/enum.types';
import type { PaginationMeta } from '@/shared/types/api.types';

// Re-export for convenience
export type { UserRole };

// ============================================================================
// USER ENTITY
// ============================================================================

/**
 * User entity (matches backend Prisma User model)
 */
export interface User {
    id: number;
    email: string;
    name: string;
    role: UserRole;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * User with counts (for admin detail view)
 */
export interface UserWithCounts extends User {
    _count: {
        createdExams: number;
        userExams: number;
    };
}

// ============================================================================
// API REQUEST TYPES
// ============================================================================

/**
 * Request to create user (admin)
 */
export interface CreateUserRequest {
    email: string;
    password: string;
    name: string;
    role?: UserRole;
}

/**
 * Request to update user (admin)
 */
export interface UpdateUserRequest {
    email?: string;
    password?: string;
    name?: string;
    role?: UserRole;
    isEmailVerified?: boolean;
}

/**
 * Request to update own profile
 */
export interface UpdateProfileRequest {
    name?: string;
    password?: string;
}

/**
 * Query params for GET /admin/users
 */
export interface UsersQueryParams {
    page?: number;
    limit?: number;
    role?: UserRole;
    search?: string;
    sortBy?: 'createdAt' | 'name' | 'email' | 'role';
    sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * GET /admin/users
 * ✅ Uses correct PaginationMeta
 */
export interface UsersListResponse {
    data: User[];
    pagination: PaginationMeta;
}

/**
 * GET /admin/users/:id
 */
export interface UserDetailResponse {
    user: UserWithCounts;
}

/**
 * POST /admin/users
 */
export interface CreateUserResponse {
    user: User;
}

/**
 * PATCH /admin/users/:id
 */
export interface UpdateUserResponse {
    user: User;
}

/**
 * DELETE /admin/users/:id
 * Backend returns: { success: true, message: string }
 */
export interface DeleteUserResponse {
    success: boolean;
    message: string;
}

/**
 * GET /me
 */
export interface ProfileResponse {
    user: User;
}

/**
 * PATCH /me
 */
export interface UpdateProfileResponse {
    user: User;
}

// ============================================================================
// USER STATS TYPES
// ============================================================================

/**
 * User dashboard statistics
 * Backend: GET /api/v1/me/stats
 *
 * Business Rules:
 * - completedExams: Count of exams with status=FINISHED
 * - averageScore: AVG(totalScore) of FINISHED exams, null if none completed
 * - totalTimeMinutes: SUM of (submittedAt - startedAt) in minutes
 * - activeExams: Count of exams with status=IN_PROGRESS
 */
export interface UserStats {
    completedExams: number;
    averageScore: number | null;
    totalTimeMinutes: number;
    activeExams: number;
}

/**
 * GET /me/stats
 */
export interface UserStatsResponse {
    stats: UserStats;
}