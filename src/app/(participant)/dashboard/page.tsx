'use client';

/**
 * PARTICIPANT DASHBOARD
 *
 * ✅ HYDRATION FIX: Uses client-side only rendering for time-sensitive content
 * ✅ TYPE-SAFE: All data properly typed with existing backend contracts
 * ✅ SSR-SAFE: No localStorage access during initial render
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks';
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
} from 'lucide-react';
import Link from 'next/link';

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
 * Format date to relative time (client-side only to avoid hydration issues)
 */
function useRelativeTime(date: string | Date): string {
    const [relativeTime, setRelativeTime] = useState<string>('');

    useEffect(() => {
        // Only run on client side
        if (typeof window !== 'undefined') {
            const now = new Date();
            const target = new Date(date);
            const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

            if (diffInSeconds < 60) {
                setRelativeTime('baru saja');
            } else if (diffInSeconds < 3600) {
                const minutes = Math.floor(diffInSeconds / 60);
                setRelativeTime(`${minutes} menit yang lalu`);
            } else if (diffInSeconds < 86400) {
                const hours = Math.floor(diffInSeconds / 3600);
                setRelativeTime(`${hours} jam yang lalu`);
            } else {
                const days = Math.floor(diffInSeconds / 86400);
                setRelativeTime(`${days} hari yang lalu`);
            }
        }
    }, [date]);

    return relativeTime;
}

/**
 * Get status badge configuration
 */
function getStatusBadge(status: string): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } {
    const configs: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
        IN_PROGRESS: { label: 'Sedang Berlangsung', variant: 'default' },
        FINISHED: { label: 'Selesai', variant: 'secondary' },
        TIMEOUT: { label: 'Waktu Habis', variant: 'destructive' },
        CANCELLED: { label: 'Dibatalkan', variant: 'outline' },
    };
    return configs[status] || { label: status, variant: 'outline' };
}

/**
 * Loading skeleton for stats cards
 */
function StatsCardSkeleton() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-32" />
            </CardContent>
        </Card>
    );
}

/**
 * Time display component with hydration safety
 */
function TimeAgo({ date }: { date: string }) {
    const timeAgo = useRelativeTime(date);

    if (!timeAgo) {
        return <span className="text-xs text-muted-foreground">...</span>;
    }

    return <span className="text-xs text-muted-foreground">{timeAgo}</span>;
}

/**
 * Main Dashboard Component
 */
export default function ParticipantDashboardPage() {
    const { user } = useAuth();
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
        status: 'active',
        page: 1,
        limit: 6
    });

    // Extract data from responses
    const inProgressSessions = inProgressData?.data || [];
    const recentResults = recentResultsData?.data || [];
    const availableExams = availableExamsData?.data || [];

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
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
                            <StatsCardSkeleton />
                            <StatsCardSkeleton />
                            <StatsCardSkeleton />
                            <StatsCardSkeleton />
                        </>
                    ) : (
                        <>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Ujian Diselesaikan</CardTitle>
                                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats?.completedExams || 0}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Total ujian yang telah Anda selesaikan
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Sedang Berlangsung</CardTitle>
                                    <PlayCircle className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{inProgressSessions.length}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Ujian yang sedang Anda kerjakan
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Rata-rata Skor</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {stats?.averageScore ? stats.averageScore.toFixed(1) : '0.0'}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Dari {stats?.completedExams || 0} ujian
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Waktu</CardTitle>
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {stats?.totalTime ? formatTimeSpent(stats.totalTime) : '0 menit'}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Waktu mengerjakan ujian
                                    </p>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                {/* Active / In-Progress Sessions */}
                {inProgressSessions.length > 0 && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Ujian Sedang Berlangsung</CardTitle>
                                    <CardDescription>
                                        Lanjutkan ujian yang sedang Anda kerjakan
                                    </CardDescription>
                                </div>
                                <Badge variant="default" className="ml-auto">
                                    {inProgressSessions.length} Aktif
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {inProgressLoading ? (
                                <div className="space-y-3">
                                    {[1, 2].map((i) => (
                                        <Skeleton key={i} className="h-24 w-full" />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {inProgressSessions.map((session) => (
                                        <div
                                            key={session.id}
                                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold">{session.exam.title}</h3>
                                                    <Badge variant={getStatusBadge(session.status).variant}>
                                                        {getStatusBadge(session.status).label}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Timer className="h-4 w-4" />
                                                        {formatDuration(session.exam.durationMinutes)}
                                                    </span>
                                                    {isMounted && (
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            Dimulai <TimeAgo date={session.startTime || session.createdAt} />
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <Link href={`/exam-session/${session.id}`}>
                                                <Button>
                                                    <PlayCircle className="h-4 w-4 mr-2" />
                                                    Lanjutkan
                                                </Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Recent Results Summary */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Hasil Ujian Terbaru</CardTitle>
                                <CardDescription>
                                    Riwayat 6 ujian terakhir yang telah Anda selesaikan
                                </CardDescription>
                            </div>
                            {recentResults.length > 0 && (
                                <Link href="/results">
                                    <Button variant="outline" size="sm">
                                        Lihat Semua
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {resultsLoading ? (
                            <div className="grid gap-4 md:grid-cols-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <Skeleton key={i} className="h-32 w-full" />
                                ))}
                            </div>
                        ) : recentResults.length === 0 ? (
                            <div className="text-center py-12">
                                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                                <p className="text-muted-foreground">
                                    Anda belum menyelesaikan ujian apapun
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Mulai ujian untuk melihat hasil di sini
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {recentResults.map((result) => {
                                    const statusBadge = getStatusBadge(result.status);
                                    const isPassed = result.totalScore !== null && result.totalScore !== undefined
                                        ? result.totalScore >= result.exam.passingScore
                                        : null;

                                    return (
                                        <div
                                            key={result.id}
                                            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold line-clamp-1">{result.exam.title}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant={statusBadge.variant} className="text-xs">
                                                            {statusBadge.label}
                                                        </Badge>
                                                        {isPassed !== null && (
                                                            <Badge
                                                                variant={isPassed ? 'default' : 'destructive'}
                                                                className="text-xs"
                                                            >
                                                                {isPassed ? 'Lulus' : 'Tidak Lulus'}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                {result.totalScore !== null && result.totalScore !== undefined && (
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold">{result.totalScore}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            / {result.exam.passingScore} min
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Score Breakdown by Type */}
                                            {result.scoresByType && result.scoresByType.length > 0 && (
                                                <div className="space-y-2 mb-3">
                                                    {result.scoresByType.map((scoreType) => (
                                                        <div key={scoreType.type} className="flex items-center justify-between text-sm">
                                                            <span className="text-muted-foreground">{scoreType.type}</span>
                                                            <span className="font-medium">
                                                                {scoreType.score} / {scoreType.maxScore}
                                                                <span className="text-muted-foreground ml-2">
                                                                    ({scoreType.correctAnswers}/{scoreType.totalQuestions})
                                                                </span>
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between pt-3 border-t">
                                                {isMounted && result.submittedAt && (
                                                    <TimeAgo date={result.submittedAt} />
                                                )}
                                                <Link href={`/results/${result.id}`} className="ml-auto">
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        Detail
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Available Exams */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Ujian Tersedia</CardTitle>
                                <CardDescription>
                                    Ujian yang dapat Anda mulai sekarang
                                </CardDescription>
                            </div>
                            {availableExams.length > 0 && (
                                <Link href="/exams">
                                    <Button variant="outline" size="sm">
                                        Lihat Semua
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {examsLoading ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {[1, 2, 3].map((i) => (
                                    <Skeleton key={i} className="h-40 w-full" />
                                ))}
                            </div>
                        ) : availableExams.length === 0 ? (
                            <div className="text-center py-12">
                                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                                <p className="text-muted-foreground">
                                    Tidak ada ujian yang tersedia saat ini
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Periksa kembali nanti untuk ujian baru
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {availableExams.map((exam) => (
                                    <div
                                        key={exam.id}
                                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="mb-3">
                                            <h3 className="font-semibold line-clamp-2 mb-2">{exam.title}</h3>
                                            {exam.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {exam.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2 mb-4 text-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Timer className="h-4 w-4" />
                                                <span>{formatDuration(exam.durationMinutes)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Target className="h-4 w-4" />
                                                <span>Passing Score: {exam.passingScore}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <BookOpen className="h-4 w-4" />
                                                <span>{exam._count?.examQuestions || 0} Soal</span>
                                            </div>
                                        </div>

                                        <Link href={`/exams/${exam.id}`} className="block">
                                            <Button className="w-full" size="sm">
                                                <PlayCircle className="h-4 w-4 mr-2" />
                                                Mulai Ujian
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Proctoring Info */}
                <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Camera className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                            <CardTitle className="text-amber-900 dark:text-amber-100">
                                Sistem Proctoring
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
                            <p>
                                Sistem ujian ini menggunakan <strong>pengawasan otomatis (proctoring)</strong> untuk menjaga integritas ujian.
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                                <li>Webcam akan aktif selama ujian untuk deteksi wajah</li>
                                <li>Sistem akan mencatat pelanggaran seperti tidak terdeteksi wajah atau multiple faces</li>
                                <li>Pelanggaran berlebihan dapat menyebabkan ujian dibatalkan otomatis</li>
                                <li>Pastikan pencahayaan cukup dan webcam berfungsi dengan baik</li>
                            </ul>
                            <div className="mt-3 p-3 bg-white dark:bg-amber-950/50 rounded border border-amber-300 dark:border-amber-800">
                                <p className="font-medium flex items-center gap-2">
                                    <Award className="h-4 w-4" />
                                    Tips: Kerjakan ujian di ruangan yang tenang dengan pencahayaan yang baik
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}