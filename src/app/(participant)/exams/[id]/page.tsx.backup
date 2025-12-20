// src/app/(participant)/exams/[id]/page.tsx

/**
 * Exam Detail Page
 *
 * ✅ FIXED:
 * - useExam returns Exam directly (already unwrapped), not { exam: Exam }
 */

'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useExam } from '@/features/exams/hooks';
import { useStartExam } from '@/features/exam-sessions/hooks';
import {
    isExamAvailable,
    getExamAvailabilityStatus,
    formatDuration,
} from '@/features/exams/types/exams.types';
import type { Exam } from '@/features/exams/types/exams.types';

// UI Components
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog';
import {
    ArrowLeft,
    Clock,
    FileText,
    Target,
    Calendar,
    Play,
    Camera,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Info,
    Loader2,
} from 'lucide-react';

interface PageProps {
    params: Promise<{ id: string }>;
}

// Availability config for UI
const availabilityConfig = {
    available: {
        label: 'Tersedia',
        description: 'Ujian ini siap untuk dikerjakan',
        icon: CheckCircle,
        color: 'text-green-600',
        canStart: true,
    },
    upcoming: {
        label: 'Segera',
        description: 'Ujian ini belum dimulai',
        icon: Clock,
        color: 'text-blue-600',
        canStart: false,
    },
    ended: {
        label: 'Berakhir',
        description: 'Waktu pengerjaan ujian telah habis',
        icon: XCircle,
        color: 'text-gray-500',
        canStart: false,
    },
    'no-questions': {
        label: 'Belum Ada Soal',
        description: 'Ujian ini belum memiliki soal',
        icon: AlertTriangle,
        color: 'text-yellow-600',
        canStart: false,
    },
};

export default function ExamDetailPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const router = useRouter();
    const examId = parseInt(resolvedParams.id, 10);

    // ✅ FIX: useExam returns Exam directly
    const { data: exam, isLoading, isError } = useExam(examId);
    const { startExam, isLoading: isStarting } = useStartExam();

    // Handle start exam
    const handleStartExam = () => {
        startExam(examId, {
            onError: (error: unknown) => {
                const err = error as { response?: { data?: { errorCode?: string; message?: string } } };
                const errorCode = err?.response?.data?.errorCode;
                let message = err?.response?.data?.message || 'Gagal memulai ujian';

                if (errorCode === 'EXAM_NO_QUESTIONS') {
                    message = 'Ujian belum memiliki soal';
                } else if (errorCode === 'EXAM_NO_DURATION') {
                    message = 'Ujian belum memiliki durasi';
                } else if (errorCode === 'EXAM_SESSION_ALREADY_STARTED') {
                    message = 'Anda sudah memulai ujian ini';
                }

                toast.error(message);
            },
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="container mx-auto py-8 max-w-4xl space-y-6">
                <Skeleton className="h-10 w-64" />
                <div className="grid gap-4 md:grid-cols-3">
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                </div>
                <Skeleton className="h-48" />
                <Skeleton className="h-32" />
            </div>
        );
    }

    // Error or not found
    if (isError || !exam) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="py-8 text-center">
                        <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Ujian Tidak Ditemukan</h2>
                        <p className="text-muted-foreground mb-4">
                            Ujian yang Anda cari tidak tersedia atau sudah dihapus.
                        </p>
                        <Link href="/exams">
                            <Button variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Kembali ke Daftar Ujian
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // ✅ FIX: exam is already the Exam object, not { exam: Exam }
    const availability = getExamAvailabilityStatus(exam);
    const availInfo = availabilityConfig[availability];
    const AvailIcon = availInfo.icon;
    const questionCount = exam._count?.examQuestions ?? 0;

    // Format datetime
    const formatDateTime = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="container mx-auto py-8 max-w-4xl space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/exams">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">{exam.title}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge
                                variant={availability === 'available' ? 'default' : 'secondary'}
                                className="flex items-center gap-1"
                            >
                                <AvailIcon className="h-3 w-3" />
                                {availInfo.label}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Durasi</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatDuration(exam.durationMinutes)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Jumlah Soal</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{questionCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Passing Score</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{exam.passingScore}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Description */}
            {exam.description && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Deskripsi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                            {exam.description}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Schedule */}
            {(exam.startTime || exam.endTime) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Jadwal
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {exam.startTime && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Mulai:</span>
                                <span className="font-medium">{formatDateTime(exam.startTime)}</span>
                            </div>
                        )}
                        {exam.endTime && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Berakhir:</span>
                                <span className="font-medium">{formatDateTime(exam.endTime)}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Rules */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Aturan Ujian</CardTitle>
                    <CardDescription>
                        Baca dengan cermat sebelum memulai ujian
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Proctoring Notice */}
                    <Alert>
                        <Camera className="h-4 w-4" />
                        <AlertTitle>Ujian Diawasi (Proctored)</AlertTitle>
                        <AlertDescription>
                            Ujian ini menggunakan sistem pengawasan AI. Pastikan kamera webcam Anda aktif
                            dan wajah terlihat jelas selama ujian berlangsung.
                        </AlertDescription>
                    </Alert>

                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Do's */}
                        <div className="space-y-2">
                            <h4 className="font-medium text-green-600 flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                Yang Harus Dilakukan
                            </h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Pastikan koneksi internet stabil</li>
                                <li>• Aktifkan webcam dan izinkan akses kamera</li>
                                <li>• Posisikan wajah di tengah layar</li>
                                <li>• Pastikan pencahayaan cukup</li>
                                <li>• Siapkan waktu sesuai durasi ujian</li>
                            </ul>
                        </div>

                        {/* Don'ts */}
                        <div className="space-y-2">
                            <h4 className="font-medium text-red-600 flex items-center gap-2">
                                <XCircle className="h-4 w-4" />
                                Yang Tidak Boleh Dilakukan
                            </h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Membuka tab atau aplikasi lain</li>
                                <li>• Melihat ke arah lain terlalu lama</li>
                                <li>• Memperlihatkan lebih dari satu wajah</li>
                                <li>• Copy-paste atau screenshot</li>
                                <li>• Meninggalkan ujian sebelum selesai</li>
                            </ul>
                        </div>
                    </div>

                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Peringatan</AlertTitle>
                        <AlertDescription>
                            Pelanggaran yang terdeteksi akan dicatat. Terlalu banyak pelanggaran dapat
                            menyebabkan ujian dibatalkan secara otomatis.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>

            {/* Start Button */}
            <div className="flex justify-center">
                {availInfo.canStart ? (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="lg" className="min-w-[200px]">
                                <Play className="h-5 w-5 mr-2" />
                                Mulai Ujian
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Mulai Ujian?</AlertDialogTitle>
                                <AlertDialogDescription className="space-y-2">
                                    <p>
                                        Anda akan memulai ujian <strong>{exam.title}</strong>.
                                    </p>
                                    <p>
                                        Durasi: <strong>{formatDuration(exam.durationMinutes)}</strong>
                                    </p>
                                    <p>
                                        Pastikan Anda sudah membaca aturan ujian dan siap untuk memulai.
                                        Timer akan berjalan segera setelah ujian dimulai.
                                    </p>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleStartExam}
                                    disabled={isStarting}
                                >
                                    {isStarting ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Play className="h-4 w-4 mr-2" />
                                    )}
                                    Mulai Sekarang
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                ) : (
                    <Button size="lg" disabled className="min-w-[200px]">
                        <AvailIcon className="h-5 w-5 mr-2" />
                        {availInfo.label}
                    </Button>
                )}
            </div>
        </div>
    );
}