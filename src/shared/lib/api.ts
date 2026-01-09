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
import { queryClient } from '@/shared/lib/queryClient';
import { toast } from 'sonner';
import type { ApiResponse, ApiError } from '@/shared/types/api.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// ============================================================================
// EXAM-CRITICAL ENDPOINTS (should NOT redirect to login on auth failure)
// ============================================================================
const EXAM_CRITICAL_PATTERNS = [
    /\/exam-sessions\/\d+\/submit/,
    /\/exam-sessions\/\d+\/answers/,
    /\/proctoring\/\d+\/events/,
    /\/proctoring\/\d+\/analyze/,
];

const isExamCriticalEndpoint = (url: string | undefined): boolean => {
    if (!url) return false;
    return EXAM_CRITICAL_PATTERNS.some(pattern => pattern.test(url));
};

class TypedApiClient {
    private instance: AxiosInstance;

    // Token refresh mutex state to prevent race conditions (409 Conflict)
    private isRefreshing = false;
    private refreshSubscribers: Array<(token: string) => void> = [];

    constructor() {
        this.instance = axios.create({
            baseURL: API_BASE_URL,
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
            timeout: 30000,
        });

        this.setupInterceptors();
    }

    /**
     * Subscribe to token refresh completion
     * Used to queue requests while refresh is in progress
     */
    private subscribeTokenRefresh(callback: (token: string) => void): void {
        this.refreshSubscribers.push(callback);
    }

    /**
     * Notify all subscribers that token has been refreshed
     */
    private onTokenRefreshed(token: string): void {
        this.refreshSubscribers.forEach(callback => callback(token));
        this.refreshSubscribers = [];
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
                const requestUrl = original.url || '';

                // Handle 401 Unauthorized - attempt token refresh
                if (error.response?.status === 401 && !isAuthEndpoint && !original._retry) {
                    original._retry = true;

                    // MUTEX: If already refreshing, queue this request
                    if (this.isRefreshing) {
                        console.log('[Auth] Token refresh in progress, queuing request:', requestUrl);
                        return new Promise((resolve) => {
                            this.subscribeTokenRefresh((token: string) => {
                                if (original.headers) {
                                    original.headers.Authorization = `Bearer ${token}`;
                                }
                                resolve(this.instance(original));
                            });
                        });
                    }

                    const refreshToken = useAuthStore.getState().refreshToken;

                    if (refreshToken) {
                        this.isRefreshing = true;

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
                            if (user) {
                                useAuthStore.getState().setAuth(user, tokens);
                            }

                            // Notify all queued requests
                            this.onTokenRefreshed(tokens.accessToken);

                            // Update original request with new token
                            if (original.headers) {
                                original.headers.Authorization = `Bearer ${tokens.accessToken}`;
                            }

                            // Retry original request
                            return this.instance(original);
                        } catch (refreshError) {
                            // Check if this is an exam-critical endpoint
                            if (isExamCriticalEndpoint(requestUrl)) {
                                console.warn('[Auth] Refresh failed on exam-critical endpoint, NOT redirecting to login:', requestUrl);
                                // Let the component handle the error (redirect to results or show message)
                                return Promise.reject(this.transformError(error));
                            }

                            // Refresh failed - clear auth and redirect to login
                            console.warn('[Auth] Token refresh failed, session expired. Redirecting to login.');

                            // REC-001: Clear React Query cache to prevent cross-user data leakage
                            queryClient.clear();

                            // Clear auth state from store and storage
                            useAuthStore.getState().clearAuth();

                            if (typeof window !== 'undefined') {
                                // REC-002: Show user feedback before redirect
                                toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
                                window.location.href = '/login';
                            }

                            return Promise.reject(this.transformError(error));
                        } finally {
                            this.isRefreshing = false;
                        }
                    } else {
                        // Check if this is an exam-critical endpoint
                        if (isExamCriticalEndpoint(requestUrl)) {
                            console.warn('[Auth] No refresh token on exam-critical endpoint, NOT redirecting:', requestUrl);
                            return Promise.reject(this.transformError(error));
                        }

                        // No refresh token available - clear auth and redirect
                        console.warn('[Auth] No refresh token available, session invalid. Redirecting to login.');

                        // REC-001: Clear React Query cache to prevent cross-user data leakage
                        queryClient.clear();

                        // Clear auth state from store and storage
                        useAuthStore.getState().clearAuth();

                        if (typeof window !== 'undefined') {
                            // REC-002: Show user feedback before redirect
                            toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
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