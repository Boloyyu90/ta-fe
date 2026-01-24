/**
 * useTransactions Hook
 *
 * Fetches user's transactions with pagination and filters.
 * Used in /my-packages page to show purchased packages.
 *
 * Pattern: Same as useExams in exams/hooks
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { transactionsApi } from '../api/transactions.api';
import type {
    PaginatedTransactionsResponse,
    ListTransactionsParams,
    TransactionStatus,
} from '../types/transactions.types';

export interface UseTransactionsOptions extends ListTransactionsParams {
    enabled?: boolean;
}

export function useTransactions(options: UseTransactionsOptions = {}) {
    const {
        page = 1,
        limit = 10,
        status,
        examId,
        sortOrder = 'desc',
        enabled = true,
    } = options;

    const query = useQuery<PaginatedTransactionsResponse, Error>({
        queryKey: ['transactions', { page, limit, status, examId, sortOrder }],
        queryFn: () =>
            transactionsApi.getTransactions({
                page,
                limit,
                status,
                examId,
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

/**
 * Convenience hook for fetching only PAID transactions
 * Used in /my-packages page
 */
export function useMyPaidPackages(options: Omit<UseTransactionsOptions, 'status'> = {}) {
    return useTransactions({
        ...options,
        status: 'PAID',
        limit: options.limit ?? 50, // Higher limit for purchased packages
    });
}

export default useTransactions;
