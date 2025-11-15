/**
 * SHARED API CLIENT
 *
 * Axios instance with request/response interceptors
 * Handles authentication tokens and automatic token refresh
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/features/auth/store";

// API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

// Create axios instance
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Include cookies for httpOnly tokens
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken = useAuthStore.getState().accessToken;

        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle token refresh and errors
apiClient.interceptors.response.use(
    (response) => {
        // Unwrap data from response
        return response.data;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // If 401 Unauthorized and not already retrying, attempt token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = useAuthStore.getState().refreshToken;

                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                // Call refresh token endpoint
                const response = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    { refreshToken },
                    { headers: { "Content-Type": "application/json" } }
                );

                const { tokens } = response.data.data;

                // Update tokens in store
                const user = useAuthStore.getState().user;
                if (user) {
                    useAuthStore.getState().setAuth(user, tokens);
                }

                // Retry original request with new token
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
                }

                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh failed - clear auth and redirect to login
                useAuthStore.getState().clearAuth();

                // Only redirect if we're in the browser
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);