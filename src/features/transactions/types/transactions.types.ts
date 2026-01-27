/**
 * Transaction Types
 *
 * Match backend responses exactly.
 * Reuse existing patterns from exam-sessions.types.ts
 */

import type { PaginationMeta } from '@/shared/types/api.types';

// =============================================================================
// STATUS ENUM & CONFIG (Following exam-sessions pattern)
// =============================================================================

export type TransactionStatus =
    | 'PENDING'
    | 'PAID'
    | 'EXPIRED'
    | 'CANCELLED'
    | 'FAILED'
    | 'REFUNDED';

/**
 * Status configuration for UI display
 * Pattern: Same as statusConfig in UserExamCard.tsx
 */
export const transactionStatusConfig: Record<
    TransactionStatus,
    {
        label: string;
        variant: 'default' | 'secondary' | 'destructive' | 'outline';
        icon: string; // Icon name from lucide-react
    }
> = {
    PENDING: {
        label: 'Menunggu Pembayaran',
        variant: 'secondary',
        icon: 'Clock',
    },
    PAID: {
        label: 'Lunas',
        variant: 'default',
        icon: 'CheckCircle',
    },
    EXPIRED: {
        label: 'Kedaluwarsa',
        variant: 'outline',
        icon: 'XCircle',
    },
    CANCELLED: {
        label: 'Dibatalkan',
        variant: 'outline',
        icon: 'XCircle',
    },
    FAILED: {
        label: 'Gagal',
        variant: 'destructive',
        icon: 'AlertTriangle',
    },
    REFUNDED: {
        label: 'Dikembalikan',
        variant: 'secondary',
        icon: 'RotateCcw',
    },
};

// =============================================================================
// RESPONSE TYPES (Match backend exactly)
// =============================================================================

/**
 * Transaction response
 * Source: backend transactions.types.ts TransactionResponse
 */
export interface TransactionResponse {
    id: number;
    orderId: string;
    userId: number;
    examId: number;
    amount: number;
    status: TransactionStatus;
    paymentType: string | null;
    snapToken: string | null;
    snapRedirectUrl: string | null;
    paidAt: string | null;
    expiredAt: string | null;
    metadata: Record<string, unknown> | null;
    createdAt: string;
    updatedAt: string;
    exam: {
        id: number;
        title: string;
        price: number | null;
    };
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

/**
 * Create transaction response (includes Snap token)
 * Source: backend CreateTransactionResponse
 */
export interface CreateTransactionResponse {
    transaction: TransactionResponse;
    snapToken: string;
    snapRedirectUrl: string;
    clientKey: string;
}

/**
 * Exam access check response
 * Source: backend ExamAccessResponse
 *
 * CRITICAL: This is the key type for exam detail page integration
 */
export interface ExamAccessResponse {
    hasAccess: boolean;
    reason: 'free' | 'paid' | 'pending' | 'not_purchased';
    transaction: TransactionResponse | null;
    exam: {
        id: number;
        title: string;
        price: number | null;
    };
}

/**
 * List transactions query params
 * Source: backend ListTransactionsQuery
 */
export interface ListTransactionsParams {
    page?: number;
    limit?: number;
    status?: TransactionStatus;
    examId?: number;
    sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated transactions response
 * Reuse PaginationMeta from @/shared/types/api.types.ts
 */
export interface PaginatedTransactionsResponse {
    transactions: TransactionResponse[];
    pagination: PaginationMeta;
}

// =============================================================================
// MIDTRANS TYPES
// =============================================================================

export interface MidtransResult {
    order_id: string;
    transaction_status: string;
    status_code: string;
    status_message: string;
    payment_type?: string;
}

export interface MidtransSnapCallbacks {
    onSuccess?: (result: MidtransResult) => void;
    onPending?: (result: MidtransResult) => void;
    onError?: (result: MidtransResult) => void;
    onClose?: () => void;
}

// Extend Window for Midtrans Snap
declare global {
    interface Window {
        snap?: {
            pay: (token: string, callbacks?: MidtransSnapCallbacks) => void;
            hide: () => void;
        };
    }
}

// =============================================================================
// ADMIN TYPES
// =============================================================================

/**
 * Transaction statistics response (admin)
 * GET /api/v1/admin/transactions/stats
 */
export interface TransactionStatsResponse {
    total: number;
    byStatus: Record<TransactionStatus, number>;
    totalRevenue: number;
    todayRevenue: number;
}

/**
 * Transaction with user details (admin view)
 * Admin endpoints always include user info
 */
export interface TransactionWithDetails extends TransactionResponse {
    user: {
        id: number;
        name: string;
        email: string;
    };
}

/**
 * Admin list transactions params
 * Extends participant params with additional admin filters
 */
export interface AdminListTransactionsParams extends ListTransactionsParams {
    userId?: number;
    search?: string;
}

/**
 * Paginated admin transactions response
 */
export interface PaginatedAdminTransactionsResponse {
    transactions: TransactionWithDetails[];
    pagination: PaginationMeta;
}

/**
 * Cleanup expired transactions response
 */
export interface CleanupExpiredResponse {
    expiredCount: number;
}
