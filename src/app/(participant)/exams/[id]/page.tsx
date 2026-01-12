'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useExamWithAttempts } from '@/features/exams/hooks';
import { useStartExam } from '@/features/exam-sessions/hooks';
import type { ExamAttemptInfo } from '@/features/exams/types/exams.types';
import { EXAM_SESSION_ERRORS, EXAM_ERRORS, getErrorMessage } from '@/shared/lib/errors';
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
    RotateCcw,
    Eye,
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

/**
 * Determine the button state based on exam config and attempts data from backend
 *
 * Uses attemptsCount and latestAttempt from GET /exams/:id response
 * which are already filtered to THIS exam only (no pollution from other exams)
 */
function getExamButtonState(
    exam: Exam,
    attemptsCount: number,
    latestAttempt?: ExamAttemptInfo | null
): {
    label: string;
    action: 'start' | 'retake' | 'view-result' | 'disabled';
    disabled: boolean;
    icon: typeof Play;
    latestAttemptId?: number;
    attemptInfo?: string;
} {
    // No attempts yet - first attempt
    if (attemptsCount === 0 || !latestAttempt) {
        return {
            label: 'Mulai Ujian',
            action: 'start',
            disabled: false,
            icon: Play,
            attemptInfo: 'Percobaan ke-1',
        };
    }

    // Has completed attempts
    // Check retake eligibility
    // Safety defaults (backend now returns these fields, but keeping for robustness)
    const allowRetake = exam.allowRetake ?? false;
    const maxAttempts = exam.maxAttempts ?? null;

    // Edge case guard: invalid maxAttempts value
    if (maxAttempts !== null && maxAttempts <= 0) {
        console.warn(`[ExamDetail] Invalid maxAttempts=${maxAttempts} for exam ${exam.id}`);
        return {
            label: 'Lihat Hasil',
            action: 'view-result',
            disabled: false,
            icon: Eye,
            latestAttemptId: latestAttempt?.id,
            attemptInfo: `Percobaan: ${attemptsCount}`,
        };
    }

    if (!allowRetake) {
        return {
            label: 'Lihat Hasil',
            action: 'view-result',
            disabled: false,
            icon: Eye,
            latestAttemptId: latestAttempt.id,
            attemptInfo: `Percobaan: ${attemptsCount}`,
        };
    }

    // Check if max attempts reached
    if (maxAttempts !== null && attemptsCount >= maxAttempts) {
        return {
            label: `Batas Tercapai (${attemptsCount}/${maxAttempts})`,
            action: 'disabled',
            disabled: true,
            icon: XCircle,
            attemptInfo: `Percobaan: ${attemptsCount}/${maxAttempts}`,
        };
    }

    // Can retake
    const nextAttempt = attemptsCount + 1;
    return {
        label: 'Mulai Lagi',
        action: 'retake',
        disabled: false,
        icon: RotateCcw,
        attemptInfo: maxAttempts
            ? `Percobaan ke-${nextAttempt} dari ${maxAttempts}`
            : `Percobaan ke-${nextAttempt}`,
    };
}

export default function ExamDetailPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const router = useRouter();
    const examId = parseInt(resolvedParams.id, 10);

    // Fetch exam details WITH attempts info
    // Backend returns: { exam, attemptsCount, firstAttempt, latestAttempt }
    // This is already filtered to THIS exam only (no pollution from other exams)
    const { data: examData, isLoading, isError } = useExamWithAttempts(examId);

    // Start exam mutation
    const { startExam, isLoading: isStarting } = useStartExam();

    // Extract data from response
    const exam = examData?.exam;
    const attemptsCount = examData?.attemptsCount ?? 0;
    const latestAttempt = examData?.latestAttempt;

    // Handle start/resume exam
    const handleStartExam = () => {
        startExam(examId, {
            onError: (error: unknown) => {
                const err = error as {
                    response?: {
                        data?: {
                            errorCode?: string;
                            message?: string;
                            context?: { maxAttempts?: number };
                        };
                    };
                };
                const errorCode = err?.response?.data?.errorCode;
                const context = err?.response?.data?.context;
                let message = err?.response?.data?.message || 'Gagal memulai ujian';

                // Map error codes to Indonesian messages
                if (errorCode === 'EXAM_NO_QUESTIONS') {
                    message = getErrorMessage('EXAM_NO_QUESTIONS');
                } else if (errorCode === 'EXAM_NO_DURATION') {
                    message = getErrorMessage('EXAM_NO_DURATION');
                } else if (errorCode === 'EXAM_SESSION_ALREADY_STARTED') {
                    message = getErrorMessage('EXAM_SESSION_ALREADY_STARTED');
                } else if (errorCode === 'EXAM_SESSION_RETAKE_DISABLED') {
                    message = getErrorMessage('EXAM_SESSION_RETAKE_DISABLED');
                } else if (errorCode === 'EXAM_SESSION_MAX_ATTEMPTS') {
                    const maxAttempts = context?.maxAttempts || 'maksimal';
                    message = `Anda telah mencapai batas percobaan (${maxAttempts} kali)`;
                }

                toast.error(message);
            },
        });
    };

    // Handle view result navigation
    const handleViewResult = (attemptId?: number) => {
        if (attemptId) {
            router.push(`/exam-sessions/${attemptId}/review`);
        } else {
            toast.error('Tidak ada hasil ujian yang dapat ditampilkan');
        }
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

    // Get availability and button state
    const availability = getExamAvailabilityStatus(exam);
    const availInfo = availabilityConfig[availability];
    const AvailIcon = availInfo.icon;
    const questionCount = exam._count?.examQuestions ?? 0;

    // Get smart button state using attempts data from backend
    const buttonState = getExamButtonState(exam, attemptsCount, latestAttempt);
    const ButtonIcon = buttonState.icon;

    // Format dates
    const formatDateTime = (dateString: string | null) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="container mx-auto py-8 max-w-4xl space-y-6">
            {/* Back Button */}
            <Link href="/exams">
                <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali
                </Button>
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">{exam.title}</h1>
                    <div className="flex items-center gap-2">
                        <Badge
                            variant={availability === 'available' ? 'default' : 'secondary'}
                            className={availInfo.color}
                        >
                            <AvailIcon className="h-3 w-3 mr-1" />
                            {availInfo.label}
                        </Badge>
                        {buttonState.attemptInfo && (
                            <Badge variant="outline">{buttonState.attemptInfo}</Badge>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Durasi</p>
                            <p className="font-semibold">{formatDuration(exam.durationMinutes)}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Jumlah Soal</p>
                            <p className="font-semibold">{questionCount} Soal</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Target className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Nilai Kelulusan</p>
                            <p className="font-semibold">{exam.passingScore} Poin</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Description */}
            {exam.description && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Deskripsi Ujian</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                            {exam.description}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Schedule Info */}
            {(exam.startTime || exam.endTime) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Jadwal Ujian
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {exam.startTime && (
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">Mulai:</span>
                                <span>{formatDateTime(exam.startTime)}</span>
                            </div>
                        )}
                        {exam.endTime && (
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">Berakhir:</span>
                                <span>{formatDateTime(exam.endTime)}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Retake Info */}
            {exam.allowRetake && (
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Pengulangan Diizinkan</AlertTitle>
                    <AlertDescription>
                        {exam.maxAttempts
                            ? `Anda dapat mengulang ujian ini hingga ${exam.maxAttempts} kali percobaan.`
                            : 'Anda dapat mengulang ujian ini tanpa batas percobaan.'}
                    </AlertDescription>
                </Alert>
            )}

            {/* Rules & Requirements */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Info className="h-5 w-5" />
                        Peraturan Ujian
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                            Pastikan koneksi internet Anda stabil selama ujian berlangsung.
                        </li>
                        <li className="flex items-start gap-2">
                            <Camera className="h-4 w-4 mt-0.5 text-blue-500 shrink-0" />
                            Webcam akan aktif untuk proctoring selama ujian.
                        </li>
                        <li className="flex items-start gap-2">
                            <Clock className="h-4 w-4 mt-0.5 text-orange-500 shrink-0" />
                            Timer akan berjalan segera setelah ujian dimulai.
                        </li>
                        <li className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 mt-0.5 text-yellow-500 shrink-0" />
                            Ujian akan otomatis dikumpulkan jika waktu habis.
                        </li>
                        <li className="flex items-start gap-2">
                            <XCircle className="h-4 w-4 mt-0.5 text-red-500 shrink-0" />
                            Jangan meninggalkan halaman ujian atau membuka tab lain.
                        </li>
                    </ul>
                </CardContent>
            </Card>

            {/* Action Button */}
            <div className="flex justify-center">
                {/* View Result Action */}
                {buttonState.action === 'view-result' && (
                    <Button
                        size="lg"
                        onClick={() => handleViewResult(buttonState.latestAttemptId)}
                        className="min-w-[200px]"
                    >
                        <Eye className="h-5 w-5 mr-2" />
                        Lihat Hasil
                    </Button>
                )}

                {/* Disabled Action (Max Attempts Reached) */}
                {buttonState.action === 'disabled' && (
                    <Button size="lg" disabled className="min-w-[200px]">
                        <XCircle className="h-5 w-5 mr-2" />
                        {buttonState.label}
                    </Button>
                )}

                {/* Start / Retake Action */}
                {(buttonState.action === 'start' || buttonState.action === 'retake') &&
                    availInfo.canStart && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    size="lg"
                                    disabled={isStarting}
                                    className="min-w-[200px]"
                                >
                                    {isStarting ? (
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    ) : (
                                        <ButtonIcon className="h-5 w-5 mr-2" />
                                    )}
                                    {buttonState.label}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        {buttonState.action === 'retake'
                                            ? 'Mulai Ujian Ulang?'
                                            : 'Mulai Ujian?'}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription asChild>
                                        <div className="space-y-2">
                                            <p>
                                                Anda akan memulai ujian &quot;{exam.title}&quot;.
                                                {buttonState.attemptInfo && (
                                                    <span className="font-medium">
                                                        {' '}
                                                        ({buttonState.attemptInfo})
                                                    </span>
                                                )}
                                            </p>
                                            <p>
                                                Pastikan Anda sudah siap karena timer akan berjalan
                                                segera setelah ujian dimulai.
                                            </p>
                                        </div>
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
                    )}

                {/* Unavailable State */}
                {(buttonState.action === 'start' || buttonState.action === 'retake') &&
                    !availInfo.canStart && (
                        <Button size="lg" disabled className="min-w-[200px]">
                            <AvailIcon className="h-5 w-5 mr-2" />
                            {availInfo.label}
                        </Button>
                    )}
            </div>
        </div>
    );
}