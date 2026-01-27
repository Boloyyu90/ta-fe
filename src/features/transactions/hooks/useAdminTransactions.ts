/**
 * Admin Transaction Hooks
 *
 * Hooks for admin transaction management:
 * - useAdminTransactions: Fetch all transactions with filters
 * - useTransactionStats: Fetch transaction statistics
 * - useCleanupExpiredTransactions: Mutation for cleanup
 *
 * Pattern: Same as useUsers in users/hooks
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { transactionsApi } from '../api/transactions.api';
import type {
    AdminListTransactionsParams,
    PaginatedAdminTransactionsResponse,
    TransactionStatsResponse,
    CleanupExpiredResponse,
} from '../types/transactions.types';

// =============================================================================
// useAdminTransactions
// =============================================================================

export interface UseAdminTransactionsOptions extends AdminListTransactionsParams {
    enabled?: boolean;
}

/**
 * Hook for fetching all transactions (admin view)
 *
 * @param options - Query parameters and options
 *
 * @example
 * const { transactions, pagination, isLoading } = useAdminTransactions({
 *   page: 1,
 *   limit: 10,
 *   status: 'PENDING'
 * });
 */
export function useAdminTransactions(options: UseAdminTransactionsOptions = {}) {
    const {
        page = 1,
        limit = 10,
        status,
        examId,
        userId,
        search,
        sortOrder = 'desc',
        enabled = true,
    } = options;

    const query = useQuery<PaginatedAdminTransactionsResponse, Error>({
        queryKey: ['admin-transactions', { page, limit, status, examId, userId, search, sortOrder }],
        queryFn: () =>
            transactionsApi.getAdminTransactions({
                page,
                limit,
                status,
                examId,
                userId,
                search,
                sortOrder,
            }),
        enabled,
        placeholderData: keepPreviousData,
        staleTime: 30 * 1000, // 30 seconds
    });

    return {
        ...query,
        transactions: query.data?.transactions ?? [],
        pagination: query.data?.pagination,
    };
}

// =============================================================================
// useTransactionStats
// =============================================================================

export interface UseTransactionStatsOptions {
    enabled?: boolean;
}

/**
 * Hook for fetching transaction statistics (admin)
 *
 * @example
 * const { data, isLoading } = useTransactionStats();
 * console.log(data?.totalRevenue, data?.todayRevenue);
 */
export function useTransactionStats(options: UseTransactionStatsOptions = {}) {
    const { enabled = true } = options;

    return useQuery<TransactionStatsResponse, Error>({
        queryKey: ['admin-transaction-stats'],
        queryFn: () => transactionsApi.getTransactionStats(),
        enabled,
        staleTime: 60 * 1000, // 1 minute
    });
}

// =============================================================================
// useCleanupExpiredTransactions
// =============================================================================

export interface UseCleanupExpiredTransactionsOptions {
    onSuccess?: (data: CleanupExpiredResponse) => void;
    onError?: (error: Error) => void;
}

/**
 * Mutation hook for cleaning up expired transactions (admin)
 *
 * @example
 * const { cleanup, isPending } = useCleanupExpiredTransactions({
 *   onSuccess: (data) => toast.success(`Cleaned up ${data.expiredCount} transactions`)
 * });
 */
export function useCleanupExpiredTransactions(options?: UseCleanupExpiredTransactionsOptions) {
    const queryClient = useQueryClient();

    const mutation = useMutation<CleanupExpiredResponse, Error, void>({
        mutationFn: () => transactionsApi.cleanupExpiredTransactions(),
        onSuccess: (data) => {
            // Invalidate both transactions list and stats
            queryClient.invalidateQueries({ queryKey: ['admin-transactions'] });
            queryClient.invalidateQueries({ queryKey: ['admin-transaction-stats'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });

            options?.onSuccess?.(data);
        },
        onError: (error) => {
            options?.onError?.(error);
        },
    });

    return {
        cleanup: mutation.mutate,
        cleanupAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        data: mutation.data,
    };
}

export default useAdminTransactions;
