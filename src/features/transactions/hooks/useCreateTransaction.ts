/**
 * useCreateTransaction Hook
 *
 * Creates transaction and handles Midtrans Snap popup.
 *
 * Pattern: Same as useStartExam - mutation with side effects
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '../api/transactions.api';
import { loadMidtransSnap } from '../utils/midtrans.utils';
import type { CreateTransactionResponse, MidtransSnapCallbacks } from '../types/transactions.types';

interface UseCreateTransactionOptions {
    onPaymentSuccess?: () => void;
    onPaymentPending?: () => void;
    onPaymentError?: () => void;
    onPaymentClose?: () => void;
}

export function useCreateTransaction(options?: UseCreateTransactionOptions) {
    const queryClient = useQueryClient();

    const mutation = useMutation<CreateTransactionResponse, Error, number>({
        mutationFn: (examId: number) => transactionsApi.createTransaction(examId),
        onSuccess: async (data) => {
            const { snapToken, clientKey } = data;

            try {
                // Load Midtrans script
                await loadMidtransSnap(clientKey);

                // Open Snap popup
                if (window.snap) {
                    const callbacks: MidtransSnapCallbacks = {
                        onSuccess: () => {
                            // Invalidate queries to refresh data
                            queryClient.invalidateQueries({ queryKey: ['exam-access'] });
                            queryClient.invalidateQueries({ queryKey: ['transactions'] });
                            options?.onPaymentSuccess?.();
                        },
                        onPending: () => {
                            queryClient.invalidateQueries({ queryKey: ['exam-access'] });
                            queryClient.invalidateQueries({ queryKey: ['transactions'] });
                            options?.onPaymentPending?.();
                        },
                        onError: () => {
                            options?.onPaymentError?.();
                        },
                        onClose: () => {
                            options?.onPaymentClose?.();
                        },
                    };

                    window.snap.pay(snapToken, callbacks);
                }
            } catch (error) {
                console.error('Failed to load Midtrans:', error);
                options?.onPaymentError?.();
            }
        },
    });

    return {
        createTransaction: mutation.mutate,
        createTransactionAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        data: mutation.data,
    };
}

export default useCreateTransaction;
