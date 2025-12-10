// src/app/(participant)/exams/[id]/page.tsx

/**
 * Exam Detail Page
 *
 * ✅ AUDIT FIX v4:
 * - Access exam from data?.exam (not data?.data)
 * - Use startExamMutation.mutate and startExamMutation.isPending
 */

'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { examsApi } from '@/features/exams/api/exams.api';
import { useStartExam } from '@/features/exams/hooks/useStartExam';
import { isExamAvailable, getExamAvailabilityStatus } from '@/features/exams/types/exams.types';
import type { ExamDetailResponse } from '@/features/exams/types/exams.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import {
    Clock,
    FileText,
    Calendar,
    Users,
    Play,
    CheckCircle,
    XCircle,
    AlertCircle,
    ArrowLeft,
    Trophy,
} from 'lucide-react';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ExamDetailPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const router = useRouter();
    const examId = parseInt(resolvedParams.id as string);

    const { data, isLoading, error } = useQuery<ExamDetailResponse>({
        queryKey: ['exam', examId],
        queryFn: () => examsApi.getExam(examId),
    });

    // ✅ FIX: Get both naming conventions from hook
    const startExamMutation = useStartExam();

    const handleStartExam = () => {
        // ✅ FIX: Use mutate (which is now exposed)
        startExamMutation.mutate(examId);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 space-y-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-64" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Failed to load exam details. Please try again later.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    // ✅ FIX: Access exam from data?.exam (not data?.data)
    const exam = data?.exam;

    if (!exam) {
        return (
            <div className="container mx-auto py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Exam not found.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const availability = getExamAvailabilityStatus(exam);
    const isAvailable = isExamAvailable(exam);
    const questionCount = exam._count?.examQuestions ?? 0;
    const participantCount = exam._count?.userExams ?? 0;

    const getStatusBadge = () => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
            available: 'default',
            upcoming: 'secondary',
            ended: 'destructive',
            inactive: 'outline',
        };

        const icons: Record<string, typeof CheckCircle> = {
            available: CheckCircle,
            upcoming: Clock,
            ended: XCircle,
            inactive: XCircle,
        };

        const Icon = icons[availability.status];

        return (
            <Badge variant={variants[availability.status]} className="flex items-center gap-1">
                <Icon className="h-3 w-3" />
                {availability.label}
            </Badge>
        );
    };

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Back Button */}
            <Link href="/exams">
                <Button variant="ghost" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Daftar Ujian
                </Button>
            </Link>

            {/* Header Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <CardTitle className="text-2xl">{exam.title}</CardTitle>
                            {exam.description && (
                                <p className="text-muted-foreground">{exam.description}</p>
                            )}
                        </div>
                        {getStatusBadge()}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                            <Clock className="h-8 w-8 text-blue-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Durasi</p>
                                <p className="font-semibold">{exam.durationMinutes} menit</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                            <FileText className="h-8 w-8 text-green-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Jumlah Soal</p>
                                <p className="font-semibold">{questionCount} soal</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                            <Trophy className="h-8 w-8 text-yellow-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Passing Score</p>
                                <p className="font-semibold">{exam.passingScore}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                            <Users className="h-8 w-8 text-purple-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Peserta</p>
                                <p className="font-semibold">{participantCount}</p>
                            </div>
                        </div>
                    </div>

                    {/* Schedule */}
                    {(exam.startTime || exam.endTime) && (
                        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                            <Calendar className="h-6 w-6 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Jadwal Ujian</p>
                                <p className="font-medium">
                                    {exam.startTime && format(new Date(exam.startTime), 'PPP HH:mm', { locale: localeId })}
                                    {exam.startTime && exam.endTime && ' - '}
                                    {exam.endTime && format(new Date(exam.endTime), 'PPP HH:mm', { locale: localeId })}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Start Button */}
                    <div className="flex justify-center pt-4">
                        <Button
                            size="lg"
                            onClick={handleStartExam}
                            // ✅ FIX: Use isPending (now exposed from hook)
                            disabled={!isAvailable || startExamMutation.isPending}
                            className="w-full md:w-auto px-8"
                        >
                            <Play className="mr-2 h-5 w-5" />
                            {/* ✅ FIX: Use isPending */}
                            {startExamMutation.isPending ? 'Starting...' : 'Start Exam'}
                        </Button>
                    </div>

                    {/* Warning for unavailable exam */}
                    {!isAvailable && (
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {availability.status === 'upcoming' && 'Ujian belum dimulai. Silakan tunggu hingga waktu yang ditentukan.'}
                                {availability.status === 'ended' && 'Ujian sudah berakhir.'}
                                {availability.status === 'inactive' && 'Ujian tidak aktif.'}
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Rules Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Aturan Ujian</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Pastikan koneksi internet stabil selama ujian berlangsung</li>
                        <li>Ujian akan otomatis berakhir ketika waktu habis</li>
                        <li>Jawaban akan tersimpan otomatis setiap kali Anda memilih jawaban</li>
                        <li>Webcam akan diaktifkan untuk proctoring selama ujian</li>
                        <li>Jangan membuka tab atau aplikasi lain selama ujian</li>
                        <li>Pastikan wajah Anda terlihat jelas di webcam</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}