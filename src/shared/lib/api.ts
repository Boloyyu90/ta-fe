/**
 * SHARED API CLIENT
 *
 * Central Axios instance with interceptors for:
 * - Automatic JWT injection from auth store
 * - Token refresh on 401 errors
 * - Response unwrapping: AxiosResponse<ApiResponse<T>> → T
 * - Error transformation to ApiError
 */

import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosError,
    InternalAxiosRequestConfig,
    AxiosResponse,
} from "axios";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { ApiResponse, ApiError, extractErrorMessage } from "@/shared/types/api.types"; // ✅ Import shared types

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

/**
 * Response interceptor unwraps:
 * AxiosResponse<ApiResponse<T>> → ApiResponse<T> → T (payload only)
 */
type UnwrappedPromise<T> = Promise<T>;

class TypedApiClient {
    private instance: AxiosInstance;

    constructor() {
        this.instance = axios.create({
            baseURL: API_BASE_URL,
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        });

        this.setupInterceptors();
    }

    /**
     * Setup request and response interceptors
     */
    private setupInterceptors() {
        // ============================================================================
        // REQUEST INTERCEPTOR - Inject JWT token
        // ============================================================================

        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = useAuthStore.getState().accessToken;
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // ============================================================================
        // RESPONSE INTERCEPTOR - Unwrap data and handle token refresh
        // ============================================================================

        this.instance.interceptors.response.use(
            // SUCCESS: Unwrap AxiosResponse<ApiResponse<T>> → T
            <T>(response: AxiosResponse<ApiResponse<T>>): T => {
                // Backend returns: { success: true, data: T, message?, timestamp }
                // We unwrap to return just T (the payload)
                return response.data.data as T;
            },

            // ERROR: Handle 401 token refresh, transform errors
            async (error: AxiosError<ApiResponse<any>>) => {
                const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

                // Check if this is an auth endpoint (don't retry auth calls)
                const isAuthEndpoint = original.url?.includes('/auth/');

                // Only attempt token refresh for NON-AUTH 401 errors
                if (error.response?.status === 401 && !isAuthEndpoint && !original._retry) {
                    original._retry = true;

                    try {
                        const refreshToken = useAuthStore.getState().refreshToken;

                        if (!refreshToken) {
                            // No refresh token → clear auth and redirect
                            useAuthStore.getState().clearAuth();
                            if (typeof window !== "undefined") {
                                window.location.href = "/login";
                            }
                            return Promise.reject(this.transformError(error));
                        }

                        // Attempt token refresh
                        const res = await axios.post<ApiResponse<{ tokens: any }>>(
                            `${API_BASE_URL}/auth/refresh`,
                            { refreshToken },
                            { headers: { "Content-Type": "application/json" } }
                        );

                        const { tokens } = res.data.data;
                        const user = useAuthStore.getState().user;

                        if (user) {
                            useAuthStore.getState().setAuth(user, tokens);
                        }

                        // Retry original request with new token
                        if (original.headers) {
                            original.headers.Authorization = `Bearer ${tokens.accessToken}`;
                        }

                        return this.instance(original);

                    } catch (refreshError) {
                        // Refresh failed → clear auth and redirect
                        useAuthStore.getState().clearAuth();
                        if (typeof window !== "undefined") {
                            window.location.href = "/login";
                        }
                        return Promise.reject(this.transformError(error));
                    }
                }

                // All other errors → transform and reject
                return Promise.reject(this.transformError(error));
            }
        );
    }

    /**
     * Transform Axios error to ApiError type
     *  Uses backend's error response structure
     */
    private transformError(error: AxiosError<ApiResponse<any>>): ApiError {
        // Backend error response (success: false)
        if (error.response?.data) {
            const errorData = error.response.data;
            return {
                message: errorData.message || 'An error occurred',
                errorCode: (errorData as any).errorCode,
                errors: (errorData as any).errors,
                status: error.response.status,
            };
        }

        // Network error (no response from server)
        if (error.request) {
            return {
                message: 'Network error. Please check your connection.',
                status: 0,
            };
        }

        // Generic error
        return {
            message: error.message || 'An unexpected error occurred',
        };
    }

    // ============================================================================
    // HTTP METHODS
    // ============================================================================

    /**
     * GET request
     * @returns Unwrapped payload (T) from ApiResponse<T>
     */
    async get<T = any>(url: string, config?: AxiosRequestConfig): UnwrappedPromise<T> {
        return this.instance.get<ApiResponse<T>, T>(url, config) as UnwrappedPromise<T>;
    }

    /**
     * POST request
     * @returns Unwrapped payload (T) from ApiResponse<T>
     */
    async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): UnwrappedPromise<T> {
        return this.instance.post<ApiResponse<T>, T>(url, data, config) as UnwrappedPromise<T>;
    }

    /**
     * PATCH request
     * @returns Unwrapped payload (T) from ApiResponse<T>
     */
    async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): UnwrappedPromise<T> {
        return this.instance.patch<ApiResponse<T>, T>(url, data, config) as UnwrappedPromise<T>;
    }

    /**
     * PUT request
     * @returns Unwrapped payload (T) from ApiResponse<T>
     */
    async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): UnwrappedPromise<T> {
        return this.instance.put<ApiResponse<T>, T>(url, data, config) as UnwrappedPromise<T>;
    }

    /**
     * DELETE request
     * @returns Unwrapped payload (T) from ApiResponse<T>
     */
    async delete<T = any>(url: string, config?: AxiosRequestConfig): UnwrappedPromise<T> {
        return this.instance.delete<ApiResponse<T>, T>(url, config) as UnwrappedPromise<T>;
    }
}

/**
 * Singleton API client instance
 * Import this in feature API modules
 *
 * @example
 * import { apiClient } from '@/shared/lib/api';
 *
 * const response = await apiClient.get<User>('/me');
 * // response is User, not ApiResponse<User> (already unwrapped)
 */
export const apiClient = new TypedApiClient();

/**
 * Export shared types for feature modules
 * Re-export for convenience
 */
export type { ApiResponse, ApiError } from "@/shared/types/api.types";