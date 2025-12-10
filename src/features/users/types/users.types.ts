// src/features/users/types/users.types.ts

/**
 * User Types
 *
 * ✅ AUDIT FIX v2:
 * - Uses shared PaginationMeta
 * - Matches backend response structure exactly
 *
 * Backend endpoints:
 * - Participant: /api/v1/me
 * - Admin: /api/v1/admin/users/*
 */

import type { PaginationMeta } from '@/shared/types/api.types';

// ============================================================================
// ENUMS
// ============================================================================

export type UserRole = 'ADMIN' | 'PARTICIPANT';

// ============================================================================
// BASE ENTITIES
// ============================================================================

/**
 * User entity - matches backend public fields
 */
export interface User {
    id: number;
    email: string;
    name: string;
    role: UserRole;
    isEmailVerified: boolean;
    createdAt: string; // ISO datetime
    updatedAt: string; // ISO datetime
}

/**
 * User with counts (for admin views)
 */
export interface UserWithCounts extends User {
    _count: {
        createdExams: number; // Exams created by this user (admin)
        userExams: number; // Exam attempts by this user
    };
}

// ============================================================================
// API REQUEST TYPES
// ============================================================================

export interface CreateUserRequest {
    email: string;
    password: string;
    name: string;
    role?: UserRole;
}

export interface UpdateUserRequest {
    email?: string;
    password?: string;
    name?: string;
    role?: UserRole;
    isEmailVerified?: boolean;
}

export interface UpdateProfileRequest {
    name?: string;
    password?: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * GET /admin/users response
 */
export interface UsersListResponse {
    data: User[];
    pagination: PaginationMeta;
}

/**
 * GET /admin/users/:id response
 */
export interface UserDetailResponse {
    user: UserWithCounts;
}

/**
 * POST /admin/users response
 */
export interface CreateUserResponse {
    user: User;
}

/**
 * PATCH /admin/users/:id response
 */
export interface UpdateUserResponse {
    user: User;
}

/**
 * DELETE /admin/users/:id response
 */
export interface DeleteUserResponse {
    success: boolean;
    message?: string;
}

/**
 * GET /me response
 */
export interface ProfileResponse {
    user: User;
}

/**
 * PATCH /me response
 */
export interface UpdateProfileResponse {
    user: User;
}

// ============================================================================
// QUERY PARAMS TYPES
// ============================================================================

export interface UsersQueryParams {
    page?: number;
    limit?: number;
    role?: UserRole;
    search?: string;
    sortBy?: 'createdAt' | 'name' | 'email' | 'role';
    sortOrder?: 'asc' | 'desc';
}