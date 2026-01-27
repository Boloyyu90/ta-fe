/**
 * useCancelTransaction Hook
 *
 * Mutation hook for cancelling PENDING transactions.
 *
 * Pattern: Same as useCreateTransaction
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '../api/transactions.api';
import type { TransactionResponse } from '../types/transactions.types';

interface UseCancelTransactionOptions {
    onSuccess?: (data: { transaction: TransactionResponse }) => void;
    onError?: (error: Error) => void;
}

export function useCancelTransaction(options?: UseCancelTransactionOptions) {
    const queryClient = useQueryClient();

    const mutation = useMutation<{ transaction: TransactionResponse }, Error, number>({
        mutationFn: (transactionId: number) => transactionsApi.cancelTransaction(transactionId),
        onSuccess: (data) => {
            // Invalidate transactions list to refresh data
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            // Invalidate exam access in case this was the pending transaction
            queryClient.invalidateQueries({ queryKey: ['exam-access'] });

            options?.onSuccess?.(data);
        },
        onError: (error) => {
            options?.onError?.(error);
        },
    });

    return {
        cancelTransaction: mutation.mutate,
        cancelTransactionAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        data: mutation.data,
    };
}

export default useCancelTransaction;
