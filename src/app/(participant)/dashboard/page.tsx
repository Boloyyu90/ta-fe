// src/app/(participant)/dashboard/page.tsx

'use client';

import { useExamsStats } from '@/features/exams/hooks/useExamsStats'; // ✅ FIXED: Import from exams module
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { BookOpen, Clock, TrendingUp } from 'lucide-react';

export default function ParticipantDashboardPage() {
    const { data: stats, isLoading } = useExamsStats();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p>Loading stats...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Welcome back! Here's your exam overview
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalExams || 0}</div>
                        <p className="text-xs text-muted-foreground">Available exams</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.averageDuration || 0} min</div>
                        <p className="text-xs text-muted-foreground">Average time</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Passing Score</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.averagePassingScore || 0}</div>
                        <p className="text-xs text-muted-foreground">Points required</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}