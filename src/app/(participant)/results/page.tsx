// src/app/(participant)/results/page.tsx
'use client';

import { useMyResults } from '@/features/exam-sessions/hooks/useMyResults';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';

export default function ResultsPage() {
    const { data, isLoading } = useMyResults({ status: 'COMPLETED' });

    if (isLoading) {
        return <Skeleton className="h-96" />;
    }

    const results = data?.data || [];
    const pagination = data?.pagination;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">My Results</h1>
            {results.length === 0 ? (
                <Alert>
                    <AlertDescription>No completed exams found</AlertDescription>
                </Alert>
            ) : (
                <div className="grid gap-4">
                    {results.map((result) => (
                        <div key={result.id} className="border p-4 rounded">
                            <p className="font-medium">{result.exam?.title}</p>
                            <p>Score: {result.totalScore}</p>
                            <p>Completed: {new Date(result.completedAt || '').toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            )}
            {pagination && (
                <div className="text-sm text-muted-foreground">
                    Page {pagination.page} of {pagination.totalPages}
                </div>
            )}
        </div>
    );
}