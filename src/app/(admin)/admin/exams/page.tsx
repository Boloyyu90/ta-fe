// src/app/(admin)/admin/exams/page.tsx

/**
 * Admin Exams List Page
 *
 * Features:
 * - List all exams with pagination
 * - Search by title
 * - Show exam metadata (title, description, duration, passing score, status, questions)
 * - Actions: view details, edit, delete
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
    useAdminExams,
    useDeleteExam,
} from '@/features/exams/hooks';
import { formatDuration, getExamAvailabilityStatus } from '@/features/exams/types/exams.types';
import type { Exam } from '@/features/exams/types/exams.types';

// UI Components
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
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
    Plus,
    Search,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    FileText,
    Clock,
    Target,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Loader2,
} from 'lucide-react';

// Status badge configuration
const statusConfig: Record<ReturnType<typeof getExamAvailabilityStatus>, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
    available: { label: 'Tersedia', variant: 'default' },
    upcoming: { label: 'Akan Datang', variant: 'secondary' },
    ended: { label: 'Berakhir', variant: 'outline' },
    'no-questions': { label: 'Belum Ada Soal', variant: 'destructive' },
};

export default function AdminExamsPage() {
    const router = useRouter();

    // State
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [deleteExamId, setDeleteExamId] = useState<number | null>(null);

    // Queries & Mutations
    const { data: exams, pagination, isLoading, isError, error, refetch } = useAdminExams({
        page,
        limit: 10,
        search: search || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });

    const deleteMutation = useDeleteExam();

    // Handlers
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    const handleClearSearch = () => {
        setSearchInput('');
        setSearch('');
        setPage(1);
    };

    const handleDelete = async () => {
        if (!deleteExamId) return;

        try {
            await deleteMutation.mutateAsync(deleteExamId);
            toast.success('Ujian berhasil dihapus');
            setDeleteExamId(null);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : '';
            if (errorMessage.includes('409') || errorMessage.includes('participant')) {
                toast.error('Tidak dapat menghapus ujian yang sudah memiliki peserta');
            } else {
                toast.error(errorMessage || 'Gagal menghapus ujian');
            }
        }
    };

    const formatDateTime = (dateStr: string | null): string => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleString('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-muted/30">
                <div className="bg-background border-b border-border">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-9 w-48" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>
                </div>
                <div className="container mx-auto px-4 py-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Skeleton key={i} className="h-16 w-full" />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="min-h-screen bg-muted/30">
                <div className="container mx-auto px-4 py-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-center py-8">
                                <p className="text-destructive mb-4">
                                    Gagal memuat daftar ujian: {error?.message}
                                </p>
                                <Button onClick={() => refetch()}>Coba Lagi</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Manajemen Ujian</h1>
                            <p className="text-muted-foreground mt-1">
                                Kelola ujian dan soal-soalnya
                            </p>
                        </div>
                        <Link href="/admin/exams/create">
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Buat Ujian
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Daftar Ujian</CardTitle>
                                <CardDescription>
                                    {pagination?.total || 0} ujian ditemukan
                                </CardDescription>
                            </div>

                            {/* Search */}
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari judul ujian..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        className="pl-10 w-64"
                                    />
                                </div>
                                <Button type="submit" variant="secondary">
                                    Cari
                                </Button>
                                {search && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={handleClearSearch}
                                    >
                                        Reset
                                    </Button>
                                )}
                            </form>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {/* Table */}
                        {exams && exams.length > 0 ? (
                            <>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[300px]">Judul</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Durasi</TableHead>
                                                <TableHead>Passing Score</TableHead>
                                                <TableHead>Soal</TableHead>
                                                <TableHead>Waktu</TableHead>
                                                <TableHead className="w-[70px]">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {exams.map((exam) => {
                                                const status = getExamAvailabilityStatus(exam);
                                                const statusStyle = statusConfig[status];

                                                return (
                                                    <TableRow key={exam.id}>
                                                        <TableCell>
                                                            <div className="space-y-1">
                                                                <Link
                                                                    href={`/admin/exams/${exam.id}`}
                                                                    className="font-medium hover:underline"
                                                                >
                                                                    {exam.title}
                                                                </Link>
                                                                {exam.description && (
                                                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                                                        {exam.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={statusStyle.variant}>
                                                                {statusStyle.label}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-1 text-sm">
                                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                                {formatDuration(exam.durationMinutes)}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-1 text-sm">
                                                                <Target className="h-4 w-4 text-muted-foreground" />
                                                                {exam.passingScore}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-1 text-sm">
                                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                                {exam._count?.examQuestions ?? 0} soal
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-sm space-y-1">
                                                                {exam.startTime && (
                                                                    <div className="flex items-center gap-1">
                                                                        <Calendar className="h-3 w-3 text-muted-foreground" />
                                                                        <span className="text-muted-foreground">
                                                                            Mulai: {formatDateTime(exam.startTime)}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {exam.endTime && (
                                                                    <div className="flex items-center gap-1">
                                                                        <Calendar className="h-3 w-3 text-muted-foreground" />
                                                                        <span className="text-muted-foreground">
                                                                            Selesai: {formatDateTime(exam.endTime)}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {!exam.startTime && !exam.endTime && (
                                                                    <span className="text-muted-foreground">Selalu tersedia</span>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem
                                                                        onClick={() => router.push(`/admin/exams/${exam.id}`)}
                                                                    >
                                                                        <Eye className="h-4 w-4 mr-2" />
                                                                        Lihat Detail
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => router.push(`/admin/exams/${exam.id}/edit`)}
                                                                    >
                                                                        <Edit className="h-4 w-4 mr-2" />
                                                                        Edit
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        onClick={() => setDeleteExamId(exam.id)}
                                                                        className="text-destructive"
                                                                    >
                                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                                        Hapus
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
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
                                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                                disabled={!pagination.hasPrev}
                                            >
                                                <ChevronLeft className="h-4 w-4 mr-1" />
                                                Sebelumnya
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setPage((p) => p + 1)}
                                                disabled={!pagination.hasNext}
                                            >
                                                Selanjutnya
                                                <ChevronRight className="h-4 w-4 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">Belum Ada Ujian</h3>
                                <p className="text-muted-foreground mb-4">
                                    {search
                                        ? 'Tidak ada ujian yang cocok dengan pencarian'
                                        : 'Mulai dengan membuat ujian pertama'}
                                </p>
                                {!search && (
                                    <Link href="/admin/exams/create">
                                        <Button>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Buat Ujian
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteExamId !== null} onOpenChange={() => setDeleteExamId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Ujian?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ujian beserta semua soal yang terkait akan dihapus secara permanen.
                            Ujian yang sudah memiliki peserta tidak dapat dihapus.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteMutation.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Menghapus...
                                </>
                            ) : (
                                'Hapus'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}