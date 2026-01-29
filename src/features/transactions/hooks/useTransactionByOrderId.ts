/**
 * useTransactionByOrderId Hook
 *
 * Fetches a transaction by its Midtrans order ID.
 * Useful for payment callback/redirect pages where only orderId is available.
 *
 * Pattern: Same as useTransactions
 */

import { useQuery } from '@tanstack/react-query';
import { transactionsApi } from '../api/transactions.api';
import type { TransactionResponse } from '../types/transactions.types';

export interface UseTransactionByOrderIdOptions {
    enabled?: boolean;
}

export function useTransactionByOrderId(
    orderId: string | null | undefined,
    options: UseTransactionByOrderIdOptions = {}
) {
    const { enabled = true } = options;

    const query = useQuery<{ transaction: TransactionResponse }, Error>({
        queryKey: ['transaction', 'order', orderId],
        queryFn: () => transactionsApi.getTransactionByOrderId(orderId!),
        enabled: enabled && !!orderId,
        staleTime: 30 * 1000, // 30 seconds
    });

    return {
        ...query,
        transaction: query.data?.transaction ?? null,
    };
}

export default useTransactionByOrderId;
