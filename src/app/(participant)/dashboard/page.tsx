"use client";

import { useAuth } from "@/features/auth/hooks";
import { useMyStats } from "@/features/users/hooks";
import { useUserExams, useMyResults } from "@/features/exam-sessions/hooks";
import { useExams } from "@/features/exams/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
    StatsCard,
    SectionHeader,
    ExamPreviewCard,
    ResultPreviewCard,
    InProgressCard,
} from "@/features/dashboard/components/shared";
import {
    BookOpen,
    Clock,
    TrendingUp,
    PlayCircle,
    Camera,
} from "lucide-react";
import type { UserExam, ExamResult } from "@/features/exam-sessions/types/exam-sessions.types";
import type { ExamPublic } from "@/features/exams/types/exams.types";

/**
 * Format duration in minutes to readable string
 */
function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} menit`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}j ${mins}m` : `${hours} jam`;
}

export default function DashboardPage() {
    const { user } = useAuth();

    // Fetch dashboard data
    const { data: statsData, isLoading: statsLoading } = useMyStats();
    const { data: inProgressData } = useUserExams({
        status: "IN_PROGRESS",
        limit: 10,
    });
    const { data: recentResultsData, isLoading: resultsLoading } = useMyResults({
        page: 1,
        limit: 3,
    });
    const { data: availableExamsData, isLoading: examsLoading } = useExams({
        page: 1,
        limit: 6,
    });

    // Extract stats with fallback for loading state
    const stats = statsData?.stats ?? {
        completedExams: 0,
        averageScore: null,
        totalTimeMinutes: 0,
        activeExams: 0,
    };

    // Extract data from responses
    const inProgressSessions: UserExam[] = inProgressData?.data ?? [];
    const recentResults: ExamResult[] = recentResultsData ?? [];
    const availableExams: ExamPublic[] = availableExamsData ?? [];

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg p-6 mx-4 mt-6 md:mx-6">
                <h1 className="text-2xl md:text-3xl font-bold">
                    Selamat Datang, {user?.name || "Peserta"}!
                </h1>
                <p className="text-muted-foreground mt-1">
                    Pantau progress ujian dan mulai ujian baru dari dashboard ini.
                </p>
            </section>

            <div className="container mx-auto px-4 pb-8 space-y-8">
                {/* Stats Grid */}
                <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statsLoading ? (
                        <>
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-32" />
                            ))}
                        </>
                    ) : (
                        <>
                            <StatsCard
                                title="Ujian Selesai"
                                value={stats.completedExams}
                                icon={BookOpen}
                                description="Total ujian yang telah diselesaikan"
                            />
                            <StatsCard
                                title="Rata-rata Skor"
                                value={
                                    stats.averageScore !== null
                                        ? stats.averageScore.toFixed(1)
                                        : "-"
                                }
                                icon={TrendingUp}
                                description="Dari semua ujian yang diselesaikan"
                            />
                            <StatsCard
                                title="Total Waktu"
                                value={formatDuration(stats.totalTimeMinutes)}
                                icon={Clock}
                                description="Total waktu mengerjakan ujian"
                            />
                            <StatsCard
                                title="Ujian Aktif"
                                value={stats.activeExams}
                                icon={PlayCircle}
                                description="Ujian yang sedang berlangsung"
                            />
                        </>
                    )}
                </section>

                {/* In Progress Section */}
                {inProgressSessions.length > 0 && (
                    <section className="space-y-4">
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
                                    {inProgressSessions.map((session) => (
                                        <InProgressCard
                                            key={session.id}
                                            session={session}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                )}

                {/* Available Exams Section */}
                <section className="space-y-4">
                    <SectionHeader
                        title="Pilihan Ujian Terbaru"
                        actionLabel="Selengkapnya"
                        actionHref="/exams"
                    />
                    {examsLoading ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-48" />
                            ))}
                        </div>
                    ) : availableExams.length === 0 ? (
                        <Card>
                            <CardContent className="py-8">
                                <div className="text-center text-muted-foreground">
                                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>Tidak ada ujian tersedia saat ini</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {availableExams.map((exam) => (
                                <ExamPreviewCard key={exam.id} exam={exam} />
                            ))}
                        </div>
                    )}
                </section>

                {/* Recent Results Section */}
                {recentResults.length > 0 && (
                    <section className="space-y-4">
                        <SectionHeader
                            title="Hasil Terbaru"
                            actionLabel="Lihat Semua"
                            actionHref="/results"
                        />
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {resultsLoading
                                ? [1, 2, 3].map((i) => (
                                      <Skeleton key={i} className="h-40" />
                                  ))
                                : recentResults.map((result) => (
                                      <ResultPreviewCard
                                          key={result.id}
                                          result={result}
                                      />
                                  ))}
                        </div>
                    </section>
                )}

                {/* Proctoring Notice */}
                <section>
                    <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="flex items-center gap-4 py-6">
                            <Camera className="h-10 w-10 text-primary flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold">
                                    Fitur Proctoring Aktif
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Ujian menggunakan deteksi wajah YOLO untuk
                                    memastikan integritas ujian. Pastikan kamera
                                    Anda aktif dan wajah terlihat jelas saat
                                    mengerjakan ujian.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
}
