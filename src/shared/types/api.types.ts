// src/shared/types/api.types.ts

/**
 * SHARED API TYPES
 *
 * ⚠️ CRITICAL: These match backend response structure EXACTLY
 * Source: backend/src/shared/types/api.types.ts
 *
 * All backend responses use ApiResponse<T> wrapper
 */

// ============================================================================
// STANDARD API RESPONSE WRAPPER
// ============================================================================

/**
 * Standard API Response Wrapper
 * All backend responses follow this structure
 *
 * Example backend response:
 * {
 *   success: true,
 *   data: { ... actual payload ... },
 *   message: "Operation successful",
 *   timestamp: "2025-01-15T10:30:00.000Z"
 * }
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    timestamp: string; // ISO datetime
}

/**
 * Standard Error Response
 * Returned when success = false
 *
 * Example error response:
 * {
 *   success: false,
 *   message: "Validation failed",
 *   errorCode: "AUTH_001",
 *   errors: [{ field: "email", message: "Email is required" }],
 *   timestamp: "2025-01-15T10:30:00.000Z"
 * }
 */
export interface ApiErrorResponse {
    success: false;
    message: string;
    errorCode?: string; // Machine-readable error code (e.g., "AUTH_001")
    errors?: Array<{
        field: string;
        message: string;
    }>;
    timestamp: string;
}

// ============================================================================
// PAGINATION TYPES
// ============================================================================

/**
 * Pagination Parameters (for requests)
 * Used in query params for list endpoints
 */
export interface PaginationParams {
    page?: number; // Default: 1
    limit?: number; // Default: 10, max: 100
}

/**
 * Pagination Metadata (in responses)
 * Included in all paginated responses
 */
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

/**
 * Generic Paginated Response
 * Used by list endpoints
 *
 * Example:
 * {
 *   data: [...items...],
 *   pagination: { page: 1, limit: 10, total: 50, ... }
 * }
 */
export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationMeta;
}

// ============================================================================
// QUERY PARAMETER TYPES
// ============================================================================

/**
 * Sort Parameters
 * Used for sortable endpoints
 */
export interface SortParams {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

/**
 * Search Parameters
 * Used for searchable endpoints
 */
export interface SearchParams {
    search?: string;
}

/**
 * Common Query Parameters
 * Combination of pagination, sort, and search
 * Most list endpoints use this pattern
 */
export interface CommonQueryParams
    extends PaginationParams,
        SortParams,
        SearchParams {}

// ============================================================================
// GENERIC RESPONSE TYPES
// ============================================================================

/**
 * Success response with just success flag
 * Used for operations that don't return data (e.g., delete)
 */
export interface SuccessResponse {
    success: boolean;
}

/**
 * Message response
 * Used for simple confirmation responses
 */
export interface MessageResponse {
    message: string;
}

// ============================================================================
// TYPE HELPERS
// ============================================================================

/**
 * Extract the data type from an ApiResponse
 *
 * Example:
 * type UserData = UnwrapApiResponse<ApiResponse<{ user: User }>>;
 * // Result: { user: User }
 */
export type UnwrapApiResponse<T> = T extends ApiResponse<infer U> ? U : never;

/**
 * Make all properties of T optional recursively
 * Useful for update/patch operations
 */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ============================================================================
// AXIOS INTEGRATION TYPES
// ============================================================================

/**
 * Axios response type with ApiResponse wrapper
 * This is what axios interceptor returns
 */
export interface AxiosApiResponse<T = any> {
    data: ApiResponse<T>;
    status: number;
    statusText: string;
    headers: Record<string, string>;
}

// ============================================================================
// ERROR HANDLING TYPES
// ============================================================================

/**
 * API error object structure
 * Used in error handling throughout the app
 */
export interface ApiError {
    message: string;
    errorCode?: string;
    errors?: Array<{
        field: string;
        message: string;
    }>;
    status?: number;
}

/**
 * Extract error message from various error types
 */
export const extractErrorMessage = (error: any): string => {
    // Axios error with backend response
    if (error.response?.data?.message) {
        return error.response.data.message;
    }

    // Axios error without backend response
    if (error.request) {
        return 'Network error. Please check your connection.';
    }

    // Generic error
    if (error.message) {
        return error.message;
    }

    return 'An unexpected error occurred.';
};

/**
 * Extract field errors from API error response
 */
export const extractFieldErrors = (
    error: any
): Record<string, string> | null => {
    if (error.response?.data?.errors) {
        const fieldErrors: Record<string, string> = {};
        error.response.data.errors.forEach((err: { field: string; message: string }) => {
            fieldErrors[err.field] = err.message;
        });
        return fieldErrors;
    }
    return null;
};