/**
 * useRetryPayment Hook
 *
 * Re-triggers Midtrans Snap for PENDING transactions with existing snapToken.
 * If snapToken is expired, syncs first to get a fresh one.
 *
 * Pattern: Same as useCreateTransaction - mutation with Midtrans side effects
 */

'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '../api/transactions.api';
import { loadMidtransSnap } from '../utils/midtrans.utils';
import type { TransactionResponse, MidtransSnapCallbacks } from '../types/transactions.types';

interface UseRetryPaymentOptions {
    onPaymentSuccess?: () => void;
    onPaymentPending?: () => void;
    onPaymentError?: () => void;
    onPaymentClose?: () => void;
}

interface RetryPaymentParams {
    transactionId: number;
    snapToken: string | null;
}

export function useRetryPayment(options?: UseRetryPaymentOptions) {
    const queryClient = useQueryClient();
    const [isSnapLoading, setIsSnapLoading] = useState(false);

    const mutation = useMutation<{ transaction: TransactionResponse }, Error, RetryPaymentParams>({
        mutationFn: async ({ transactionId, snapToken }) => {
            // If snapToken exists, use it directly
            if (snapToken) {
                return { transaction: { snapToken } as TransactionResponse };
            }

            // Otherwise, sync transaction to get fresh snapToken
            return transactionsApi.syncTransaction(transactionId);
        },
        onSuccess: async (data, variables) => {
            const snapToken = data.transaction.snapToken ?? variables.snapToken;

            if (!snapToken) {
                console.error('No snapToken available for payment');
                options?.onPaymentError?.();
                return;
            }

            setIsSnapLoading(true);

            try {
                // Get client key for Midtrans
                const { clientKey } = await transactionsApi.getClientKey();

                // Load Midtrans script
                await loadMidtransSnap(clientKey);

                // Open Snap popup
                if (window.snap) {
                    const callbacks: MidtransSnapCallbacks = {
                        onSuccess: () => {
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
            } finally {
                setIsSnapLoading(false);
            }
        },
    });

    const retryPayment = (transactionId: number, snapToken: string | null) => {
        mutation.mutate({ transactionId, snapToken });
    };

    return {
        retryPayment,
        isPending: mutation.isPending || isSnapLoading,
        isError: mutation.isError,
        error: mutation.error,
    };
}

export default useRetryPayment;
