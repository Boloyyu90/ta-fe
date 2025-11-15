/**
 * AUTH API CLIENT
 *
 * Type-safe API functions for authentication endpoints
 * Maps to backend /api/v1/auth endpoints
 */

import { apiClient } from "@/shared/lib/api";
import type {
    LoginCredentials,
    RegisterCredentials,
    AuthResponse,
    RefreshTokenResponse,
    MeResponse,
} from "@/features/auth/types";

export const authApi = {
    /**
     * POST /auth/login
     * Authenticate user with email and password
     */
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        return apiClient.post("/auth/login", {
            email: credentials.email.toLowerCase(),
            password: credentials.password,
        });
    },

    /**
     * POST /auth/register
     * Create new user account
     */
    register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
        return apiClient.post("/auth/register", {
            name: credentials.name,
            email: credentials.email.toLowerCase(),
            password: credentials.password,
            role: credentials.role || "PARTICIPANT",
        });
    },

    /**
     * POST /auth/refresh
     * Refresh access token using refresh token
     */
    refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
        return apiClient.post("/auth/refresh", { refreshToken });
    },

    /**
     * POST /auth/logout
     * Invalidate refresh token and clear session
     */
    logout: async (refreshToken: string): Promise<void> => {
        await apiClient.post("/auth/logout", { refreshToken });
    },

    /**
     * GET /me
     * Get current authenticated user profile
     */
    getCurrentUser: async (): Promise<MeResponse> => {
        return apiClient.get("/me");
    },
};