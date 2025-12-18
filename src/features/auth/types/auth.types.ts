// src/features/auth/types/auth.types.ts

/**
 * AUTH TYPES - REFACTORED TO ALIGN WITH BACKEND
 *
 * ✅ Uses shared enum types
 * ✅ Matches backend response structure exactly
 * ✅ Clear separation of request/response types
 * ✅ Properly typed with ApiResponse wrapper
 */

import type { UserRole } from '@/shared/types/enum.types';
import type { ApiResponse } from '@/shared/types/api.types';

// ============================================================================
// BASE USER ENTITY (matches backend User model)
// ============================================================================

/**
 * User entity
 * Matches backend Prisma User model (public fields only)
 */
export interface User {
    id: number;
    email: string;
    name: string;
    role: UserRole;
    isEmailVerified: boolean;
    createdAt: string; // ISO datetime string from backend
    updatedAt: string; // ISO datetime string from backend
}

// ============================================================================
// AUTHENTICATION TOKENS
// ============================================================================

/**
 * Authentication tokens pair
 * Returned by login, register, and refresh endpoints
 */
export interface TokensData {
    accessToken: string;
    refreshToken: string;
}

// ============================================================================
// REQUEST TYPES (what we send to backend)
// ============================================================================

/**
 * Login request credentials
 * POST /api/v1/auth/login
 */
export interface LoginRequest {
    email: string;
    password: string;
}

/**
 * Register request credentials
 * POST /api/v1/auth/register
 */
export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role?: UserRole; // Optional, defaults to PARTICIPANT on backend
}

/**
 * Refresh token request
 * POST /api/v1/auth/refresh
 */
export interface RefreshTokenRequest {
    refreshToken: string;
}

/**
 * Logout request
 * POST /api/v1/auth/logout
 */
export interface LogoutRequest {
    refreshToken: string;
}

// ============================================================================
// RESPONSE PAYLOAD TYPES (the 'data' field content)
// ============================================================================

/**
 * Auth response payload (login/register)
 * This is what's inside the 'data' field
 */
export interface AuthPayload {
    user: User;
    tokens: TokensData;
}

/**
 * Refresh token response payload
 * This is what's inside the 'data' field
 */
export interface RefreshTokenPayload {
    tokens: TokensData;
}

/**
 * Current user response payload (GET /me)
 * This is what's inside the 'data' field
 */
export interface MePayload {
    user: User;
}

/**
 * Logout response payload
 * This is what's inside the 'data' field
 */
export interface LogoutPayload {
    success: boolean;
}

// ============================================================================
// COMPLETE API RESPONSE TYPES (what backend actually returns)
// ============================================================================

/**
 * Complete login/register response
 * POST /api/v1/auth/login
 * POST /api/v1/auth/register
 *
 * Backend returns:
 * {
 *   success: true,
 *   message: "Login successful",
 *   data: { user: {...}, tokens: {...} },
 *   timestamp: "2025-..."
 * }
 */
export type AuthResponse = ApiResponse<AuthPayload>;

/**
 * Complete refresh token response
 * POST /api/v1/auth/refresh
 *
 * Backend returns:
 * {
 *   success: true,
 *   message: "Token refreshed successfully",
 *   data: { tokens: {...} },
 *   timestamp: "2025-..."
 * }
 */
export type RefreshTokenResponse = ApiResponse<RefreshTokenPayload>;

/**
 * Complete get current user response
 * GET /api/v1/me
 *
 * Backend returns:
 * {
 *   success: true,
 *   message: "Profile retrieved successfully",
 *   data: { user: {...} },
 *   timestamp: "2025-..."
 * }
 */
export type MeResponse = ApiResponse<MePayload>;

/**
 * Complete logout response
 * POST /api/v1/auth/logout
 *
 * Backend returns:
 * {
 *   success: true,
 *   message: "Logout successful",
 *   data: { success: true },
 *   timestamp: "2025-..."
 * }
 */
export type LogoutResponse = ApiResponse<LogoutPayload>;

// ============================================================================
// ZUSTAND STORE TYPES
// ============================================================================

/**
 * Auth state stored in Zustand
 */
export interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

/**
 * Auth store actions
 */
export interface AuthActions {
    setAuth: (user: User, tokens: TokensData, rememberMe?: boolean) => void;
    updateUser: (user: Partial<User>) => void;
    clearAuth: () => void;
    setLoading: (loading: boolean) => void;
}

/**
 * Complete auth store type
 */
export type AuthStore = AuthState & AuthActions;

