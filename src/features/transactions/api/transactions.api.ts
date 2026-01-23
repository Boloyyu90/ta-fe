/**
 * Transactions API
 *
 * Pattern: Same as exams.api.ts
 * Uses apiClient from @/shared/lib/api
 */

import { apiClient } from '@/shared/lib/api';
import type {
    TransactionResponse,
    CreateTransactionResponse,
    ExamAccessResponse,
    ListTransactionsParams,
    PaginatedTransactionsResponse,
} from '../types/transactions.types';

// =============================================================================
// PARTICIPANT ENDPOINTS
// =============================================================================

/**
 * Create transaction (initiate payment)
 * POST /api/v1/transactions
 */
export const createTransaction = async (examId: number): Promise<CreateTransactionResponse> => {
    const response = await apiClient.post<CreateTransactionResponse>('/transactions', { examId });
    return response.data;
};

/**
 * Check exam access (CRITICAL for exam detail page)
 * GET /api/v1/transactions/exam/:examId/access
 */
export const checkExamAccess = async (examId: number): Promise<ExamAccessResponse> => {
    const response = await apiClient.get<ExamAccessResponse>(`/transactions/exam/${examId}/access`);
    return response.data;
};

/**
 * Get user's transactions
 * GET /api/v1/transactions
 */
export const getTransactions = async (
    params?: ListTransactionsParams
): Promise<PaginatedTransactionsResponse> => {
    const response = await apiClient.get<PaginatedTransactionsResponse>('/transactions', { params });
    return response.data;
};

/**
 * Get single transaction
 * GET /api/v1/transactions/:id
 */
export const getTransaction = async (
    id: number
): Promise<{ transaction: TransactionResponse }> => {
    const response = await apiClient.get<{ transaction: TransactionResponse }>(
        `/transactions/${id}`
    );
    return response.data;
};

/**
 * Cancel pending transaction
 * POST /api/v1/transactions/:id/cancel
 */
export const cancelTransaction = async (
    id: number
): Promise<{ transaction: TransactionResponse }> => {
    const response = await apiClient.post<{ transaction: TransactionResponse }>(
        `/transactions/${id}/cancel`
    );
    return response.data;
};

/**
 * Sync transaction status from Midtrans
 * POST /api/v1/transactions/:id/sync
 */
export const syncTransaction = async (
    id: number
): Promise<{ transaction: TransactionResponse }> => {
    const response = await apiClient.post<{ transaction: TransactionResponse }>(
        `/transactions/${id}/sync`
    );
    return response.data;
};

/**
 * Get Midtrans client key
 * GET /api/v1/transactions/config/client-key
 */
export const getClientKey = async (): Promise<{ clientKey: string }> => {
    const response = await apiClient.get<{ clientKey: string }>('/transactions/config/client-key');
    return response.data;
};

// =============================================================================
// NAMED EXPORT OBJECT (same pattern as examsApi)
// =============================================================================

export const transactionsApi = {
    createTransaction,
    checkExamAccess,
    getTransactions,
    getTransaction,
    cancelTransaction,
    syncTransaction,
    getClientKey,
};

export default transactionsApi;
