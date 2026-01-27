"use client";

/**
 * ADMIN DASHBOARD
 *
 * PURPOSE:
 * - Landing page after admin login
 * - Overview of system statistics, active sessions, recent results
 * - Real-time data from backend APIs
 *
 * ENDPOINTS USED:
 * - GET /api/v1/admin/users?page=1&limit=1 → totalUsers
 * - GET /api/v1/admin/exams?page=1&limit=1 → totalExams
 * - GET /api/v1/admin/exam-sessions?status=IN_PROGRESS → activeSessions
 * - GET /api/v1/admin/questions?page=1&limit=1 → totalQuestions
 * - GET /api/v1/admin/results → recentResults
 *
 * ROUTE: /admin/dashboard
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQueries } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

// Auth hooks
import { useAuth, useLogout } from "@/features/auth/hooks";

// Admin data hooks (existing - for sessions and results)
import { useAdminActiveSessions, useAdminRecentResults } from "@/features/exam-sessions/hooks";

// API clients for stats (domain ownership)
import { usersApi } from "@/features/users/api/users.api";
import { examsApi } from "@/features/exams/api/exams.api";
import { questionsApi } from "@/features/questions/api/questions.api";
import { adminSessionsApi } from "@/features/exam-sessions/api/admin-sessions.api";

// UI Components
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
    Loader2,
    Users,
    BookOpen,
    Activity,
    AlertCircle,
    LogOut,
    User,
    ShieldCheck,
    BarChart3,
    FileText,
    Trophy,
    Clock,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    RefreshCw,
    Eye,
    Receipt,
} from "lucide-react";

// Types
import type { ExamStatus } from "@/shared/types/enum.types";

// ============================================================================
// STATUS CONFIGURATION
// ============================================================================

const statusConfig: Record<
    ExamStatus,
    {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
        icon: typeof CheckCircle2;
    }
> = {
    IN_PROGRESS: {
        label: "Berlangsung",
        variant: "default",
        icon: Clock,
    },
    FINISHED: {
        label: "Selesai",
        variant: "secondary",
        icon: CheckCircle2,
    },
    TIMEOUT: {
        label: "Timeout",
        variant: "destructive",
        icon: AlertTriangle,
    },
    CANCELLED: {
        label: "Dibatalkan",
        variant: "outline",
        icon: XCircle,
    },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format relative time using date-fns with Indonesian locale
 */
function formatRelativeTime(dateString: string): string {
    try {
        const date = new Date(dateString);
        return formatDistanceToNow(date, { addSuffix: true, locale: idLocale });
    } catch {
        return "-";
    }
}

// ============================================================================
// SKELETON COMPONENTS
// ============================================================================

function StatCardSkeleton() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-32" />
            </CardContent>
        </Card>
    );
}

function SessionRowSkeleton() {
    return (
        <div className="flex items-center justify-between py-3 border-b last:border-0">
            <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-48" />
                </div>
            </div>
            <Skeleton className="h-5 w-20" />
        </div>
    );
}

function ResultRowSkeleton() {
    return (
        <div className="flex items-center justify-between py-3 border-b last:border-0">
            <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-48" />
                </div>
            </div>
            <div className="text-right">
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-3 w-12" />
            </div>
        </div>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AdminDashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const { mutate: logout, isPending: isLoggingOut } = useLogout();

    // ========================================================================
    // STEP 3: Parallel stats fetching with useQueries (direct in page)
    // ========================================================================
    const statsQueries = useQueries({
        queries: [
            {
                queryKey: ["admin-stats", "users"],
                queryFn: () => usersApi.getUsers({ page: 1, limit: 1 }),
                staleTime: 60 * 1000,
            },
            {
                queryKey: ["admin-stats", "exams"],
                queryFn: () => examsApi.getAdminExams({ page: 1, limit: 1 }),
                staleTime: 60 * 1000,
            },
            {
                queryKey: ["admin-stats", "questions"],
                queryFn: () => questionsApi.getQuestions({ page: 1, limit: 1 }),
                staleTime: 60 * 1000,
            },
            {
                queryKey: ["admin-stats", "active-sessions"],
                queryFn: () =>
                    adminSessionsApi.getAdminSessions({
                        page: 1,
                        limit: 1,
                        status: "IN_PROGRESS",
                    }),
                staleTime: 30 * 1000,
            },
        ],
    });

    const [usersResult, examsResult, questionsResult, sessionsCountResult] = statsQueries;

    const statsLoading = statsQueries.some((q) => q.isLoading);
    const statsError = statsQueries.some((q) => q.isError);

    const stats = {
        totalUsers: usersResult.data?.pagination?.total ?? 0,
        totalExams: examsResult.data?.pagination?.total ?? 0,
        totalQuestions: questionsResult.data?.pagination?.total ?? 0,
        activeSessions: sessionsCountResult.data?.pagination?.total ?? 0,
    };

    const refetchStats = () => {
        statsQueries.forEach((q) => q.refetch());
    };

    // ========================================================================
    // STEP 4: Fetch Active Sessions + Recent Results (using existing hooks)
    // ========================================================================
    const {
        data: activeSessionsData,
        isLoading: sessionsLoading,
        isError: sessionsError,
        refetch: refetchSessions,
    } = useAdminActiveSessions({ limit: 5 });

    const {
        data: recentResultsData,
        isLoading: resultsLoading,
        isError: resultsError,
        refetch: refetchResults,
    } = useAdminRecentResults({ limit: 5 });

    // Extract data
    const activeSessions = activeSessionsData?.data ?? [];
    const recentResults = recentResultsData?.data ?? [];

    // ========================================================================
    // AUTH REDIRECTS
    // ========================================================================
    useEffect(() => {
        if (!isAuthLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, isAuthLoading, router]);

    useEffect(() => {
        if (!isAuthLoading && isAuthenticated && user?.role === "PARTICIPANT") {
            router.push("/dashboard");
        }
    }, [isAuthenticated, isAuthLoading, user, router]);

    // Handle logout
    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => {
                router.push("/login");
            },
        });
    };

    // Refresh all data
    const handleRefreshAll = () => {
        refetchStats();
        refetchSessions();
        refetchResults();
    };

    // Show loading state
    if (isAuthLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Memuat dashboard...</p>
                </div>
            </div>
        );
    }

    // Ensure admin only
    if (user.role !== "ADMIN") {
        return null;
    }

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <header className="bg-background border-b border-border sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <ShieldCheck className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                                <p className="text-sm text-muted-foreground">
                                    Sistem Ujian CPNS - Panel Administrasi
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Refresh Button */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRefreshAll}
                                disabled={statsLoading || sessionsLoading || resultsLoading}
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${statsLoading ? "animate-spin" : ""}`} />
                                Refresh
                            </Button>

                            {/* User info */}
                            <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">{user.name}</span>
                                <Badge variant="default">Admin</Badge>
                            </div>

                            {/* Logout button */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                            >
                                {isLoggingOut ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <LogOut className="h-4 w-4 mr-2" />
                                )}
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    {statsLoading ? (
                        <>
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                        </>
                    ) : statsError ? (
                        <Card className="col-span-full">
                            <CardContent className="flex items-center justify-center py-8">
                                <div className="text-center">
                                    <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                                    <p className="text-muted-foreground">Gagal memuat statistik</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-2"
                                        onClick={() => refetchStats()}
                                    >
                                        Coba Lagi
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            {/* Total Users */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Peserta dan admin terdaftar
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Total Exams */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Ujian</CardTitle>
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.totalExams}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Paket ujian tersedia
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Active Sessions */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Sesi Aktif</CardTitle>
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.activeSessions}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Ujian sedang berlangsung
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Total Questions */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Bank Soal</CardTitle>
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.totalQuestions}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Soal tersedia (TIU, TKP, TWK)
                                    </p>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                {/* Content Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Active Exam Sessions */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Activity className="h-5 w-5 text-primary" />
                                        Sesi Ujian Aktif
                                    </CardTitle>
                                    <CardDescription>
                                        Peserta yang sedang mengerjakan ujian
                                    </CardDescription>
                                </div>
                                <Link href="/admin/sessions?status=IN_PROGRESS">
                                    <Button variant="ghost" size="sm">
                                        <Eye className="h-4 w-4 mr-1" />
                                        Lihat Semua
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {sessionsLoading ? (
                                <div className="space-y-0 divide-y">
                                    <SessionRowSkeleton />
                                    <SessionRowSkeleton />
                                    <SessionRowSkeleton />
                                </div>
                            ) : sessionsError ? (
                                <div className="text-center py-8">
                                    <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                                    <p className="text-muted-foreground text-sm">Gagal memuat data</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-2"
                                        onClick={() => refetchSessions()}
                                    >
                                        Coba Lagi
                                    </Button>
                                </div>
                            ) : activeSessions.length === 0 ? (
                                <div className="text-center py-8">
                                    <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-muted-foreground text-sm">
                                        Tidak ada ujian yang sedang berlangsung
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-0 divide-y">
                                    {activeSessions.map((session) => {
                                        const StatusIcon = statusConfig[session.status]?.icon ?? Clock;
                                        return (
                                            <div
                                                key={session.id}
                                                className="flex items-center justify-between py-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <User className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            {session.user?.name ?? "Unknown User"}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {session.exam?.title ?? "Unknown Exam"} •{" "}
                                                            {session.answeredQuestions}/{session.totalQuestions} soal
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge variant={statusConfig[session.status]?.variant ?? "outline"}>
                                                    <StatusIcon className="h-3 w-3 mr-1" />
                                                    {statusConfig[session.status]?.label ?? session.status}
                                                </Badge>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Exam Results */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-secondary" />
                                        Hasil Ujian Terbaru
                                    </CardTitle>
                                    <CardDescription>
                                        Ujian yang baru saja diselesaikan
                                    </CardDescription>
                                </div>
                                <Link href="/admin/results">
                                    <Button variant="ghost" size="sm">
                                        <Eye className="h-4 w-4 mr-1" />
                                        Lihat Semua
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {resultsLoading ? (
                                <div className="space-y-0 divide-y">
                                    <ResultRowSkeleton />
                                    <ResultRowSkeleton />
                                    <ResultRowSkeleton />
                                </div>
                            ) : resultsError ? (
                                <div className="text-center py-8">
                                    <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                                    <p className="text-muted-foreground text-sm">Gagal memuat data</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-2"
                                        onClick={() => refetchResults()}
                                    >
                                        Coba Lagi
                                    </Button>
                                </div>
                            ) : recentResults.length === 0 ? (
                                <div className="text-center py-8">
                                    <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-muted-foreground text-sm">
                                        Belum ada hasil ujian
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-0 divide-y">
                                    {recentResults.map((result) => {
                                        const passingScore = result.exam?.passingScore ?? 0;
                                        const isPassed =
                                            result.totalScore !== null &&
                                            result.totalScore >= passingScore;

                                        return (
                                            <div
                                                key={result.id}
                                                className="flex items-center justify-between py-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                                            isPassed
                                                                ? "bg-success/10 text-success"
                                                                : "bg-destructive/10 text-destructive"
                                                        }`}
                                                    >
                                                        {isPassed ? (
                                                            <CheckCircle2 className="h-4 w-4" />
                                                        ) : (
                                                            <XCircle className="h-4 w-4" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            {result.user?.name ?? "Unknown User"}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {result.exam?.title ?? "Unknown Exam"} •{" "}
                                                            {result.submittedAt
                                                                ? formatRelativeTime(result.submittedAt)
                                                                : "-"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold">
                                                        {result.totalScore ?? 0}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {isPassed ? "Lulus" : "Tidak Lulus"}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Aksi Cepat</CardTitle>
                        <CardDescription>
                            Pintasan untuk manajemen sistem
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <Link href="/admin/users">
                                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                                    <Users className="h-5 w-5" />
                                    <span className="text-sm">Kelola Pengguna</span>
                                </Button>
                            </Link>
                            <Link href="/admin/exams">
                                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                                    <BookOpen className="h-5 w-5" />
                                    <span className="text-sm">Kelola Ujian</span>
                                </Button>
                            </Link>
                            <Link href="/admin/questions">
                                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                                    <FileText className="h-5 w-5" />
                                    <span className="text-sm">Bank Soal</span>
                                </Button>
                            </Link>
                            <Link href="/admin/transactions">
                                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                                    <Receipt className="h-5 w-5" />
                                    <span className="text-sm">Transaksi</span>
                                </Button>
                            </Link>
                            <Link href="/admin/results">
                                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    <span className="text-sm">Hasil Ujian</span>
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Admin Info Card */}
                <Card className="mt-6 bg-primary/5 border-primary/20">
                    <CardContent className="py-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-primary/10">
                                <ShieldCheck className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">Login sebagai Administrator</p>
                                <p className="text-sm text-muted-foreground">
                                    ID: {user.id} • Email: {user.email} • Role: {user.role}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}