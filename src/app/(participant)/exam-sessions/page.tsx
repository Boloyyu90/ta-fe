// src/app/(participant)/exam-sessions/page.tsx
'use client';

import { useState } from 'react';
import { Loader2, FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import { useUserExams } from '@/features/exam-sessions/hooks/useUserExams';
import { UserExamCard } from '@/features/exam-sessions/components/UserExamCard';
import type { ExamStatus } from '@/features/exam-sessions/types/exam-sessions.types';

export default function ExamSessionsPage() {
    const [statusFilter, setStatusFilter] = useState<ExamStatus | 'ALL'>('ALL');

    const { data, isLoading, error } = useUserExams();

    const userExams = data?.userExams || [];

    // Filter exams by status
    const filteredExams = userExams.filter((userExam) => {
        if (statusFilter === 'ALL') return true;
        return userExam.status === statusFilter;
    });

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold text-foreground">My Exam Sessions</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Track your ongoing and completed exam sessions
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            {filteredExams.length} {filteredExams.length === 1 ? 'session' : 'sessions'}{' '}
                            found
                        </div>

                        <Select
                            value={statusFilter}
                            onValueChange={(value) => setStatusFilter(value as ExamStatus | 'ALL')}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Status</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Loading exam sessions...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <Card className="border-destructive">
                        <CardContent className="py-12 text-center">
                            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                Failed to Load Sessions
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                There was an error loading your exam sessions. Please try again.
                            </p>
                            <Button onClick={() => window.location.reload()}>Retry</Button>
                        </CardContent>
                    </Card>
                )}

                {/* Empty State */}
                {!isLoading && !error && filteredExams.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                No Exam Sessions Found
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                {statusFilter !== 'ALL'
                                    ? `You don't have any ${statusFilter.toLowerCase().replace('_', ' ')} exam sessions`
                                    : "You haven't started any exams yet"}
                            </p>
                            {statusFilter !== 'ALL' ? (
                                <Button variant="outline" onClick={() => setStatusFilter('ALL')}>
                                    Show All Sessions
                                </Button>
                            ) : (
                                <Button onClick={() => (window.location.href = '/exams')}>
                                    Browse Exams
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Exam Sessions Grid */}
                {!isLoading && !error && filteredExams.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredExams.map((userExam) => (
                            <UserExamCard key={userExam.id} userExam={userExam} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}