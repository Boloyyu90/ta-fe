// src/features/auth/api/auth.api.ts

/**
 * AUTH API CLIENT - FIXED
 *
 * ✅ Correct return types for unwrapped axios responses
 * ✅ Works with axios interceptor that unwraps response.data.data
 * ✅ Email normalization (lowercase)
 *
 * IMPORTANT: This assumes your axios interceptor returns response.data.data
 * If your interceptor returns the full response, use the alternative version
 */

import { apiClient } from '@/shared/lib/api';
import type {
    LoginRequest,
    RegisterRequest,
    AuthPayload,
    RefreshTokenPayload,
    MePayload,
    LogoutPayload,
} from '@/features/auth/types/auth.types';

// ============================================================================
// AUTH API CLIENT
// ============================================================================

export const authApi = {
    /**
     * User login
     * POST /api/v1/auth/login
     *
     * @param credentials - Email and password
     * @returns AuthPayload with user and tokens
     *
     * @example
     * const { user, tokens } = await authApi.login({
     *   email: 'user@example.com',
     *   password: 'password123'
     * });
     */
    login: async (credentials: LoginRequest): Promise<AuthPayload> => {
        const response = await apiClient.post<AuthPayload>('/auth/login', {
            email: credentials.email.toLowerCase().trim(),
            password: credentials.password,
        });
        return response.data;
    },

    /**
     * User registration
     * POST /api/v1/auth/register
     *
     * @param credentials - Name, email, password, and optional role
     * @returns AuthPayload with user and tokens
     *
     * @example
     * const { user, tokens } = await authApi.register({
     *   name: 'John Doe',
     *   email: 'john@example.com',
     *   password: 'Password123',
     *   role: 'PARTICIPANT'
     * });
     */
    register: async (credentials: RegisterRequest): Promise<AuthPayload> => {
        const response = await apiClient.post<AuthPayload>('/auth/register', {
            name: credentials.name.trim(),
            email: credentials.email.toLowerCase().trim(),
            password: credentials.password,
            role: credentials.role || 'PARTICIPANT',
        });
        return response.data;
    },

    /**
     * Refresh access token
     * POST /api/v1/auth/refresh
     *
     * @param refreshToken - The refresh token
     * @returns RefreshTokenPayload with new tokens
     *
     * @example
     * const { tokens } = await authApi.refreshToken('refresh_token_here');
     * localStorage.setItem('accessToken', tokens.accessToken);
     * localStorage.setItem('refreshToken', tokens.refreshToken);
     */
    refreshToken: async (refreshToken: string): Promise<RefreshTokenPayload> => {
        const response = await apiClient.post<RefreshTokenPayload>('/auth/refresh', {
            refreshToken,
        });
        return response.data;
    },

    /**
     * Logout user
     * POST /api/v1/auth/logout
     *
     * Invalidates the refresh token on the server
     *
     * @param refreshToken - The refresh token to invalidate
     * @returns LogoutPayload
     *
     * @example
     * await authApi.logout(refreshToken);
     * localStorage.clear();
     */
    logout: async (refreshToken: string): Promise<LogoutPayload> => {
        const response = await apiClient.post<LogoutPayload>('/auth/logout', {
            refreshToken,
        });
        return response.data;
    },

    /**
     * Get current user profile
     * GET /api/v1/me
     *
     * Requires authentication (access token in headers)
     *
     * @returns MePayload with user data
     *
     * @example
     * const { user } = await authApi.getCurrentUser();
     */
    getCurrentUser: async (): Promise<MePayload> => {
        const response = await apiClient.get<MePayload>('/me');
        return response.data;
    },
};

// ============================================================================
// TYPE EXPORTS (for convenience)
// ============================================================================

export type {
    LoginRequest,
    RegisterRequest,
    AuthPayload,
    RefreshTokenPayload,
    MePayload,
    LogoutPayload,
};