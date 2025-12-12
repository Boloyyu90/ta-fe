/**
 * Exam Detail Page
 */

'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import {
    Clock,
    FileText,
    Calendar,
    Target,
    CheckCircle,
    XCircle,
    AlertTriangle,
    ArrowLeft,
    Play,
    Camera,
    Info,
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { useExam } from '@/features/exams/hooks/useExam';
import { useStartExam } from '@/features/exams/hooks/useStartExam';
import {
    isExamAvailable,
    getExamAvailabilityStatus,
    formatDuration
} from '@/features/exams/types/exams.types';

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

export default function ExamDetailPage() {
    const params = useParams();
    const router = useRouter();
    const examId = params.id ? Number(params.id) : undefined;

    const { data: exam, isLoading, isError } = useExam(examId);
    const startExamMutation = useStartExam();

    const handleStartExam = async () => {
        if (!examId) return;

        try {
            const result = await startExamMutation.mutateAsync(examId);
            // Redirect to exam session
            router.push(`/exam-sessions/${result.userExam.id}/take`);
        } catch (error) {
            // Error handled by mutation
            console.error('Failed to start exam:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 space-y-6">
                <Skeleton className="h-10 w-64" />
                <div className="grid gap-6 md:grid-cols-3">
                    <Skeleton className="h-64 md:col-span-2" />
                    <Skeleton className="h-64" />
                </div>
            </div>
        );
    }

    if (isError || !exam) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground">
                            Gagal memuat detail ujian. Silakan coba lagi.
                        </p>
                        <Button asChild className="mt-4">
                            <Link href="/exams">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Kembali ke Daftar Ujian
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const availability = getExamAvailabilityStatus(exam);
    const availInfo = availabilityConfig[availability];
    const AvailIcon = availInfo.icon;
    const questionCount = exam._count?.examQuestions ?? 0;

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Back Button */}
            <Button asChild variant="ghost" size="sm">
                <Link href="/exams">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali
                </Link>
            </Button>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    {/* Exam Info */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <CardTitle className="text-2xl">{exam.title}</CardTitle>
                                    {exam.description && (
                                        <CardDescription className="mt-2">
                                            {exam.description}
                                        </CardDescription>
                                    )}
                                </div>
                                <Badge
                                    variant={availability === 'available' ? 'default' : 'outline'}
                                    className="shrink-0"
                                >
                                    <AvailIcon className={`h-3 w-3 mr-1 ${availInfo.color}`} />
                                    {availInfo.label}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span className="text-sm">Durasi</span>
                                    </div>
                                    <p className="font-semibold">{formatDuration(exam.durationMinutes)}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <FileText className="h-4 w-4" />
                                        <span className="text-sm">Jumlah Soal</span>
                                    </div>
                                    <p className="font-semibold">{questionCount} soal</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Target className="h-4 w-4" />
                                        <span className="text-sm">Passing Score</span>
                                    </div>
                                    <p className="font-semibold">{exam.passingScore}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span className="text-sm">Dibuat</span>
                                    </div>
                                    <p className="font-semibold">
                                        {format(new Date(exam.createdAt), 'dd MMM yyyy', { locale: localeId })}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Schedule Info (if set) */}
                    {(exam.startTime || exam.endTime) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Jadwal Ujian
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {exam.startTime && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Waktu Mulai</span>
                                        <span className="font-medium">
                                            {format(new Date(exam.startTime), 'PPpp', { locale: localeId })}
                                        </span>
                                    </div>
                                )}
                                {exam.endTime && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Waktu Berakhir</span>
                                        <span className="font-medium">
                                            {format(new Date(exam.endTime), 'PPpp', { locale: localeId })}
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Rules */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Info className="h-5 w-5" />
                                Aturan Ujian
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                    Pastikan koneksi internet stabil selama ujian berlangsung
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                    Jawaban akan tersimpan otomatis setiap kali Anda memilih opsi
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                    Anda dapat berpindah antar soal selama waktu ujian masih tersedia
                                </li>
                                <li className="flex items-start gap-2">
                                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                                    Ujian akan otomatis berakhir jika waktu habis
                                </li>
                                <li className="flex items-start gap-2">
                                    <Camera className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                                    Proctoring aktif: pastikan wajah Anda terlihat di kamera
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Start Exam Card */}
                    <Card className="sticky top-6">
                        <CardHeader>
                            <CardTitle className="text-lg">Mulai Ujian</CardTitle>
                            <CardDescription>{availInfo.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Proctoring Notice */}
                            <Alert>
                                <Camera className="h-4 w-4" />
                                <AlertTitle>Proctoring Aktif</AlertTitle>
                                <AlertDescription>
                                    Ujian ini menggunakan deteksi wajah untuk menjaga integritas.
                                    Izinkan akses kamera saat diminta.
                                </AlertDescription>
                            </Alert>

                            {/* Start Button */}
                            <Button
                                className="w-full"
                                size="lg"
                                disabled={!availInfo.canStart || startExamMutation.isPending}
                                onClick={handleStartExam}
                            >
                                {startExamMutation.isPending ? (
                                    'Memulai...'
                                ) : (
                                    <>
                                        <Play className="h-4 w-4 mr-2" />
                                        Mulai Ujian
                                    </>
                                )}
                            </Button>

                            {/* Warning if can't start */}
                            {!availInfo.canStart && (
                                <p className="text-sm text-muted-foreground text-center">
                                    {availability === 'upcoming' && 'Ujian belum dimulai'}
                                    {availability === 'ended' && 'Waktu ujian telah berakhir'}
                                    {availability === 'no-questions' && 'Ujian belum memiliki soal'}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}