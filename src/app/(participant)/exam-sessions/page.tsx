'use client';

import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '@/features/exam-sessions/api/exam-sessions.api';
import { UserExamCard } from '@/features/exam-sessions/components/UserExamCard';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import type { ExamStatus, UserExam } from '@/features/exam-sessions/types/exam-sessions.types';

export default function ExamSessionsPage() {
    const [statusFilter, setStatusFilter] = useState<ExamStatus | 'all'>('all');

    const { data, isLoading, error } = useQuery({
        queryKey: ['my-results'],
        queryFn: () => examSessionsApi.getMyResults({ page: 1, limit: 100 }),
    });

    if (isLoading) {
        return (
            <div className="container py-8">
                <h1 className="text-3xl font-bold mb-6">My Exam Sessions</h1>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-48 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="container py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Failed to load exam sessions</AlertDescription>
                </Alert>
            </div>
        );
    }

    const userExams = data.data || [];
    const filteredExams = userExams.filter((userExam: UserExam) => {
        if (statusFilter === 'all') return true;
        return userExam.status === statusFilter;
    });

    const statusCounts = {
        all: userExams.length,
        IN_PROGRESS: userExams.filter((e: UserExam) => e.status === 'IN_PROGRESS').length,
        FINISHED: userExams.filter((e: UserExam) => e.status === 'FINISHED').length,
        TIMEOUT: userExams.filter((e: UserExam) => e.status === 'TIMEOUT').length,
        CANCELLED: userExams.filter((e: UserExam) => e.status === 'CANCELLED').length,
    };

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-6">My Exam Sessions</h1>

            {/* Status Filter Tabs */}
            <Tabs
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as ExamStatus | 'all')}
                className="mb-6"
            >
                <TabsList>
                    <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
                    <TabsTrigger value="IN_PROGRESS">
                        In Progress ({statusCounts.IN_PROGRESS})
                    </TabsTrigger>
                    <TabsTrigger value="FINISHED">
                        Finished ({statusCounts.FINISHED})
                    </TabsTrigger>
                    <TabsTrigger value="TIMEOUT">
                        Timeout ({statusCounts.TIMEOUT})
                    </TabsTrigger>
                    <TabsTrigger value="CANCELLED">
                        Cancelled ({statusCounts.CANCELLED})
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Exam Sessions List */}
            {filteredExams.length > 0 ? (
                <div className="space-y-4">
                    {filteredExams.map((userExam: UserExam) => (
                        <UserExamCard key={userExam.id} userExam={userExam} />
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        No exam sessions found for this filter
                    </CardContent>
                </Card>
            )}
        </div>
    );
}