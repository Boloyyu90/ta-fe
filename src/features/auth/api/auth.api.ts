import { apiClient } from '@/shared/lib/api';
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
     *
     * @returns AuthPayload = { user: User, tokens: TokensData }
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
     * @returns AuthPayload = { user: User, tokens: TokensData }
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
     * @returns RefreshTokenPayload = { tokens: TokensData }
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
     * @returns LogoutPayload = { success: boolean }
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
     * @returns MePayload = { user: User }
     */
    getCurrentUser: async (): Promise<MePayload> => {
        const response = await apiClient.get<MePayload>('/me');
        return response.data;
    },
};

// Re-export types for convenience
export type {
    LoginRequest,
    RegisterRequest,
    AuthPayload,
    RefreshTokenPayload,
    MePayload,
    LogoutPayload,
};