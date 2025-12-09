// src/features/users/types/users.types.ts

/**
 * USERS TYPES - BACKEND-ALIGNED
 *
 * ✅ REFACTORED: All types match backend Prisma schema EXACTLY
 *
 * KEY FIXES:
 * - Uses shared UserRole enum (removed local definition)
 * - Uses shared PaginatedResponse<T> (fixed pagination field names)
 * - All dates as ISO strings, not Date objects
 * - Matches backend User model structure
 *
 * Backend Source: backend/src/features/users/
 */

import type { UserRole } from '@/shared/types/enum.types';
import type { PaginatedResponse } from '@/shared/types/api.types';
import type { BaseEntity } from '@/shared/types/common.types';

// ============================================================================
// USER ENTITY (from Prisma User model)
// ============================================================================

/**
 * User entity from backend Prisma
 *
 * Backend Prisma fields: id, name, email, password, role, isEmailVerified, createdAt, updatedAt
 * Frontend sees: all except password
 */
export interface User extends BaseEntity {
    email: string;
    name: string;
    role: UserRole; // ✅ Uses shared enum
    isEmailVerified: boolean;
}

/**
 * User with aggregated counts (admin view)
 * Backend returns this from getUserById endpoint
 */
export interface UserWithCounts extends User {
    _count: {
        createdExams: number; // Number of exams created by this user (if admin)
        userExams: number; // Number of exam attempts by this user (if participant)
    };
}

// ============================================================================
// API REQUEST TYPES (what we send to backend)
// ============================================================================

/**
 * Create user request (admin only)
 * POST /admin/users
 */
export interface CreateUserRequest {
    email: string;
    password: string;
    name: string;
    role?: UserRole; // Optional, defaults to PARTICIPANT on backend
}

/**
 * Update user request (admin only)
 * PATCH /admin/users/:id
 */
export interface UpdateUserRequest {
    email?: string;
    password?: string;
    name?: string;
    role?: UserRole;
    isEmailVerified?: boolean;
}

/**
 * Update own profile request (participant)
 * PATCH /me
 */
export interface UpdateProfileRequest {
    name?: string;
    password?: string;
    // Note: Cannot change email or role via profile update
}

/**
 * Query params for getUsers (admin)
 * GET /admin/users?page=1&limit=10&role=ADMIN&search=john
 */
export interface UsersQueryParams {
    page?: number;
    limit?: number;
    role?: UserRole; // ✅ Uses shared enum
    search?: string;
    sortBy?: 'createdAt' | 'name' | 'email' | 'role';
    sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// API RESPONSE TYPES (what backend returns in 'data' field)
// ============================================================================

/**
 * GET /admin/users response
 * Returns: { success: true, data: { data: [...], pagination: {...} }, ... }
 *
 * ✅ FIXED: Uses PaginatedResponse with correct field names
 */
export type UsersListResponse = PaginatedResponse<User>;

/**
 * GET /admin/users/:id response
 * Returns: { success: true, data: { user: {...} }, ... }
 */
export interface UserDetailResponse {
    user: UserWithCounts;
}

/**
 * POST /admin/users response
 * Returns: { success: true, data: { user: {...} }, ... }
 */
export interface CreateUserResponse {
    user: User;
}

/**
 * PATCH /admin/users/:id response
 * Returns: { success: true, data: { user: {...} }, ... }
 */
export interface UpdateUserResponse {
    user: User;
}

/**
 * DELETE /admin/users/:id response
 * Returns: { success: true, data: { success: true }, ... }
 */
export interface DeleteUserResponse {
    success: boolean;
}

/**
 * GET /me response
 * Returns: { success: true, data: { user: {...} }, ... }
 */
export interface ProfileResponse {
    user: User;
}

/**
 * PATCH /me response
 * Returns: { success: true, data: { user: {...} }, ... }
 */
export interface UpdateProfileResponse {
    user: User;
}