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
    Target,
    Award,
    BarChart3,
    Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { useResultDetail } from '@/features/exam-sessions/hooks/useResultDetail';
import { BackButton } from '@/shared/components/BackButton';
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

    // params.id can be string | string[] | undefined
    const rawId = params.id;
    const parsedId = typeof rawId === 'string' ? Number(rawId) : NaN;
    const isValidId = !Number.isNaN(parsedId) && parsedId > 0;

    // Use validated number for useResultDetail
    const sessionId = isValidId ? parsedId : undefined;

    const { data: result, isLoading, isError } = useResultDetail(sessionId);

    // useProctoringEvents requires number, not number | undefined
    const { data: eventsResponse } = useProctoringEvents(
        isValidId ? parsedId : 0,
        undefined,
        isValidId
    );

    // Handle invalid ID early
    if (!isValidId) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="py-12 text-center">
                        <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="h-8 w-8 text-destructive" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">ID Tidak Valid</h3>
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
                <div className="grid gap-6 lg:grid-cols-5">
                    <Skeleton className="h-80 lg:col-span-2" />
                    <Skeleton className="h-80 lg:col-span-3" />
                </div>
            </div>
        );
    }

    if (isError || !result) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="py-12 text-center">
                        <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                            <Target className="h-8 w-8 text-destructive" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Gagal Memuat Data</h3>
                        <p className="text-muted-foreground mb-4">
                            Gagal memuat hasil ujian. Silakan coba lagi.
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
        attemptNumber,
    } = result;

    const passingScore = exam.passingScore;
    const scorePercentage = Math.min(((totalScore ?? 0) / passingScore) * 100, 100);

    const statusInfo = statusConfig[status] ?? statusConfig.FINISHED;
    const StatusIcon = statusInfo.icon;

    // Properly access events from the response
    const events = eventsResponse?.data ?? [];

    return (
        <div className="container mx-auto py-8 space-y-6">
            <BackButton href="/results" />

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">{exam.title}</h1>
                <div className="flex items-center gap-3 mt-2">
                    <Badge variant="outline" className="text-xs">
                        Percobaan #{attemptNumber}
                    </Badge>
                    <Badge variant={statusInfo.variant}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.label}
                    </Badge>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-5">
                {/* Left Column - Score Card */}
                <Card className="lg:col-span-2 overflow-hidden">
                    <div className={`p-6 ${
                        status === 'FINISHED' && passed !== null
                            ? passed
                                ? 'bg-gradient-to-br from-success/10 to-success/20 dark:from-success/10 dark:to-success/5'
                                : 'bg-gradient-to-br from-destructive/10 to-destructive/20 dark:from-destructive/10 dark:to-destructive/5'
                            : 'bg-gradient-to-br from-muted/30 to-muted/50'
                    }`}>
                        {/* Pass/Fail Indicator */}
                        {status === 'FINISHED' && passed !== null && (
                            <div className={`flex items-center gap-4 p-4 rounded-xl mb-6 ${
                                passed
                                    ? 'bg-success/10 border-2 border-success/20'
                                    : 'bg-destructive/10 border-2 border-destructive/20'
                            }`}>
                                <div className={`h-14 w-14 rounded-full flex items-center justify-center ${
                                    passed ? 'bg-success' : 'bg-destructive'
                                }`}>
                                    {passed ? (
                                        <Trophy className="h-7 w-7 text-white" />
                                    ) : (
                                        <XCircle className="h-7 w-7 text-white" />
                                    )}
                                </div>
                                <div>
                                    <p className={`font-bold text-xl ${
                                        passed ? 'text-success' : 'text-destructive'
                                    }`}>
                                        {passed ? 'LULUS' : 'TIDAK LULUS'}
                                    </p>
                                    <p className={`text-sm ${
                                        passed ? 'text-success' : 'text-destructive'
                                    }`}>
                                        {passed
                                            ? 'Selamat! Anda berhasil mencapai passing score.'
                                            : 'Anda belum mencapai passing score.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Score Display */}
                        <div className="text-center mb-6">
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                                Perolehan Nilai
                            </p>
                            <div className="flex items-baseline justify-center gap-2">
                                <span className={`text-6xl font-black tracking-tight ${
                                    status === 'FINISHED' && passed !== null
                                        ? passed
                                            ? 'text-success'
                                            : 'text-destructive'
                                        : 'text-foreground'
                                }`}>
                                    {totalScore ?? 0}
                                </span>
                                <span className="text-2xl text-muted-foreground font-medium">
                                    / {passingScore}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">(passing score)</p>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-6">
                            <Progress
                                value={scorePercentage}
                                className={`h-4 rounded-full ${
                                    passed
                                        ? '[&>div]:bg-success'
                                        : '[&>div]:bg-destructive'
                                }`}
                            />
                            <p className="text-center text-sm text-muted-foreground mt-2">
                                {scorePercentage.toFixed(0)}% dari passing score
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-background/50 rounded-xl">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">Soal Dijawab</p>
                                <p className="text-xl font-bold">
                                    {answeredQuestions}<span className="text-base font-normal text-muted-foreground">/{totalQuestions}</span>
                                </p>
                            </div>
                            <div className="text-center p-4 bg-background/50 rounded-xl">
                                <div className="h-10 w-10 rounded-full bg-info/10 flex items-center justify-center mx-auto mb-2">
                                    <BarChart3 className="h-5 w-5 text-info" />
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">Akurasi</p>
                                <p className="text-xl font-bold">
                                    {totalQuestions > 0
                                        ? Math.round((answeredQuestions / totalQuestions) * 100)
                                        : 0}%
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Right Column - Details */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-primary" />
                            Detail Hasil
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Time Info */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            {startedAt && (
                                <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Clock className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Waktu Mulai</p>
                                        <p className="font-medium">
                                            {format(new Date(startedAt), 'PPpp', { locale: localeId })}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {submittedAt && (
                                <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                                    <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                                        <Calendar className="h-5 w-5 text-success" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Waktu Selesai</p>
                                        <p className="font-medium">
                                            {format(new Date(submittedAt), 'PPpp', { locale: localeId })}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Score by Type Table */}
                        {scoresByType && scoresByType.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <Target className="h-4 w-4 text-primary" />
                                    Skor per Kategori
                                </h4>
                                <div className="rounded-lg border overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-muted/50">
                                                <th className="px-4 py-3 text-left font-medium">Kategori</th>
                                                <th className="px-4 py-3 text-center font-medium">Passing Grade</th>
                                                <th className="px-4 py-3 text-center font-medium">Benar</th>
                                                <th className="px-4 py-3 text-center font-medium">Total</th>
                                                <th className="px-4 py-3 text-right font-medium">Skor</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {scoresByType.map((st, index) => (
                                                <tr key={st.type} className={index < scoresByType.length - 1 ? 'border-b' : ''}>
                                                    <td className="px-4 py-3 font-medium">{st.type}</td>
                                                    <td className="px-4 py-3 text-center text-muted-foreground">
                                                        {st.passingGrade}
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-success">
                                                        {st.correctAnswers}
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-muted-foreground">
                                                        {st.totalQuestions}
                                                    </td>
                                                    <td className={`px-4 py-3 text-right font-semibold ${
                                                        st.isPassing
                                                            ? 'text-success'
                                                            : 'text-destructive'
                                                    }`}>
                                                        {st.score} / {st.maxScore}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="bg-muted/30 font-semibold">
                                                <td className="px-4 py-3">Total</td>
                                                <td className="px-4 py-3 text-center text-muted-foreground">-</td>
                                                <td className="px-4 py-3 text-center text-success">
                                                    {scoresByType.reduce((sum, st) => sum + st.correctAnswers, 0)}
                                                </td>
                                                <td className="px-4 py-3 text-center text-muted-foreground">
                                                    {scoresByType.reduce((sum, st) => sum + st.totalQuestions, 0)}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {totalScore ?? 0} / {scoresByType.reduce((sum, st) => sum + st.maxScore, 0)}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Review Button */}
                        <div className="pt-4 border-t">
                            <Button asChild className="w-full sm:w-auto" size="lg">
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
