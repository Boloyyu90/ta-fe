/**
 * Admin Questions Bank Page
 *
 * ✅ FIXED:
 * - Use `questionType` instead of `type` in query params
 * - Use `question.questionType` instead of `question.type`
 * - Remove `imageUrl` display (not on QuestionWithUsage type)
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useQuestions, useDeleteQuestion } from '@/features/questions/hooks';
import type { QuestionType } from '@/shared/types/enum.types';
import type { QuestionWithUsage } from '@/features/questions/types/questions.types';

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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
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
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Loader2,
    HelpCircle,
    ArrowLeft,
} from 'lucide-react';

// Question type badge configuration
const typeConfig: Record<QuestionType, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
    TIU: { label: 'TIU', variant: 'default' },
    TWK: { label: 'TWK', variant: 'secondary' },
    TKP: { label: 'TKP', variant: 'outline' },
};

export default function AdminQuestionsPage() {
    // State
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<QuestionType | 'ALL'>('ALL');
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(timer);
    }, [search]);

    // Queries & Mutations - ✅ FIX: Use `questionType` instead of `type`
    const { data, isLoading, isError } = useQuestions({
        page,
        limit: 15,
        search: debouncedSearch || undefined,
        questionType: typeFilter === 'ALL' ? undefined : typeFilter,
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });

    const deleteMutation = useDeleteQuestion();

    // Handle delete
    const handleDelete = useCallback(async () => {
        if (!deletingId) return;
        try {
            await deleteMutation.mutateAsync(deletingId);
            toast.success('Soal berhasil dihapus');
            setDeletingId(null);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { errorCode?: string }; status?: number } };
            const errorCode = err?.response?.data?.errorCode;
            let message = 'Gagal menghapus soal';

            if (errorCode === 'QUESTION_IN_USE' || err?.response?.status === 409) {
                message = 'Soal tidak dapat dihapus karena sedang digunakan dalam ujian';
            }

            toast.error(message);
        }
    }, [deletingId, deleteMutation]);

    // Extract data
    const questions = data?.data || [];
    const pagination = data?.pagination;

    // Truncate text helper
    const truncateText = (text: string, maxLength: number = 100) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    // ✅ FIX: Helper to count questions by type using `questionType`
    const countByType = (type: QuestionType): number => {
        return questions.filter((q: QuestionWithUsage) => q.questionType === type).length;
    };

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Back Navigation */}
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/admin/dashboard">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="container mx-auto py-8 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <BookOpen className="h-8 w-8 text-primary" />
                        Bank Soal
                    </h1>
                    <p className="text-muted-foreground">
                        Kelola soal untuk ujian
                    </p>
                </div>
                <Link href="/admin/questions/create">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Soal
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Soal</CardTitle>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pagination?.total || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">TIU</CardTitle>
                        <Badge variant="default">TIU</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {countByType('TIU')}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">TWK</CardTitle>
                        <Badge variant="secondary">TWK</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {countByType('TWK')}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">TKP</CardTitle>
                        <Badge variant="outline">TKP</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {countByType('TKP')}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari isi soal..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="pl-10"
                            />
                        </div>
                        <Select
                            value={typeFilter}
                            onValueChange={(value: QuestionType | 'ALL') => {
                                setTypeFilter(value);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter tipe" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Semua Tipe</SelectItem>
                                <SelectItem value="TIU">TIU</SelectItem>
                                <SelectItem value="TWK">TWK</SelectItem>
                                <SelectItem value="TKP">TKP</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Questions Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Soal</CardTitle>
                    <CardDescription>
                        {pagination ? `Total ${pagination.total} soal` : 'Memuat...'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Gagal memuat data. Silakan coba lagi.
                        </div>
                    ) : questions.length === 0 ? (
                        <div className="text-center py-12">
                            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Belum Ada Soal</h3>
                            <p className="text-muted-foreground mb-4">
                                Mulai dengan membuat soal baru
                            </p>
                            <Link href="/admin/questions/create">
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Tambah Soal
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">ID</TableHead>
                                            <TableHead>Soal</TableHead>
                                            <TableHead className="w-[100px]">Tipe</TableHead>
                                            <TableHead className="w-[100px]">Jawaban</TableHead>
                                            <TableHead className="w-[80px]">Skor</TableHead>
                                            <TableHead className="w-[120px]">Dibuat</TableHead>
                                            <TableHead className="w-[80px]">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {questions.map((question: QuestionWithUsage) => (
                                            <TableRow key={question.id}>
                                                <TableCell className="font-mono text-xs">
                                                    #{question.id}
                                                </TableCell>
                                                <TableCell>
                                                    <p className="text-sm max-w-md">
                                                        {truncateText(question.content, 80)}
                                                    </p>
                                                </TableCell>
                                                <TableCell>
                                                    {/* ✅ FIX: Use questionType */}
                                                    <Badge variant={typeConfig[question.questionType]?.variant || 'outline'}>
                                                        {typeConfig[question.questionType]?.label || question.questionType}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="font-mono">
                                                        {question.correctAnswer}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm text-muted-foreground">
                                                        {question.defaultScore}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-xs">
                                                    {formatDate(question.createdAt)}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" aria-label="Menu aksi">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <Link href={`/admin/questions/${question.id}`}>
                                                                <DropdownMenuItem>
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    Lihat
                                                                </DropdownMenuItem>
                                                            </Link>
                                                            <Link href={`/admin/questions/${question.id}/edit`}>
                                                                <DropdownMenuItem>
                                                                    <Edit className="h-4 w-4 mr-2" />
                                                                    Edit
                                                                </DropdownMenuItem>
                                                            </Link>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => setDeletingId(question.id)}
                                                                className="text-destructive"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
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

            {/* Delete Confirmation */}
            <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Soal?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Soal akan dihapus secara permanen.
                            Soal yang sedang digunakan dalam ujian tidak dapat dihapus.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteMutation.isPending && (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            )}
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            </div>
        </div>
    );
}