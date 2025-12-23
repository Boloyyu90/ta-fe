/**
 * PARTICIPANT DASHBOARD
 */

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks';
import { useLogout } from '@/features/auth/hooks';
import { useMyStats } from '@/features/exam-sessions/hooks/useMyStats';
import { useUserExams } from '@/features/exam-sessions/hooks';
import { useMyResults } from '@/features/exam-sessions/hooks';
import { useExams } from '@/features/exams/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
    BookOpen,
    Clock,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    PlayCircle,
    Eye,
    Target,
    Calendar,
    Timer,
    Award,
    Camera,
    Trophy,
    XCircle,
    LogOut,
    Loader2,
    User,
} from 'lucide-react';
import Link from 'next/link';
import type { ExamStatus } from '@/shared/types/enum.types';
import type { UserExam, ExamResult } from '@/features/exam-sessions/types/exam-sessions.types';
import type { ExamPublic } from '@/features/exams/types/exams.types';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format duration in minutes to readable string
 */
function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} menit`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}j ${mins}m` : `${hours} jam`;
}

/**
 * Format time spent in seconds to readable string
 */
function formatTimeSpent(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}j ${minutes}m`;
    }
    return `${minutes} menit`;
}

/**
 * TimeAgo component - client-side only to avoid hydration issues
 */
function TimeAgo({ date }: { date: string | Date }) {
    const [relativeTime, setRelativeTime] = useState<string>('...');

    useEffect(() => {
        const now = new Date();
        const target = new Date(date);
        const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

        if (diffInSeconds < 60) {
            setRelativeTime('baru saja');
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            setRelativeTime(`${minutes} menit lalu`);
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            setRelativeTime(`${hours} jam lalu`);
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            setRelativeTime(`${days} hari lalu`);
        }
    }, [date]);

    return <span>{relativeTime}</span>;
}

// ============================================================================
// STATUS CONFIG (Only valid backend statuses)
// ============================================================================

const statusConfig: Record<ExamStatus, {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    icon: typeof CheckCircle2;
}> = {
    IN_PROGRESS: {
        label: 'Berlangsung',
        variant: 'default',
        icon: PlayCircle,
    },
    FINISHED: {
        label: 'Selesai',
        variant: 'secondary',
        icon: CheckCircle2,
    },
    TIMEOUT: {
        label: 'Timeout',
        variant: 'destructive',
        icon: AlertCircle,
    },
    CANCELLED: {
        label: 'Dibatalkan',
        variant: 'outline',
        icon: XCircle,
    },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DashboardPage() {
    const { user } = useAuth();
    const { mutate: logout, isPending: isLoggingOut } = useLogout();
    const [isMounted, setIsMounted] = useState(false);

    // Prevent hydration issues
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Fetch dashboard data
    const { data: stats, isLoading: statsLoading } = useMyStats();
    const { data: inProgressData, isLoading: inProgressLoading } = useUserExams({
        status: 'IN_PROGRESS',
        limit: 10
    });
    const { data: recentResultsData, isLoading: resultsLoading } = useMyResults({
        page: 1,
        limit: 6
    });
    const { data: availableExamsData, isLoading: examsLoading } = useExams({
        page: 1,
        limit: 6
    });

    // Extract data from responses
    // ✅ P2 FIX: Removed redundant filter - backend already filters by status='IN_PROGRESS'
    const inProgressSessions: UserExam[] = inProgressData?.data ?? [];
    const recentResults: ExamResult[] = recentResultsData ?? [];
    const availableExams: ExamPublic[] = availableExamsData ?? [];

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg" />
                        <span className="font-bold text-xl">Prestige Tryout</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{user?.name || user?.email}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => logout()}
                            disabled={isLoggingOut}
                        >
                            {isLoggingOut ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <LogOut className="h-4 w-4" />
                            )}
                            <span className="ml-2">Logout</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Page Title */}
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold">Dashboard Peserta</h1>
                    <p className="text-muted-foreground mt-1">
                        Selamat datang, {user?.name || user?.email}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 space-y-8">
                {/* High-level Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statsLoading ? (
                        <>
                            <Skeleton className="h-32" />
                            <Skeleton className="h-32" />
                            <Skeleton className="h-32" />
                            <Skeleton className="h-32" />
                        </>
                    ) : (
                        <>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Ujian Selesai
                                    </CardTitle>
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {stats?.completedExams ?? 0}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Total ujian yang telah diselesaikan
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Rata-rata Skor
                                    </CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {stats?.averageScore ?? 0}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Dari semua ujian yang diselesaikan
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Waktu
                                    </CardTitle>
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {formatTimeSpent(stats?.totalTime ?? 0)}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Total waktu mengerjakan ujian
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Ujian Aktif
                                    </CardTitle>
                                    <PlayCircle className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {inProgressSessions.length}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Ujian yang sedang berlangsung
                                    </p>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                {/* Active Sessions */}
                {inProgressSessions.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PlayCircle className="h-5 w-5 text-primary" />
                                Ujian Berlangsung
                            </CardTitle>
                            <CardDescription>
                                Lanjutkan ujian yang sedang Anda kerjakan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                {inProgressSessions.map((session: UserExam) => {
                                    const statusInfo = statusConfig[session.status];
                                    const StatusIcon = statusInfo?.icon ?? PlayCircle;

                                    return (
                                        <Card key={session.id} className="border-primary/20">
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <h3 className="font-semibold line-clamp-1">
                                                        {session.exam.title}
                                                    </h3>
                                                    <div className="flex flex-col gap-1 items-end">
                                                        <Badge variant={statusInfo?.variant ?? 'default'}>
                                                            <StatusIcon className="h-3 w-3 mr-1" />
                                                            {statusInfo?.label ?? session.status}
                                                        </Badge>
                                                        {/* ✅ P2 FIX: Show attempt number */}
                                                        <Badge variant="outline" className="text-xs">
                                                            Percobaan ke-{session.attemptNumber}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                                                    {/* ✅ PHASE 3 FIX: Use durationMinutes from root */}
                                                    {session.durationMinutes && (
                                                        <div className="flex items-center gap-2">
                                                            <Timer className="h-4 w-4" />
                                                            {formatDuration(session.durationMinutes)}
                                                        </div>
                                                    )}
                                                    {/* ✅ PHASE 3 FIX: Use startedAt (not startTime) */}
                                                    {isMounted && session.startedAt && (
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4" />
                                                            Dimulai <TimeAgo date={session.startedAt} />
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2">
                                                        <Target className="h-4 w-4" />
                                                        {session.answeredQuestions}/{session.totalQuestions} soal
                                                    </div>
                                                </div>

                                                <Button asChild className="w-full">
                                                    <Link href={`/exam-sessions/${session.id}/take`}>
                                                        <PlayCircle className="h-4 w-4 mr-2" />
                                                        Lanjutkan
                                                    </Link>
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Recent Results */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-primary" />
                                Hasil Terbaru
                            </CardTitle>
                            <CardDescription>
                                Hasil ujian yang baru saja Anda selesaikan
                            </CardDescription>
                        </div>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/results">Lihat Semua</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {resultsLoading ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {[1, 2, 3].map((i) => (
                                    <Skeleton key={i} className="h-40" />
                                ))}
                            </div>
                        ) : recentResults.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Belum ada hasil ujian</p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {recentResults.map((result: ExamResult) => {
                                    const passingScore = result.exam.passingScore ?? 0;
                                    const isPassed = result.totalScore !== null &&
                                        passingScore > 0 &&
                                        result.totalScore >= passingScore;

                                    return (
                                        <Card key={result.id}>
                                            <CardContent className="p-4">
                                                <h3 className="font-semibold line-clamp-1 mb-2">
                                                    {result.exam.title}
                                                </h3>

                                                {/* Pass/Fail Badge */}
                                                {passingScore > 0 && (
                                                    <Badge
                                                        variant={isPassed ? 'default' : 'destructive'}
                                                        className="mb-3"
                                                    >
                                                        {isPassed ? (
                                                            <>
                                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                Lulus
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircle className="h-3 w-3 mr-1" />
                                                                Tidak Lulus
                                                            </>
                                                        )}
                                                    </Badge>
                                                )}

                                                <div className="space-y-1 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Skor</span>
                                                        <span className="font-medium">
                                                            {result.totalScore ?? 0}
                                                            {passingScore > 0 && ` / ${passingScore}`}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Dijawab</span>
                                                        <span>
                                                            {result.answeredQuestions}/{result.totalQuestions}
                                                        </span>
                                                    </div>
                                                </div>

                                                <Button asChild variant="outline" size="sm" className="w-full mt-4">
                                                    <Link href={`/results/${result.id}`}>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Detail
                                                    </Link>
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Available Exams */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-primary" />
                                Ujian Tersedia
                            </CardTitle>
                            <CardDescription>
                                Mulai ujian baru
                            </CardDescription>
                        </div>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/exams">Lihat Semua</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {examsLoading ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {[1, 2, 3].map((i) => (
                                    <Skeleton key={i} className="h-40" />
                                ))}
                            </div>
                        ) : availableExams.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Tidak ada ujian tersedia saat ini</p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {availableExams.map((exam: ExamPublic) => (
                                    <Card key={exam.id}>
                                        <CardContent className="p-4">
                                            <h3 className="font-semibold line-clamp-1 mb-2">
                                                {exam.title}
                                            </h3>
                                            {exam.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                    {exam.description}
                                                </p>
                                            )}

                                            <div className="space-y-1 text-sm text-muted-foreground mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Timer className="h-4 w-4" />
                                                    {formatDuration(exam.durationMinutes)}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Target className="h-4 w-4" />
                                                    {exam._count?.examQuestions ?? 0} soal
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Award className="h-4 w-4" />
                                                    <span>Passing: {exam.passingScore}</span>
                                                </div>
                                            </div>

                                            <Button asChild className="w-full">
                                                <Link href={`/exams/${exam.id}`}>
                                                    Mulai Ujian
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Proctoring Notice */}
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="flex items-center gap-4 py-6">
                        <Camera className="h-10 w-10 text-primary flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold">Fitur Proctoring Aktif</h3>
                            <p className="text-sm text-muted-foreground">
                                Ujian menggunakan deteksi wajah YOLO untuk memastikan
                                integritas ujian. Pastikan kamera Anda aktif dan wajah
                                terlihat jelas saat mengerjakan ujian.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}