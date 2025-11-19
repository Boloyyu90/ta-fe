// src/shared/types/api.types.ts

/**
 * Standard API Response Wrapper
 * All backend responses follow this structure
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

/**
 * Pagination Parameters
 * Used for all paginated endpoints
 */
export interface PaginationParams {
    page?: number; // Default: 1
    limit?: number; // Default: 10, max: 100
}

/**
 * Pagination Metadata
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
 */
export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationMeta;
}

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
 */
export interface CommonQueryParams extends PaginationParams, SortParams, SearchParams {}