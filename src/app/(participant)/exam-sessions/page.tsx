'use client';

import { useState } from 'react';
import { useUserExams } from '@/features/exam-sessions/hooks/useUserExams';
import { UserExamCard } from '@/features/exam-sessions/components/UserExamCard';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import type { UserExamStatus } from '@/features/exam-sessions/types/exam-sessions.types';

/**
 * Exam Sessions List Page
 *
 * Shows all user's exam sessions with filtering by status
 */
export default function ExamSessionsPage() {
    const [statusFilter, setStatusFilter] = useState<UserExamStatus | undefined>(undefined);

    // Fetch user exams with proper generics
    // Returns: { data: { data: UserExam[], pagination: {...} } }
    const { data, isLoading } = useUserExams({
        status: statusFilter,
        page: 1,
        limit: 20,
    });

    // Access the sessions array from the data wrapper
    // data is { data: UserExam[], pagination: {...} }
    const sessions = data?.data || [];

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Ujian Saya</h1>
                <p className="text-gray-600 mt-2">
                    Daftar ujian yang telah Anda daftarkan
                </p>
            </div>

            {/* Status Filter */}
            <Tabs
                value={statusFilter || 'all'}
                onValueChange={(value) =>
                    setStatusFilter(value === 'all' ? undefined : (value as UserExamStatus))
                }
            >
                <TabsList>
                    <TabsTrigger value="all">Semua</TabsTrigger>
                    <TabsTrigger value="NOT_STARTED">Belum Dimulai</TabsTrigger>
                    <TabsTrigger value="IN_PROGRESS">Sedang Berlangsung</TabsTrigger>
                    <TabsTrigger value="FINISHED">Selesai</TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Sessions Grid */}
            {isLoading ? (
                <div className="text-center py-12 text-gray-500">
                    Memuat data...
                </div>
            ) : sessions.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <p className="text-gray-600">
                            {statusFilter
                                ? `Tidak ada ujian dengan status ${statusFilter}`
                                : 'Belum ada ujian yang terdaftar'}
                        </p>
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
    );
}