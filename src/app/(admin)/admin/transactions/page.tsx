/**
 * Admin Transactions Management Page
 *
 * Features:
 * - Transaction statistics cards (total, revenue, today, pending)
 * - List all transactions with pagination
 * - Filter by status
 * - Cleanup expired transactions
 * - View transaction details
 *
 * Backend endpoints:
 * - GET /api/v1/admin/transactions
 * - GET /api/v1/admin/transactions/stats
 * - POST /api/v1/admin/transactions/cleanup
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

import {
    useAdminTransactions,
    useTransactionStats,
    useCleanupExpiredTransactions,
    TransactionStatusBadge,
    formatPrice,
} from '@/features/transactions';
import type {
    TransactionStatus,
    TransactionWithDetails,
} from '@/features/transactions/types/transactions.types';

// UI Components
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
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
import {
    Receipt,
    DollarSign,
    Calendar,
    Clock,
    ChevronLeft,
    ChevronRight,
    Loader2,
    ArrowLeft,
    Trash2,
    Eye,
    AlertCircle,
    Mail,
    CreditCard,
    User as UserIcon,
} from 'lucide-react';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatShortDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

// ============================================================================
// SKELETON COMPONENTS
// ============================================================================

function StatCardSkeleton() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-20 mb-1" />
                <Skeleton className="h-3 w-32" />
            </CardContent>
        </Card>
    );
}

function TableRowSkeleton() {
    return (
        <TableRow>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell>
                <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                </div>
            </TableCell>
            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-6 w-28" /></TableCell>
            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
        </TableRow>
    );
}

// ============================================================================
// TRANSACTION DETAIL DIALOG
// ============================================================================

interface TransactionDetailDialogProps {
    transaction: TransactionWithDetails | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function TransactionDetailDialog({ transaction, open, onOpenChange }: TransactionDetailDialogProps) {
    if (!transaction) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Detail Transaksi</DialogTitle>
                    <DialogDescription>
                        Order ID: {transaction.orderId}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {/* Status */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <TransactionStatusBadge status={transaction.status} />
                    </div>

                    {/* Amount */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Jumlah</span>
                        <span className="font-semibold">{formatPrice(transaction.amount)}</span>
                    </div>

                    {/* User Info */}
                    <div className="border rounded-lg p-3 space-y-2">
                        <p className="text-sm font-medium flex items-center gap-2">
                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                            Pembeli
                        </p>
                        <div className="pl-6 space-y-1">
                            <p className="text-sm">{transaction.user.name}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {transaction.user.email}
                            </p>
                        </div>
                    </div>

                    {/* Exam Info */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Ujian</span>
                        <span className="text-sm">{transaction.exam.title}</span>
                    </div>

                    {/* Payment Type */}
                    {transaction.paymentType && (
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Metode Pembayaran</span>
                            <span className="text-sm flex items-center gap-1">
                                <CreditCard className="h-3 w-3" />
                                {transaction.paymentType}
                            </span>
                        </div>
                    )}

                    {/* Dates */}
                    <div className="border-t pt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Dibuat</span>
                            <span>{formatDate(transaction.createdAt)}</span>
                        </div>
                        {transaction.paidAt && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Dibayar</span>
                                <span>{formatDate(transaction.paidAt)}</span>
                            </div>
                        )}
                        {transaction.expiredAt && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Kedaluwarsa</span>
                                <span>{formatDate(transaction.expiredAt)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function AdminTransactionsPage() {
    // State
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'ALL'>('ALL');
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithDetails | null>(null);
    const [cleanupDialogOpen, setCleanupDialogOpen] = useState(false);

    // Queries
    const {
        transactions,
        pagination,
        isLoading,
        isError,
        refetch,
    } = useAdminTransactions({
        page,
        limit: 10,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        sortOrder: 'desc',
    });

    const {
        data: stats,
        isLoading: statsLoading,
        isError: statsError,
    } = useTransactionStats();

    // Mutations
    const { cleanup, isPending: isCleaningUp } = useCleanupExpiredTransactions({
        onSuccess: (data) => {
            toast.success(`Berhasil membersihkan ${data.expiredCount} transaksi kedaluwarsa`);
            setCleanupDialogOpen(false);
        },
        onError: (error) => {
            toast.error(error.message || 'Gagal membersihkan transaksi');
        },
    });

    // Handlers
    const handleCleanup = () => {
        cleanup();
    };

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Back Navigation */}
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/admin/dashboard">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali ke Dashboard
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="container mx-auto py-8 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Manajemen Transaksi</h1>
                        <p className="text-muted-foreground">
                            Monitor dan kelola semua transaksi sistem
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setCleanupDialogOpen(true)}
                        disabled={isCleaningUp}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Bersihkan Kedaluwarsa
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statsLoading ? (
                        <>
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                        </>
                    ) : statsError ? (
                        <Card className="col-span-full">
                            <CardContent className="flex items-center justify-center py-8">
                                <div className="text-center">
                                    <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                                    <p className="text-muted-foreground">Gagal memuat statistik</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            {/* Total Transactions */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
                                    <Receipt className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats?.total ?? 0}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Semua transaksi tercatat
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Total Revenue */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {formatPrice(stats?.totalRevenue ?? 0)}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Dari transaksi lunas
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Today's Revenue */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Pendapatan Hari Ini</CardTitle>
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {formatPrice(stats?.todayRevenue ?? 0)}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Transaksi lunas hari ini
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Pending */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Menunggu Pembayaran</CardTitle>
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {stats?.byStatus?.PENDING ?? 0}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Transaksi pending
                                    </p>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                {/* Filter */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Select
                                value={statusFilter}
                                onValueChange={(value: TransactionStatus | 'ALL') => {
                                    setStatusFilter(value);
                                    setPage(1);
                                }}
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Filter status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Semua Status</SelectItem>
                                    <SelectItem value="PENDING">Menunggu Pembayaran</SelectItem>
                                    <SelectItem value="PAID">Lunas</SelectItem>
                                    <SelectItem value="EXPIRED">Kedaluwarsa</SelectItem>
                                    <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                                    <SelectItem value="FAILED">Gagal</SelectItem>
                                    <SelectItem value="REFUNDED">Dikembalikan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Transactions Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Receipt className="h-5 w-5" />
                            Daftar Transaksi
                        </CardTitle>
                        <CardDescription>
                            {pagination ? `Total ${pagination.total} transaksi` : 'Memuat...'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order ID</TableHead>
                                            <TableHead>User</TableHead>
                                            <TableHead>Ujian</TableHead>
                                            <TableHead>Jumlah</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Pembayaran</TableHead>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead className="w-[60px]">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <TableRowSkeleton key={i} />
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : isError ? (
                            <div className="text-center py-8">
                                <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                                <p className="text-muted-foreground">Gagal memuat data</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => refetch()}
                                >
                                    Coba Lagi
                                </Button>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Receipt className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>Tidak ada transaksi ditemukan</p>
                            </div>
                        ) : (
                            <>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Order ID</TableHead>
                                                <TableHead>User</TableHead>
                                                <TableHead>Ujian</TableHead>
                                                <TableHead>Jumlah</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Pembayaran</TableHead>
                                                <TableHead>Tanggal</TableHead>
                                                <TableHead className="w-[60px]">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {transactions.map((tx) => (
                                                <TableRow key={tx.id}>
                                                    <TableCell className="font-mono text-xs">
                                                        {tx.orderId}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-medium">{tx.user.name}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {tx.user.email}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="max-w-[200px]">
                                                        <p className="truncate" title={tx.exam.title}>
                                                            {tx.exam.title}
                                                        </p>
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {formatPrice(tx.amount)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <TransactionStatusBadge status={tx.status} />
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {tx.paymentType || '-'}
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground text-sm">
                                                        {formatShortDate(tx.createdAt)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setSelectedTransaction(tx)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                {pagination && pagination.totalPages > 1 && (
                                    <div className="flex items-center justify-between mt-4">
                                        <p className="text-sm text-muted-foreground">
                                            Halaman {pagination.page} dari {pagination.totalPages}
                                        </p>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setPage(page - 1)}
                                                disabled={!pagination.hasPrev}
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setPage(page + 1)}
                                                disabled={!pagination.hasNext}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Transaction Detail Dialog */}
            <TransactionDetailDialog
                transaction={selectedTransaction}
                open={!!selectedTransaction}
                onOpenChange={(open) => !open && setSelectedTransaction(null)}
            />

            {/* Cleanup Confirmation Dialog */}
            <AlertDialog open={cleanupDialogOpen} onOpenChange={setCleanupDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bersihkan Transaksi Kedaluwarsa?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan menandai semua transaksi PENDING yang sudah melewati
                            waktu kedaluwarsa menjadi EXPIRED. Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isCleaningUp}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCleanup}
                            disabled={isCleaningUp}
                        >
                            {isCleaningUp && (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            )}
                            Ya, Bersihkan
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
