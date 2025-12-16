/**
 * Participant Exam Detail Page
 *
 * Features:
 * - Show exam details (title, description, rules)
 * - Display duration, passing score, question count
 * - Start exam button (creates session)
 * - Redirect to exam session on start
 *
 * Backend endpoints:
 * - GET /api/v1/exams/:id (exam detail)
 * - POST /api/v1/exams/:id/start (create session)
 */

'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useExam, useStartExam } from '@/features/exams/hooks';
import { formatDuration, getExamAvailabilityStatus } from '@/features/exams/types/exams.types';

// UI Components
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Separator } from '@/shared/components/ui/separator';
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
    ArrowLeft,
    Clock,
    Target,
    FileText,
    Calendar,
    PlayCircle,
    AlertTriangle,
    CheckCircle2,
    Camera,
    Monitor,
    Loader2,
    Info,
} from 'lucide-react';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ExamDetailPage({ params }: PageProps) {
    const router = useRouter();
    const resolvedParams = use(params);
    const examId = parseInt(resolvedParams.id, 10);

    // State
    const [showStartDialog, setShowStartDialog] = useState(false);

    // Queries
    const { data: examData, isLoading, isError } = useExam(examId);
    const startExamMutation = useStartExam();

    // Handle start exam
    const handleStartExam = async () => {
        try {
            const response = await startExamMutation.mutateAsync(examId);
            toast.success('Ujian dimulai! Selamat mengerjakan.');

            // Redirect to exam session
            if (response?.userExam?.id) {
                router.push(`/exam-sessions/${response.userExam.id}`);
            }
        } catch (error: any) {
            const errorCode = error?.response?.data?.errorCode;
            let message = 'Gagal memulai ujian';

            if (errorCode === 'EXAM_NO_QUESTIONS') {
                message = 'Ujian belum memiliki soal';
            } else if (errorCode === 'EXAM_NO_DURATION') {
                message = 'Durasi ujian belum diatur';
            } else if (errorCode === 'EXAM_SESSION_ALREADY_STARTED') {
                message = 'Anda sudah pernah mengerjakan ujian ini';
                // Try to redirect to existing session
                router.push('/dashboard');
            }

            toast.error(message);
        }
    };

    // Format date
    const formatDate = (dateString: string | null) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="container mx-auto py-8 space-y-6 max-w-4xl">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-48" />
                <Skeleton className="h-32" />
                <Skeleton className="h-48" />
            </div>
        );
    }

    // Error state
    if (isError || !examData) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="py-8 text-center">
                        <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
                        <p className="text-muted-foreground mb-4">
                            Ujian tidak ditemukan atau tidak tersedia.
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

    const exam = examData.exam;
    const status = getExamAvailabilityStatus(exam);
    const isAvailable = status === 'available';
    const questionCount = exam._count?.examQuestions ?? 0;

    return (
        <div className="container mx-auto py-8 space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/exams">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">{exam.title}</h1>
                    {exam.description && (
                        <p className="text-muted-foreground">{exam.description}</p>
                    )}
                </div>
                <Badge
                    variant={
                        status === 'available'
                            ? 'default'
                            : status === 'upcoming'
                                ? 'secondary'
                                : 'outline'
                    }
                >
                    {status === 'available' && 'Tersedia'}
                    {status === 'upcoming' && 'Akan Datang'}
                    {status === 'ended' && 'Berakhir'}
                    {status === 'no-questions' && 'Belum Tersedia'}
                </Badge>
            </div>

            {/* Exam Info Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Durasi</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatDuration(exam.durationMinutes)}</div>
                        <p className="text-xs text-muted-foreground">Waktu pengerjaan</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Jumlah Soal</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{questionCount}</div>
                        <p className="text-xs text-muted-foreground">Pertanyaan</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Passing Score</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{exam.passingScore}</div>
                        <p className="text-xs text-muted-foreground">Nilai minimum</p>
                    </CardContent>
                </Card>
            </div>

            {/* Schedule Info */}
            {(exam.startTime || exam.endTime) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Jadwal Ujian
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2 text-sm">
                            {exam.startTime && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Mulai:</span>
                                    <span className="font-medium">{formatDate(exam.startTime)}</span>
                                </div>
                            )}
                            {exam.endTime && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Berakhir:</span>
                                    <span className="font-medium">{formatDate(exam.endTime)}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Exam Rules */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Info className="h-5 w-5" />
                        Peraturan Ujian
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert>
                        <Camera className="h-4 w-4" />
                        <AlertTitle>Proctoring Aktif</AlertTitle>
                        <AlertDescription>
                            Ujian ini menggunakan sistem proctoring dengan deteksi wajah.
                            Pastikan webcam Anda aktif dan wajah terlihat jelas selama ujian.
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>Pastikan koneksi internet stabil selama mengerjakan ujian</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>Jawaban akan tersimpan otomatis setiap kali Anda memilih jawaban</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>Anda dapat berpindah antar soal dengan bebas</span>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <span>Jangan berpindah tab atau minimize browser selama ujian</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <span>Pastikan hanya Anda yang terlihat di kamera</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <span>Pelanggaran berulang dapat menyebabkan ujian dibatalkan</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Start Button */}
            <Card>
                <CardContent className="py-6">
                    <div className="flex flex-col items-center gap-4 text-center">
                        {isAvailable ? (
                            <>
                                <p className="text-muted-foreground">
                                    Klik tombol di bawah untuk memulai ujian
                                </p>
                                <Button
                                    size="lg"
                                    onClick={() => setShowStartDialog(true)}
                                    disabled={startExamMutation.isPending}
                                    className="w-full max-w-xs"
                                >
                                    {startExamMutation.isPending ? (
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    ) : (
                                        <PlayCircle className="h-5 w-5 mr-2" />
                                    )}
                                    Mulai Ujian
                                </Button>
                            </>
                        ) : (
                            <p className="text-muted-foreground">
                                {status === 'upcoming' && 'Ujian belum dimulai'}
                                {status === 'ended' && 'Ujian sudah berakhir'}
                                {status === 'no-questions' && 'Ujian belum memiliki soal'}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Start Confirmation Dialog */}
            <AlertDialog open={showStartDialog} onOpenChange={setShowStartDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Mulai Ujian?</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                            <p>Anda akan memulai ujian: <strong>{exam.title}</strong></p>
                            <p>
                                Durasi: <strong>{formatDuration(exam.durationMinutes)}</strong> |
                                Soal: <strong>{questionCount}</strong>
                            </p>
                            <p className="text-yellow-600">
                                ⚠️ Pastikan webcam sudah aktif dan siap untuk proctoring.
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleStartExam}
                            disabled={startExamMutation.isPending}
                        >
                            {startExamMutation.isPending && (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            )}
                            Ya, Mulai Ujian
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}