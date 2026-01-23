'use client';

/**
 * Transaction History Page (Riwayat Transaksi)
 *
 * Menampilkan semua riwayat transaksi user dengan filter status.
 * Termasuk aksi untuk transaksi yang masih PENDING.
 *
 * TODO: Connect to useTransactions hook when transaction feature is ready
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
    Package, Search,
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
import {Input} from "@/shared/components/ui/input";

// ============================================================================
// TYPES & CONFIG (akan dipindah ke features/transactions)
// ============================================================================

type TransactionStatus = 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELLED' | 'FAILED' | 'REFUNDED';

interface Transaction {
    id: number;
    orderId: string;
    examId: number;
    amount: number;
    status: TransactionStatus;
    paymentType: string | null;
    createdAt: string;
    paidAt: string | null;
    expiredAt: string | null;
    exam: {
        id: number;
        title: string;
    };
}

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
        color: 'text-yellow-600',
    },
    PAID: {
        label: 'Lunas',
        icon: CheckCircle,
        variant: 'default',
        color: 'text-green-600',
    },
    EXPIRED: {
        label: 'Kedaluwarsa',
        icon: XCircle,
        variant: 'outline',
        color: 'text-gray-500',
    },
    CANCELLED: {
        label: 'Dibatalkan',
        icon: XCircle,
        variant: 'outline',
        color: 'text-gray-500',
    },
    FAILED: {
        label: 'Gagal',
        icon: AlertTriangle,
        variant: 'destructive',
        color: 'text-red-600',
    },
    REFUNDED: {
        label: 'Dikembalikan',
        icon: RotateCcw,
        variant: 'secondary',
        color: 'text-blue-600',
    },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format price to Indonesian Rupiah
 */
function formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);
}

/**
 * Format date to Indonesian locale
 */
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

    // TODO: Replace with actual hook when ready
    // import { useTransactions } from '@/features/transactions/hooks';
    // const { data, isLoading } = useTransactions({
    //     status: statusFilter !== 'all' ? statusFilter : undefined
    // });

    const isLoading = false;
    const transactions: Transaction[] = []; // Will be populated from API

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
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* ========== Filter ========== */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Filter status:</span>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
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

            {/* ========== Loading State ========== */}
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

            {/* ========== Empty State ========== */}
            {!isLoading && transactions.length === 0 && (
                <Card className="text-center py-16">
                    <CardContent>
                        <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                            <Receipt className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-xl mb-2">
                            Belum Ada Transaksi
                        </h3>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                            Anda belum memiliki riwayat transaksi. Mulai dengan membeli paket ujian untuk persiapan CPNS Anda.
                        </p>
                        <Button asChild size="lg">
                            <Link href="/exams">
                                <Package className="mr-2 h-4 w-4" />
                                Lihat Pilihan Paket
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* ========== Transaction List ========== */}
            {!isLoading && transactions.length > 0 && (
                <div className="space-y-4">
                    {transactions.map((tx) => {
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
                                            <div className="flex flex-col gap-2 min-w-[80px]">
                                                {tx.status === 'PENDING' && (
                                                    <>
                                                        <Button size="sm">
                                                            Bayar
                                                        </Button>
                                                        <Button size="sm" variant="ghost" className="text-destructive">
                                                            Batalkan
                                                        </Button>
                                                    </>
                                                )}
                                                {tx.status === 'PAID' && (
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link href={`/exams/${tx.examId}`}>
                                                            <ExternalLink className="h-3 w-3 mr-1" />
                                                            Lihat
                                                        </Link>
                                                    </Button>
                                                )}
                                                {tx.status === 'FAILED' && (
                                                    <Button size="sm" variant="outline">
                                                        Coba Lagi
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

            {/* ========== Stats Footer ========== */}
            {!isLoading && transactions.length > 0 && (
                <div className="mt-8 text-center text-sm text-muted-foreground">
                    Menampilkan {transactions.length} transaksi
                </div>
            )}
        </div>
    );
}
