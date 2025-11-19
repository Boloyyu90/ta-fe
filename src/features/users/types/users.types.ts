// src/features/users/types/users.types.ts

// ============================================================================
// ENUMS (from backend)
// ============================================================================

export type UserRole = 'ADMIN' | 'PARTICIPANT';

// ============================================================================
// BASE ENTITIES
// ============================================================================

export interface User {
    id: number;
    email: string;
    name: string;
    role: UserRole;
    isEmailVerified: boolean;
    createdAt: string; // ISO datetime
    updatedAt: string; // ISO datetime
}

export interface UserWithCounts extends User {
    _count: {
        createdExams: number; // Number of exams created by this user
        userExams: number; // Number of exam attempts by this user
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

export interface UsersListResponse {
    data: User[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface UserDetailResponse {
    user: UserWithCounts;
}

export interface CreateUserResponse {
    user: User;
}

export interface UpdateUserResponse {
    user: User;
}

export interface DeleteUserResponse {
    success: boolean;
}

export interface ProfileResponse {
    user: User;
}

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