'use client';

import { useUserExams } from '@/features/exam-sessions/hooks/useUserExams';
import { useExamsStats } from '@/features/exam-sessions/hooks/useExamsStats';
import { useMyStats } from '@/features/exam-sessions/hooks/useMyStats';
import { UserExamCard } from '@/features/exam-sessions/components/UserExamCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { BookOpen, Clock, TrendingUp, Award } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';

/**
 * Participant Dashboard Page
 *
 * Shows:
 * - Personal statistics
 * - Available exams statistics
 * - Recent exam sessions
 */
export default function DashboardPage() {
    // Fetch user's exam sessions with proper generics
    // Returns: { data: { data: UserExam[], pagination: {...} } }
    const { data: sessionsData, isLoading: sessionsLoading } = useUserExams({
        page: 1,
        limit: 6,
    });

    // Fetch personal statistics
    const { data: myStats, isLoading: statsLoading } = useMyStats();

    // Fetch exams statistics
    const { data: examsStats, isLoading: examsStatsLoading } = useExamsStats();

    // Access the sessions array from the data wrapper
    // sessionsData is { data: UserExam[], pagination: {...} }
    const sessions = sessionsData?.data || [];

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-gray-600 mt-2">
                    Selamat datang di platform tryout CPNS
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Available Exams */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Ujian Tersedia
                        </CardTitle>
                        <BookOpen className="w-4 h-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {examsStatsLoading ? '...' : examsStats?.totalExams || 0}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Siap dikerjakan
                        </p>
                    </CardContent>
                </Card>

                {/* Completed Exams */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Ujian Selesai
                        </CardTitle>
                        <Award className="w-4 h-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {statsLoading ? '...' : myStats?.completedExams || 0}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Total pengerjaan
                        </p>
                    </CardContent>
                </Card>

                {/* Average Score */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Rata-rata Skor
                        </CardTitle>
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {statsLoading ? '...' : myStats?.averageScore?.toFixed(1) || 0}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Dari semua ujian
                        </p>
                    </CardContent>
                </Card>

                {/* Total Time */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total Waktu
                        </CardTitle>
                        <Clock className="w-4 h-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {statsLoading
                                ? '...'
                                : `${Math.floor((myStats?.totalTime || 0) / 60)}m`}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Waktu belajar
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Exam Sessions */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Ujian Terbaru</h2>
                    <Link href="/exam-sessions">
                        <Button variant="outline">Lihat Semua</Button>
                    </Link>
                </div>

                {sessionsLoading ? (
                    <div className="text-center py-12 text-gray-500">
                        Memuat data...
                    </div>
                ) : sessions.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-12">
                            <p className="text-gray-600">
                                Belum ada ujian yang terdaftar
                            </p>
                            <Link href="/exams">
                                <Button className="mt-4">
                                    Jelajahi Ujian
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sessions.map((session) => (
                            <UserExamCard key={session.id} userExam={session} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}