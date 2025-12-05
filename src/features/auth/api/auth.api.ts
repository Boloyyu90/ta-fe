// src/features/auth/api/auth.api.ts

/**
 * AUTH API CLIENT
 *
 * ✅ Correctly typed for axios interceptor that unwraps AxiosResponse → ApiResponse
 * ✅ Accesses .data property to extract payload from ApiResponse wrapper
 */

import { apiClient } from '@/shared/lib/api';
import type { ApiResponse } from '@/shared/types/api.types';
import type {
    LoginRequest,
    RegisterRequest,
    AuthPayload,
    RefreshTokenPayload,
    MePayload,
    LogoutPayload,
} from '@/features/auth/types/auth.types';

export const authApi = {
    /**
     * User login
     * POST /api/v1/auth/login
     */
    login: async (credentials: LoginRequest): Promise<AuthPayload> => {
        const response = await apiClient.post<ApiResponse<AuthPayload>>('/auth/login', {
            email: credentials.email.toLowerCase().trim(),
            password: credentials.password,
        });
        return response.data; // Extract payload from ApiResponse wrapper
    },

    /**
     * User registration
     * POST /api/v1/auth/register
     */
    register: async (credentials: RegisterRequest): Promise<AuthPayload> => {
        const response = await apiClient.post<ApiResponse<AuthPayload>>('/auth/register', {
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
     */
    refreshToken: async (refreshToken: string): Promise<RefreshTokenPayload> => {
        const response = await apiClient.post<ApiResponse<RefreshTokenPayload>>('/auth/refresh', {
            refreshToken,
        });
        return response.data;
    },

    /**
     * Logout user
     * POST /api/v1/auth/logout
     */
    logout: async (refreshToken: string): Promise<LogoutPayload> => {
        const response = await apiClient.post<ApiResponse<LogoutPayload>>('/auth/logout', {
            refreshToken,
        });
        return response.data;
    },

    /**
     * Get current user profile
     * GET /api/v1/me
     */
    getCurrentUser: async (): Promise<MePayload> => {
        const response = await apiClient.get<ApiResponse<MePayload>>('/me');
        return response.data;
    },
};

export type {
    LoginRequest,
    RegisterRequest,
    AuthPayload,
    RefreshTokenPayload,
    MePayload,
    LogoutPayload,
};