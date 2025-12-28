/**
 * Result Detail Page
 */

'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
    Trophy,
    XCircle,
    Clock,
    FileText,
    ArrowLeft,
    Eye,
    CheckCircle,
    AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { useResultDetail } from '@/features/exam-sessions/hooks/useResultDetail';
import { useProctoringEvents } from '@/features/proctoring/hooks/useProctoringEvents';
import { ProctoringEventsList } from '@/features/proctoring/components/ProctoringEventsList';
import type { ExamStatus } from '@/shared/types/enum.types';

// Status config
const statusConfig: Record<ExamStatus, {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    icon: typeof CheckCircle;
}> = {
    IN_PROGRESS: { label: 'Sedang Berlangsung', variant: 'default', icon: Clock },
    FINISHED: { label: 'Selesai', variant: 'secondary', icon: CheckCircle },
    TIMEOUT: { label: 'Waktu Habis', variant: 'destructive', icon: AlertTriangle },
    CANCELLED: { label: 'Dibatalkan', variant: 'outline', icon: XCircle },
};

export default function ResultDetailPage() {
    const params = useParams();

    // ✅ FIX: Parse and validate sessionId
    // params.id can be string | string[] | undefined
    const rawId = params.id;
    const parsedId = typeof rawId === 'string' ? Number(rawId) : NaN;
    const isValidId = !Number.isNaN(parsedId) && parsedId > 0;

    // ✅ FIX: Use validated number for useResultDetail
    // useResultDetail accepts number | undefined, so we can pass undefined for invalid IDs
    const sessionId = isValidId ? parsedId : undefined;

    const { data: result, isLoading, isError } = useResultDetail(sessionId);

    // ✅ FIX: useProctoringEvents requires number, not number | undefined
    // Pass the parsed number (or 0 as fallback) and use enabled to control the query
    const { data: eventsResponse } = useProctoringEvents(
        isValidId ? parsedId : 0,  // Pass 0 as fallback (query will be disabled anyway)
        undefined,                  // No additional params
        isValidId                   // enabled: only run query if ID is valid
    );

    // Handle invalid ID early
    if (!isValidId) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="py-8 text-center">
                        <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
                        <p className="text-muted-foreground mb-4">
                            ID hasil ujian tidak valid.
                        </p>
                        <Button asChild>
                            <Link href="/results">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Kembali ke Daftar Hasil
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 space-y-6">
                <Skeleton className="h-10 w-64" />
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                </div>
            </div>
        );
    }

    if (isError || !result) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground">
                            Gagal memuat hasil ujian. Silakan coba lagi.
                        </p>
                        <Button asChild className="mt-4">
                            <Link href="/results">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Kembali ke Daftar Hasil
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const {
        exam,
        totalScore,
        status,
        answeredQuestions,
        totalQuestions,
        startedAt,
        submittedAt,
        passed,
        scoresByType,
        attemptNumber,  // HIGH-006 FIX: Include attemptNumber
    } = result;

    const passingScore = exam.passingScore ?? 0;
    const scorePercentage = passingScore > 0
        ? Math.min(((totalScore ?? 0) / passingScore) * 100, 100)
        : 0;

    const statusInfo = statusConfig[status] ?? statusConfig.FINISHED;
    const StatusIcon = statusInfo.icon;

    // ✅ FIX: Properly access events from the response
    const events = eventsResponse?.data ?? [];

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{exam.title}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-muted-foreground">Hasil Ujian</p>
                        {/* HIGH-006 FIX: Show attempt number */}
                        <Badge variant="outline" className="text-xs">
                            Percobaan #{attemptNumber ?? 1}
                        </Badge>
                    </div>
                </div>
                <Button asChild variant="outline">
                    <Link href="/results">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali
                    </Link>
                </Button>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Score Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Hasil</span>
                            <Badge variant={statusInfo.variant}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusInfo.label}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Pass/Fail Indicator */}
                        {status === 'FINISHED' && passed !== null && passingScore > 0 && (
                            <div className={`flex items-center gap-3 p-4 rounded-lg ${
                                passed
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                                {passed ? (
                                    <>
                                        <Trophy className="h-8 w-8" />
                                        <div>
                                            <p className="font-bold text-lg">LULUS</p>
                                            <p className="text-sm opacity-80">
                                                Selamat! Anda berhasil mencapai passing score.
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="h-8 w-8" />
                                        <div>
                                            <p className="font-bold text-lg">TIDAK LULUS</p>
                                            <p className="text-sm opacity-80">
                                                Anda belum mencapai passing score.
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Score Display */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-4xl font-bold">
                                    {totalScore ?? 0}
                                </span>
                                <span className="text-muted-foreground">
                                    / {passingScore > 0 ? passingScore : '-'} (passing score)
                                </span>
                            </div>
                            {passingScore > 0 && (
                                <Progress
                                    value={scorePercentage}
                                    className={`h-3 ${passed ? '[&>div]:bg-green-500' : '[&>div]:bg-red-500'}`}
                                />
                            )}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <p className="text-sm text-muted-foreground">Soal Dijawab</p>
                                <p className="text-xl font-semibold">
                                    {answeredQuestions}/{totalQuestions}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Akurasi</p>
                                <p className="text-xl font-semibold">
                                    {totalQuestions > 0
                                        ? Math.round((answeredQuestions / totalQuestions) * 100)
                                        : 0}%
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Details Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Detail</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Time Info */}
                        {startedAt && (
                            <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Dimulai</p>
                                    <p className="font-medium">
                                        {format(new Date(startedAt), 'PPpp', { locale: localeId })}
                                    </p>
                                </div>
                            </div>
                        )}

                        {submittedAt && (
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Selesai</p>
                                    <p className="font-medium">
                                        {format(new Date(submittedAt), 'PPpp', { locale: localeId })}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Score by Type */}
                        {scoresByType && scoresByType.length > 0 && (
                            <div className="pt-4 border-t">
                                <p className="text-sm text-muted-foreground mb-3">
                                    Skor per Kategori
                                </p>
                                <div className="space-y-2">
                                    {scoresByType.map((st) => (
                                        <div key={st.type} className="flex justify-between items-center">
                                            <span className="font-medium">{st.type}</span>
                                            <span className="text-muted-foreground">
                                                {st.score}/{st.maxScore}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="pt-4 border-t">
                            <Button asChild className="w-full">
                                <Link href={`/exam-sessions/${sessionId}/review`}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Review Jawaban
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Proctoring Events */}
            {events.length > 0 && (
                <ProctoringEventsList events={events} />
            )}
        </div>
    );
}