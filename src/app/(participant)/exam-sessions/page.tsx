'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useUserExams } from '@/features/exam-sessions/hooks/useUserExams';
import { UserExamCard } from '@/features/exam-sessions/components/UserExamCard';
import type { ExamStatus, UserExam } from '@/features/exam-sessions/types/exam-sessions.types';

export default function ExamSessionsPage() {
    const [statusFilter, setStatusFilter] = useState<ExamStatus | 'all'>('all');

    const { data, isLoading, error } = useUserExams({
        page: 1,
        limit: 20,
        status: statusFilter !== 'all' ? statusFilter : undefined,
    });

    if (error) {
        return (
            <div className="container mx-auto py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Failed to load exam sessions. Please try again later.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const sessions = data?.data || [];

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">My Exam Sessions</h1>
                <p className="text-muted-foreground mt-2">
                    View and manage your exam sessions
                </p>
            </div>

            {/* Filters */}
            <Tabs
                value={statusFilter}
                onValueChange={(v: string) => setStatusFilter(v as ExamStatus | 'all')}
            >
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="IN_PROGRESS">In Progress</TabsTrigger>
                    <TabsTrigger value="FINISHED">Finished</TabsTrigger>
                    <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
                </TabsList>

                <TabsContent value={statusFilter} className="mt-6">
                    {/* Loading State */}
                    {isLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-64" />
                            ))}
                        </div>
                    )}

                    {/* Sessions Grid */}
                    {!isLoading && sessions.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {sessions.map((session: UserExam) => (
                                <UserExamCard key={session.id} userExam={session} />
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && sessions.length === 0 && (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <p className="text-muted-foreground">
                                    No exam sessions found
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}