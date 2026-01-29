/**
 * CPNS Configuration Hook
 *
 * Fetches CPNS exam configuration from backend and provides React Query hooks.
 * Backend: GET /api/v1/config/cpns
 *
 * Uses staleTime: Infinity since CPNS config rarely changes during a session.
 * Falls back to inline constants if backend is unavailable.
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/api';
import type { QuestionType } from '@/shared/types/enum.types';

// ============================================================================
// TYPES
// ============================================================================

/** Backend response structure for categories */
interface BackendCpnsCategory {
    type: QuestionType;
    name: string;
    passingGrade: number;
}

/** Backend API response structure */
interface BackendCpnsConfigResponse {
    passingGrades: Record<QuestionType, number>;
    totalPassingScore: number;
    categories: BackendCpnsCategory[];
}

/** Normalized category structure for frontend use */
export interface CpnsCategory {
    type: QuestionType;
    label: string;
    short: string;
    passing: number;
}

/** Normalized config response for frontend use */
export interface CpnsConfigResponse {
    categories: CpnsCategory[];
    passingGrades: Record<QuestionType, number>;
    totalPassingScore: number;
}

// ============================================================================
// FALLBACK VALUES
// ============================================================================

const FALLBACK_CATEGORIES: CpnsCategory[] = [
    { type: 'TWK' as QuestionType, label: 'Tes Wawasan Kebangsaan', short: 'TWK', passing: 65 },
    { type: 'TIU' as QuestionType, label: 'Tes Intelegensi Umum', short: 'TIU', passing: 80 },
    { type: 'TKP' as QuestionType, label: 'Tes Karakteristik Pribadi', short: 'TKP', passing: 166 },
];

const FALLBACK_PASSING_GRADES: Record<QuestionType, number> = {
    TWK: 65,
    TIU: 80,
    TKP: 166,
};

// ============================================================================
// API FUNCTION
// ============================================================================

/**
 * Fetch CPNS config from backend and normalize response
 * GET /api/v1/questions/cpns-config
 */
async function getCpnsConfig(): Promise<CpnsConfigResponse> {
    const response = await apiClient.get<BackendCpnsConfigResponse>('/questions/cpns-config');
    const backendData = response.data;

    // Normalize categories to frontend structure
    const normalizedCategories: CpnsCategory[] = backendData.categories.map((cat) => ({
        type: cat.type,
        label: cat.name,
        short: cat.type,
        passing: cat.passingGrade,
    }));

    return {
        categories: normalizedCategories,
        passingGrades: backendData.passingGrades,
        totalPassingScore: backendData.totalPassingScore,
    };
}

// ============================================================================
// HOOKS
// ============================================================================

export interface UseCpnsConfigResult {
    categories: CpnsCategory[] | undefined;
    passingGrades: Record<QuestionType, number> | undefined;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
}

/** Base hook to fetch CPNS configuration */
export function useCpnsConfig(): UseCpnsConfigResult {
    const query = useQuery<CpnsConfigResponse, Error>({
        queryKey: ['cpns-config'],
        queryFn: getCpnsConfig,
        staleTime: Infinity,
        gcTime: Infinity,
        retry: 2,
    });

    return {
        categories: query.data?.categories,
        passingGrades: query.data?.passingGrades,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
}

/** Get CPNS categories with fallback to local constants */
export function useCpnsCategoriesWithFallback() {
    const { categories, isLoading, isError } = useCpnsConfig();

    return {
        categories: categories ?? FALLBACK_CATEGORIES,
        isLoading,
        isError,
        isUsingFallback: !categories,
    };
}

/** Get CPNS passing grades with fallback to local constants */
export function useCpnsPassingGradesWithFallback() {
    const { passingGrades, isLoading, isError } = useCpnsConfig();

    return {
        passingGrades: passingGrades ?? FALLBACK_PASSING_GRADES,
        isLoading,
        isError,
        isUsingFallback: !passingGrades,
    };
}

export default useCpnsConfig;
