'use client';

/**
 * Transaction History Page (Riwayat Transaksi)
 *
 * Menampilkan semua riwayat transaksi user dengan filter status.
 * Termasuk aksi untuk transaksi yang masih PENDING.
 */

import { useState } from 'react';
import Link from 'next/link';
import {
    Receipt,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    RotateCcw,
    Filter,
    ExternalLink,
    CreditCard,
    Package,
    Search,
    ChevronLeft,
    ChevronRight,
    Loader2,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Badge } from '@/shared/components/ui/badge';
import { PageHeaderTitle } from '@/shared/components/PageHeaderTitle';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { toast } from 'sonner';

import {
    useTransactions,
    useCancelTransaction,
    useRetryPayment,
} from '@/features/transactions';
import type {
    TransactionStatus,
    TransactionResponse,
} from '@/features/transactions/types/transactions.types';

// ============================================================================
// STATUS CONFIG
// ============================================================================

const STATUS_CONFIG: Record<TransactionStatus, {
    label: string;
    icon: typeof Clock;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    color: string;
}> = {
    PENDING: {
        label: 'Menunggu Pembayaran',
        icon: Clock,
        variant: 'secondary',
        color: 'text-warning',
    },
    PAID: {
        label: 'Lunas',
        icon: CheckCircle,
        variant: 'default',
        color: 'text-success',
    },
    EXPIRED: {
        label: 'Kedaluwarsa',
        icon: XCircle,
        variant: 'outline',
        color: 'text-muted-foreground',
    },
    CANCELLED: {
        label: 'Dibatalkan',
        icon: XCircle,
        variant: 'outline',
        color: 'text-muted-foreground',
    },
    FAILED: {
        label: 'Gagal',
        icon: AlertTriangle,
        variant: 'destructive',
        color: 'text-destructive',
    },
    REFUNDED: {
        label: 'Dikembalikan',
        icon: RotateCcw,
        variant: 'secondary',
        color: 'text-info',
    },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function TransactionsPage() {
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionResponse | null>(null);

    // Fetch transactions
    const {
        transactions,
        pagination,
        isLoading,
        isError,
        error,
    } = useTransactions({
        page,
        limit: 10,
        status: statusFilter !== 'all' ? statusFilter as TransactionStatus : undefined,
        sortOrder: 'desc',
    });

    // Cancel transaction mutation
    const { cancelTransaction, isPending: isCancelling } = useCancelTransaction({
        onSuccess: () => {
            toast.success('Transaksi berhasil dibatalkan');
            setCancelDialogOpen(false);
            setSelectedTransaction(null);
        },
        onError: (err) => {
            toast.error(err.message || 'Gagal membatalkan transaksi');
        },
    });

    // Retry payment hook
    const { retryPayment, isPending: isRetrying } = useRetryPayment({
        onPaymentSuccess: () => {
            toast.success('Pembayaran berhasil!');
        },
        onPaymentPending: () => {
            toast.info('Menunggu konfirmasi pembayaran');
        },
        onPaymentError: () => {
            toast.error('Pembayaran gagal');
        },
        onPaymentClose: () => {
            // User closed without completing payment
        },
    });

    // Client-side search filter
    const filteredTransactions = transactions.filter((tx) =>
        tx.exam.title.toLowerCase().includes(search.toLowerCase())
    );

    // Handle cancel transaction
    const handleCancelClick = (tx: TransactionResponse) => {
        setSelectedTransaction(tx);
        setCancelDialogOpen(true);
    };

    const confirmCancel = () => {
        if (selectedTransaction) {
            cancelTransaction(selectedTransaction.id);
        }
    };

    // Handle retry payment
    const handlePayClick = (tx: TransactionResponse) => {
        retryPayment(tx.id, tx.snapToken);
    };

    // Pagination helpers
    const totalPages = pagination?.totalPages ?? 1;
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return (
        <div className="container mx-auto py-8 space-y-6">
            <PageHeaderTitle title="Riwayat Transaksi" />

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari ujian..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Filter */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Filter status:</span>
                </div>
                <Select
                    value={statusFilter}
                    onValueChange={(value) => {
                        setStatusFilter(value);
                        setPage(1); // Reset to first page on filter change
                    }}
                >
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Semua Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="PENDING">Menunggu Pembayaran</SelectItem>
                        <SelectItem value="PAID">Lunas</SelectItem>
                        <SelectItem value="EXPIRED">Kedaluwarsa</SelectItem>
                        <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                        <SelectItem value="FAILED">Gagal</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i}>
                            <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-48" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right space-y-2">
                                            <Skeleton className="h-5 w-24" />
                                            <Skeleton className="h-6 w-28" />
                                        </div>
                                        <Skeleton className="h-9 w-20" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Error State */}
            {isError && (
                <Card className="text-center py-16">
                    <CardContent>
                        <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
                            <AlertTriangle className="h-10 w-10 text-destructive" />
                        </div>
                        <h3 className="font-semibold text-xl mb-2">
                            Gagal Memuat Transaksi
                        </h3>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                            {error?.message || 'Terjadi kesalahan saat memuat riwayat transaksi.'}
                        </p>
                        <Button onClick={() => window.location.reload()}>
                            Coba Lagi
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Empty State */}
            {!isLoading && !isError && filteredTransactions.length === 0 && (
                <Card className="text-center py-16">
                    <CardContent>
                        <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                            <Receipt className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-xl mb-2">
                            {search ? 'Tidak Ada Hasil' : 'Belum Ada Transaksi'}
                        </h3>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                            {search
                                ? `Tidak ditemukan transaksi untuk "${search}".`
                                : 'Anda belum memiliki riwayat transaksi. Mulai dengan membeli paket ujian untuk persiapan CPNS Anda.'}
                        </p>
                        {!search && (
                            <Button asChild size="lg">
                                <Link href="/exams">
                                    <Package className="mr-2 h-4 w-4" />
                                    Lihat Pilihan Paket
                                </Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Transaction List */}
            {!isLoading && !isError && filteredTransactions.length > 0 && (
                <div className="space-y-4">
                    {filteredTransactions.map((tx) => {
                        const statusInfo = STATUS_CONFIG[tx.status];
                        const StatusIcon = statusInfo.icon;

                        return (
                            <Card key={tx.id} className="hover:shadow-sm transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        {/* Left: Transaction Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold line-clamp-1">
                                                {tx.exam.title}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-muted-foreground">
                                                <span>{formatDate(tx.createdAt)}</span>
                                                {tx.paymentType && (
                                                    <span className="flex items-center gap-1">
                                                        <CreditCard className="h-3 w-3" />
                                                        {tx.paymentType}
                                                    </span>
                                                )}
                                                <span className="text-xs">
                                                    #{tx.orderId}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right: Price, Status & Actions */}
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="font-semibold">
                                                    {formatPrice(tx.amount)}
                                                </p>
                                                <Badge variant={statusInfo.variant} className="mt-1">
                                                    <StatusIcon className={`h-3 w-3 mr-1 ${statusInfo.color}`} />
                                                    {statusInfo.label}
                                                </Badge>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-col gap-2 min-w-[100px]">
                                                {tx.status === 'PENDING' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handlePayClick(tx)}
                                                            disabled={isRetrying}
                                                        >
                                                            {isRetrying ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                'Bayar Sekarang'
                                                            )}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() => handleCancelClick(tx)}
                                                            disabled={isCancelling}
                                                        >
                                                            Batalkan
                                                        </Button>
                                                    </>
                                                )}
                                                {tx.status === 'PAID' && (
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link href={`/exams/${tx.examId}`}>
                                                            <ExternalLink className="h-3 w-3 mr-1" />
                                                            Lihat Ujian
                                                        </Link>
                                                    </Button>
                                                )}
                                                {(tx.status === 'EXPIRED' || tx.status === 'CANCELLED' || tx.status === 'FAILED') && (
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link href={`/exams/${tx.examId}`}>
                                                            Beli Lagi
                                                        </Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {!isLoading && !isError && pagination && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={!hasPrevPage}
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Sebelumnya
                    </Button>
                    <span className="text-sm text-muted-foreground px-4">
                        Halaman {page} dari {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={!hasNextPage}
                    >
                        Selanjutnya
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            )}

            {/* Stats Footer */}
            {!isLoading && !isError && transactions.length > 0 && (
                <div className="mt-8 text-center text-sm text-muted-foreground">
                    Menampilkan {filteredTransactions.length} dari {pagination?.total ?? transactions.length} transaksi
                </div>
            )}

            {/* Cancel Confirmation Dialog */}
            <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Batalkan Transaksi?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin membatalkan transaksi untuk{' '}
                            <strong>{selectedTransaction?.exam.title}</strong>?
                            Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isCancelling}>
                            Kembali
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmCancel}
                            disabled={isCancelling}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isCancelling ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Membatalkan...
                                </>
                            ) : (
                                'Ya, Batalkan'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
