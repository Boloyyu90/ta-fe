/**
 * SHARED API TYPES
 *
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
    timestamp: string; // ISO 8601 datetime
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
    page?: number; // Default: 1, min: 1
    limit?: number; // Default: 10, max: 100
}

/**
 * Pagination Metadata (in responses)
 * Included in all paginated responses
 *
 * ⚠️ CRITICAL: Backend uses this exact structure
 * Do NOT use custom pagination formats in features
 */
export interface PaginationMeta {
    page: number;           // Current page (1-indexed)
    limit: number;          // Items per page
    total: number;          // Total items across all pages
    totalPages: number;     // Total number of pages
    hasNext: boolean;       // Whether there's a next page
    hasPrev: boolean;       // Whether there's a previous page
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
 * Common List Query Parameters
 * Most list endpoints use pagination + sorting + search
 *
 * Usage example:
 * export interface GetExamsQuery extends ListQueryParams {
 *   status?: ExamStatus;
 *   createdBy?: number;
 * }
 */
export interface ListQueryParams
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
 * Handles Axios errors and generic errors
 */
export const extractErrorMessage = (error: any): string => {
    // Axios error with backend response
    if (error.response?.data?.message) {
        return error.response.data.message;
    }

    // Axios error without backend response (network error)
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
 * Extract field-specific validation errors from API error response
 * Returns null if no field errors exist
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