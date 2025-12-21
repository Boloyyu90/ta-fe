/**
 * Admin Exam Detail Page
 *
 * Features:
 * - View exam metadata
 * - List attached questions
 * - Attach/detach questions
 * - Navigate to edit page
 */

'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import {
    useAdminExam,
    useExamQuestions,
    useAttachQuestions,
    useDetachQuestions,
    useDeleteExam,
} from '@/features/exams/hooks';
import { useQuestions } from '@/features/questions/hooks';
import { formatDuration, getExamAvailabilityStatus } from '@/features/exams/types/exams.types';
import { getErrorMessage } from '@/shared/lib/errors';

// UI Components
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Separator } from '@/shared/components/ui/separator';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/components/ui/table';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Plus,
    Minus,
    Clock,
    Target,
    Calendar,
    FileText,
    Users,
    Loader2,
    Search,
    CheckCircle2,
} from 'lucide-react';

interface PageProps {
    params: Promise<{ id: string }>;
}

// Status badge configuration
const statusConfig = {
    available: { label: 'Tersedia', variant: 'default' as const },
    upcoming: { label: 'Akan Datang', variant: 'secondary' as const },
    ended: { label: 'Berakhir', variant: 'outline' as const },
    'no-questions': { label: 'Belum Ada Soal', variant: 'destructive' as const },
};

// Question type badge config
const questionTypeConfig = {
    TIU: { label: 'TIU', variant: 'default' as const },
    TWK: { label: 'TWK', variant: 'secondary' as const },
    TKP: { label: 'TKP', variant: 'outline' as const },
};

export default function AdminExamDetailPage({ params }: PageProps) {
    const router = useRouter();
    const resolvedParams = use(params);
    const examId = parseInt(resolvedParams.id, 10);

    // State
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
    const [questionsToDetach, setQuestionsToDetach] = useState<number[]>([]);
    const [questionSearch, setQuestionSearch] = useState('');

    // Queries
    const { data: examData, isLoading: examLoading, isError: examError, error: examErrorMsg } = useAdminExam(examId);
    const { data: examQuestionsData, isLoading: questionsLoading } = useExamQuestions(examId);
    const { data: allQuestionsData, isLoading: allQuestionsLoading } = useQuestions({
        page: 1,
        limit: 100,
        search: questionSearch || undefined,
    });

    // Mutations
    const attachMutation = useAttachQuestions();
    const detachMutation = useDetachQuestions();
    const deleteMutation = useDeleteExam();

    const exam = examData?.exam;
    const examQuestions = examQuestionsData?.questions ?? [];
    const totalQuestions = examQuestionsData?.total ?? 0;
    const allQuestions = allQuestionsData?.data || [];

    // Filter out already attached questions from available questions
    const attachedQuestionIds = new Set(examQuestions.map((eq) => eq.question.id));
    const availableQuestions = allQuestions.filter((q) => !attachedQuestionIds.has(q.id));

    // Handlers
    const handleAttachQuestions = async () => {
        if (selectedQuestionIds.length === 0) {
            toast.error('Pilih minimal satu soal');
            return;
        }

        try {
            await attachMutation.mutateAsync({
                examId,
                data: { questionIds: selectedQuestionIds },
            });
            toast.success(`${selectedQuestionIds.length} soal berhasil ditambahkan`);
            setSelectedQuestionIds([]);
            setShowAddDialog(false);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Gagal menambahkan soal';
            toast.error(errorMessage);
        }
    };

    const handleDetachQuestions = async () => {
        if (questionsToDetach.length === 0) return;

        try {
            await detachMutation.mutateAsync({
                examId,
                data: { questionIds: questionsToDetach },
            });
            toast.success(`${questionsToDetach.length} soal berhasil dihapus dari ujian`);
            setQuestionsToDetach([]);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Gagal menghapus soal';
            toast.error(errorMessage);
        }
    };

    const handleDeleteExam = async () => {
        try {
            await deleteMutation.mutateAsync(examId);
            toast.success('Ujian berhasil dihapus');
            router.push('/admin/exams');
        } catch (error: unknown) {
            const err = error as {
                response?: {
                    data?: {
                        errorCode?: string;
                        message?: string;
                    };
                    status?: number;
                };
            };

            const errorCode = err?.response?.data?.errorCode;
            const backendMessage = err?.response?.data?.message;
            const statusCode = err?.response?.status;

            // Handle 409 Conflict - Exam has participant attempts
            if (statusCode === 409 || errorCode?.includes('EXAM') || errorCode?.includes('ATTEMPTS')) {
                toast.error('Ujian tidak dapat dihapus karena sudah ada peserta yang mengikuti');
                return;
            }

            // Try to get Indonesian message for error code
            if (errorCode) {
                const message = getErrorMessage(errorCode);
                if (message !== 'Terjadi kesalahan') {
                    toast.error(message);
                    return;
                }
            }

            // Fallback to generic error
            const message = backendMessage || 'Gagal menghapus ujian';
            toast.error(message);
        } finally {
            setShowDeleteDialog(false);
        }
    };

    const toggleQuestionSelection = (questionId: number) => {
        setSelectedQuestionIds((prev) =>
            prev.includes(questionId)
                ? prev.filter((id) => id !== questionId)
                : [...prev, questionId]
        );
    };

    const toggleDetachSelection = (questionId: number) => {
        setQuestionsToDetach((prev) =>
            prev.includes(questionId)
                ? prev.filter((id) => id !== questionId)
                : [...prev, questionId]
        );
    };

    const selectAllAvailable = () => {
        setSelectedQuestionIds(availableQuestions.map((q) => q.id));
    };

    const clearSelection = () => {
        setSelectedQuestionIds([]);
    };

    const formatDateTime = (dateStr: string | null): string => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleString('id-ID', {
            dateStyle: 'full',
            timeStyle: 'short',
        });
    };

    // Loading state
    if (examLoading) {
        return (
            <div className="min-h-screen bg-muted/30">
                <div className="bg-background border-b border-border">
                    <div className="container mx-auto px-4 py-6">
                        <Skeleton className="h-8 w-64" />
                    </div>
                </div>
                <div className="container mx-auto px-4 py-8 space-y-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        );
    }

    // Error state
    if (examError || !exam) {
        return (
            <div className="min-h-screen bg-muted/30">
                <div className="container mx-auto px-4 py-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-center py-8">
                                <p className="text-destructive mb-4">
                                    Gagal memuat data ujian: {examErrorMsg?.message || 'Ujian tidak ditemukan'}
                                </p>
                                <Link href="/admin/exams">
                                    <Button variant="outline">
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Kembali ke Daftar
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const status = getExamAvailabilityStatus(exam);
    const statusStyle = statusConfig[status];

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/admin/exams">
                                <Button variant="ghost" size="icon">
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            </Link>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl font-bold">{exam.title}</h1>
                                    <Badge variant={statusStyle.variant}>{statusStyle.label}</Badge>
                                </div>
                                <p className="text-muted-foreground">ID: {exam.id}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Link href={`/admin/exams/${examId}/edit`}>
                                <Button variant="outline">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                            </Link>
                            <Button
                                variant="destructive"
                                onClick={() => setShowDeleteDialog(true)}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Hapus
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8 space-y-6">
                {/* Exam Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Ujian</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span className="text-sm">Durasi</span>
                                </div>
                                <p className="font-medium">{formatDuration(exam.durationMinutes)}</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Target className="h-4 w-4" />
                                    <span className="text-sm">Passing Score</span>
                                </div>
                                <p className="font-medium">{exam.passingScore}</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <FileText className="h-4 w-4" />
                                    <span className="text-sm">Jumlah Soal</span>
                                </div>
                                <p className="font-medium">{exam._count?.examQuestions ?? 0} soal</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span className="text-sm">Peserta</span>
                                </div>
                                <p className="font-medium">{exam._count?.userExams ?? 0} peserta</p>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span className="text-sm">Waktu Mulai</span>
                                </div>
                                <p className="font-medium">{formatDateTime(exam.startTime)}</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span className="text-sm">Waktu Selesai</span>
                                </div>
                                <p className="font-medium">{formatDateTime(exam.endTime)}</p>
                            </div>
                        </div>

                        {exam.description && (
                            <>
                                <Separator className="my-6" />
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">Deskripsi</p>
                                    <p>{exam.description}</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Questions Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Soal Ujian</CardTitle>
                                <CardDescription>
                                    {examQuestions.length} soal terpasang
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                {questionsToDetach.length > 0 && (
                                    <Button
                                        variant="destructive"
                                        onClick={handleDetachQuestions}
                                        disabled={detachMutation.isPending}
                                    >
                                        {detachMutation.isPending ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <Minus className="h-4 w-4 mr-2" />
                                        )}
                                        Hapus {questionsToDetach.length} Soal
                                    </Button>
                                )}
                                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Tambah Soal
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                                        <DialogHeader>
                                            <DialogTitle>Tambah Soal ke Ujian</DialogTitle>
                                            <DialogDescription>
                                                Pilih soal dari bank soal untuk ditambahkan ke ujian ini
                                            </DialogDescription>
                                        </DialogHeader>

                                        {/* Search */}
                                        <div className="flex items-center gap-2 py-2">
                                            <div className="relative flex-1">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Cari soal..."
                                                    value={questionSearch}
                                                    onChange={(e) => setQuestionSearch(e.target.value)}
                                                    className="pl-10"
                                                />
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={selectAllAvailable}
                                            >
                                                Pilih Semua
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={clearSelection}
                                            >
                                                Reset
                                            </Button>
                                        </div>

                                        {/* Questions List */}
                                        <div className="flex-1 overflow-y-auto border rounded-md">
                                            {allQuestionsLoading ? (
                                                <div className="p-8 text-center">
                                                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                                                    <p className="text-muted-foreground">Memuat soal...</p>
                                                </div>
                                            ) : availableQuestions.length === 0 ? (
                                                <div className="p-8 text-center">
                                                    <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                                    <p className="text-muted-foreground">
                                                        {questionSearch
                                                            ? 'Tidak ada soal yang cocok'
                                                            : 'Semua soal sudah ditambahkan'}
                                                    </p>
                                                </div>
                                            ) : (
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="w-[50px]">Pilih</TableHead>
                                                            <TableHead>Soal</TableHead>
                                                            <TableHead className="w-[80px]">Tipe</TableHead>
                                                            <TableHead className="w-[80px]">Skor</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {availableQuestions.map((question) => (
                                                            <TableRow
                                                                key={question.id}
                                                                className="cursor-pointer"
                                                                onClick={() => toggleQuestionSelection(question.id)}
                                                            >
                                                                <TableCell>
                                                                    <Checkbox
                                                                        checked={selectedQuestionIds.includes(question.id)}
                                                                        onCheckedChange={() =>
                                                                            toggleQuestionSelection(question.id)
                                                                        }
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <p className="line-clamp-2">{question.content}</p>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge
                                                                        variant={
                                                                            questionTypeConfig[question.questionType]?.variant ||
                                                                            'outline'
                                                                        }
                                                                    >
                                                                        {question.questionType}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell>{question.defaultScore}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            )}
                                        </div>

                                        <DialogFooter className="pt-4">
                                            <div className="flex items-center justify-between w-full">
                                                <p className="text-sm text-muted-foreground">
                                                    {selectedQuestionIds.length} soal dipilih
                                                </p>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setShowAddDialog(false);
                                                            setSelectedQuestionIds([]);
                                                            setQuestionSearch('');
                                                        }}
                                                    >
                                                        Batal
                                                    </Button>
                                                    <Button
                                                        onClick={handleAttachQuestions}
                                                        disabled={
                                                            selectedQuestionIds.length === 0 ||
                                                            attachMutation.isPending
                                                        }
                                                    >
                                                        {attachMutation.isPending ? (
                                                            <>
                                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                Menambahkan...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                                                Tambahkan Soal
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {questionsLoading ? (
                            <div className="space-y-4">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <Skeleton key={i} className="h-16 w-full" />
                                ))}
                            </div>
                        ) : examQuestions.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">Belum Ada Soal</h3>
                                <p className="text-muted-foreground mb-4">
                                    Tambahkan soal dari bank soal untuk ujian ini
                                </p>
                                <Button onClick={() => setShowAddDialog(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Tambah Soal
                                </Button>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">
                                                <Checkbox
                                                    checked={
                                                        questionsToDetach.length === examQuestions.length &&
                                                        examQuestions.length > 0
                                                    }
                                                    onCheckedChange={(checked: boolean | 'indeterminate') => {
                                                        if (checked === true) {
                                                            setQuestionsToDetach(
                                                                examQuestions.map((eq) => eq.question.id)
                                                            );
                                                        } else {
                                                            setQuestionsToDetach([]);
                                                        }
                                                    }}
                                                />
                                            </TableHead>
                                            <TableHead className="w-[60px]">No</TableHead>
                                            <TableHead>Soal</TableHead>
                                            <TableHead className="w-[80px]">Tipe</TableHead>
                                            <TableHead className="w-[80px]">Skor</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {examQuestions.map((eq, index) => (
                                            <TableRow key={eq.id}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={questionsToDetach.includes(eq.question.id)}
                                                        onCheckedChange={() =>
                                                            toggleDetachSelection(eq.question.id)
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {eq.orderNumber || index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <p className="line-clamp-2">{eq.question.content}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            questionTypeConfig[
                                                                eq.question.questionType as keyof typeof questionTypeConfig
                                                                ]?.variant || 'outline'
                                                        }
                                                    >
                                                        {eq.question.questionType}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{eq.question.defaultScore}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Ujian?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ujian &quot;{exam.title}&quot; beserta
                            semua soal yang terkait akan dihapus secara permanen.
                            <br />
                            <br />
                            <strong>Catatan:</strong> Ujian yang sudah memiliki peserta tidak dapat dihapus.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteExam}
                            disabled={deleteMutation.isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteMutation.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Menghapus...
                                </>
                            ) : (
                                'Hapus Ujian'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}