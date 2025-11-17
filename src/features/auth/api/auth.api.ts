/**
 * AUTH API CLIENT
 * Works with v3 unwrapped API client
 */

import { apiClient } from "@/shared/lib/api";
import type {
    LoginCredentials,
    RegisterCredentials,
    AuthResponse,
    RefreshTokenResponse,
    MeResponse,
} from "@/features/auth/types/auth.types";

export const authApi = {
    /**
     * POST /auth/login
     * Returns: AuthResponse (unwrapped by interceptor)
     * Structure: { success, message, data: { user, tokens }, timestamp }
     */
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        return apiClient.post<AuthResponse>("/auth/login", {
            email: credentials.email.toLowerCase(),
            password: credentials.password,
        });
    },

    register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
        return apiClient.post<AuthResponse>("/auth/register", {
            name: credentials.name,
            email: credentials.email.toLowerCase(),
            password: credentials.password,
            role: credentials.role || "PARTICIPANT",
        });
    },

    refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
        return apiClient.post<RefreshTokenResponse>("/auth/refresh", { refreshToken });
    },

    logout: async (refreshToken: string): Promise<void> => {
        await apiClient.post<void>("/auth/logout", { refreshToken });
    },

    /**
     * GET /me
     * Returns: MeResponse (unwrapped by interceptor)
     * Structure: { success, message, data: { user }, timestamp }
     */
    getCurrentUser: async (): Promise<MeResponse> => {
        return apiClient.get<MeResponse>("/me");
    },
};