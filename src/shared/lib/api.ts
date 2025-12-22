// src/shared/lib/api.ts

/**
 * SHARED API CLIENT
 *
 * Central Axios instance with interceptors for:
 * - Automatic JWT injection from auth store
 * - Token refresh on 401 errors
 * - Response unwrapping: AxiosResponse<ApiResponse<T>> → ApiResponse<T>
 * - Error transformation to ApiError
 *
 * ============================================================================
 * PHASE 2 FIX v2: Aligned with actual AuthStore implementation
 * ============================================================================
 *
 * AuthStore methods used:
 * - setAuth(user, tokens) - to update auth after token refresh
 * - clearAuth() - to clear auth on failure
 * - getState().user - to get current user
 * - getState().accessToken - to get current token
 * - getState().refreshToken - to get refresh token
 */

import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosError,
    InternalAxiosRequestConfig,
} from 'axios';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { ApiResponse, ApiError } from '@/shared/types/api.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

class TypedApiClient {
    private instance: AxiosInstance;

    constructor() {
        this.instance = axios.create({
            baseURL: API_BASE_URL,
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
            timeout: 30000,
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
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
        // RESPONSE INTERCEPTOR - Handle token refresh and unwrap response
        // ============================================================================

        this.instance.interceptors.response.use(
            // SUCCESS: Strip AxiosResponse wrapper, return ApiResponse<T>
            (response) => {
                // Backend returns: { success: true, data: T, message?, timestamp }
                // We return just response.data which is ApiResponse<T>
                return response.data;
            },

            // ERROR: Handle 401 token refresh, transform errors
            async (error: AxiosError<ApiResponse<unknown>>) => {
                const original = error.config as InternalAxiosRequestConfig & {
                    _retry?: boolean;
                };

                // Check if this is an auth endpoint (don't retry auth calls)
                const isAuthEndpoint = original.url?.includes('/auth/');

                // Handle 401 Unauthorized - attempt token refresh
                if (error.response?.status === 401 && !isAuthEndpoint && !original._retry) {
                    original._retry = true;

                    const refreshToken = useAuthStore.getState().refreshToken;

                    if (refreshToken) {
                        try {
                            // Call refresh endpoint directly (avoid interceptor loop)
                            const refreshResponse = await axios.post<
                                ApiResponse<{ tokens: { accessToken: string; refreshToken: string } }>
                            >(
                                `${API_BASE_URL}/auth/refresh`,
                                { refreshToken },
                                { headers: { 'Content-Type': 'application/json' } }
                            );

                            const { tokens } = refreshResponse.data.data;
                            const user = useAuthStore.getState().user;

                            // Update auth store with new tokens
                            // ✅ FIXED: Use setAuth(user, tokens) not setTokens
                            if (user) {
                                useAuthStore.getState().setAuth(user, tokens);
                            }

                            // Update original request with new token
                            if (original.headers) {
                                original.headers.Authorization = `Bearer ${tokens.accessToken}`;
                            }

                            // Retry original request
                            return this.instance(original);
                        } catch (refreshError) {
                            // Refresh failed - clear auth and redirect to login
                            // ✅ FIXED: Use clearAuth() not logout()
                            useAuthStore.getState().clearAuth();

                            if (typeof window !== 'undefined') {
                                window.location.href = '/login';
                            }

                            return Promise.reject(this.transformError(error));
                        }
                    } else {
                        // No refresh token - clear auth and redirect
                        useAuthStore.getState().clearAuth();

                        if (typeof window !== 'undefined') {
                            window.location.href = '/login';
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
     */
    private transformError(error: AxiosError<ApiResponse<unknown>>): ApiError {
        console.log('🔍 Transforming error:', {
            hasResponse: !!error.response,
            status: error.response?.status,
            data: error.response?.data,
            hasRequest: !!error.request,
            message: error.message,
        });

        // Backend error response
        if (error.response?.data) {
            const errorData = error.response.data as ApiResponse<unknown> & {
                errorCode?: string;
                errors?: Array<{ field: string; message: string }>;
            };

            const apiError: ApiError = {
                message: errorData.message || 'An error occurred',
                errorCode: errorData.errorCode,
                errors: errorData.errors,
                status: error.response.status,
                // Preserve original error for debugging
                response: error.response,
            };

            console.log('📤 Transformed API error:', apiError);
            return apiError;
        }

        // Network error (request sent but no response)
        if (error.request) {
            console.log('🌐 Network error detected');
            return {
                message: 'Network error. Please check your connection.',
                status: 0,
            };
        }

        // Generic error (request setup failed)
        console.log('⚠️ Generic error:', error.message);
        return {
            message: error.message || 'An unexpected error occurred',
        };
    }

    // ============================================================================
    // HTTP METHODS
    //
    // Note: Due to interceptor unwrapping, these return ApiResponse<T> directly
    // (not AxiosResponse<ApiResponse<T>>)
    // ============================================================================

    /**
     * GET request
     *
     * @example
     * const response = await apiClient.get<ExamsResponse>('/exams');
     * const exams = response.data; // ExamsResponse
     */
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        // The interceptor returns response.data which is ApiResponse<T>
        // TypeScript doesn't know about interceptor transformation, so we cast
        return this.instance.get(url, config) as unknown as Promise<ApiResponse<T>>;
    }

    /**
     * POST request
     */
    async post<T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        return this.instance.post(url, data, config) as unknown as Promise<ApiResponse<T>>;
    }

    /**
     * PATCH request
     */
    async patch<T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        return this.instance.patch(url, data, config) as unknown as Promise<ApiResponse<T>>;
    }

    /**
     * PUT request
     */
    async put<T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        return this.instance.put(url, data, config) as unknown as Promise<ApiResponse<T>>;
    }

    /**
     * DELETE request
     */
    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        return this.instance.delete(url, config) as unknown as Promise<ApiResponse<T>>;
    }
}

/**
 * Singleton API client instance
 */
export const apiClient = new TypedApiClient();

/**
 * Re-export types for convenience
 */
export type { ApiResponse, ApiError } from '@/shared/types/api.types';