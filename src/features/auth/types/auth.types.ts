/**
 * AUTH TYPES - MODERN BEST PRACTICE
 *
 * ✅ Single source of truth for each response type
 * ✅ Types match backend responses exactly
 * ✅ No duplicate wrapped/unwrapped types needed
 * ✅ Generic types in API client handle the rest
 */

export type UserRole = "PARTICIPANT" | "ADMIN";

export interface User {
    id: number;
    email: string;
    name: string;
    role: UserRole;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface TokensData {
    accessToken: string;
    refreshToken: string;
}

// ============================================
// CREDENTIALS (Request types)
// ============================================

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
}

// ============================================
// API RESPONSES (What backend returns after interceptor unwraps)
// ============================================

/**
 * Backend returns:
 * {
 *   success: true,
 *   message: "Login successful",
 *   data: { user: {...}, tokens: {...} },
 *   timestamp: "2024-..."
 * }
 *
 * After interceptor unwraps (strips axios wrapper), we get the full object above.
 * TypeScript needs to know this structure.
 */
export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        tokens: TokensData;
    };
    timestamp: string;
}

/**
 * GET /me response
 */
export interface MeResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
    };
    timestamp: string;
}

/**
 * POST /auth/refresh response
 */
export interface RefreshTokenResponse {
    success: boolean;
    message: string;
    data: {
        tokens: TokensData;
    };
    timestamp: string;
}

/**
 * Generic API response wrapper
 * Use when you need a flexible type
 */
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}