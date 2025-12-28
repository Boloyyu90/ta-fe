/**
 * ExamTakingSkeleton - Loading skeleton for the exam taking page
 *
 * Matches the layout of TakeExamPage to prevent layout shift
 */

import { Skeleton } from '@/shared/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';

export function ExamTakingSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            {/* Sticky Header with Timer skeleton */}
            <div className="sticky top-0 z-50 bg-background border-b">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Skeleton className="h-7 w-48 mb-2" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-10 w-28" /> {/* Timer */}
                    </div>
                    {/* Progress Bar skeleton */}
                    <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-12" />
                        </div>
                        <Skeleton className="h-2 w-full" />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sidebar skeleton */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Proctoring Monitor skeleton */}
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-5 w-32" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-48 w-full rounded-lg" />
                            </CardContent>
                        </Card>

                        {/* Question Navigation skeleton */}
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-5 w-24" />
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-5 gap-2">
                                    {Array.from({ length: 25 }).map((_, i) => (
                                        <Skeleton key={i} className="aspect-square rounded-lg" />
                                    ))}
                                </div>
                                <div className="mt-4 space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content - Question skeleton */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-40" />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question text */}
                                <Skeleton className="h-24 w-full" />

                                {/* Answer Options */}
                                <div className="space-y-3">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Skeleton key={i} className="h-14 w-full rounded-lg" />
                                    ))}
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex justify-between items-center pt-4">
                                    <Skeleton className="h-10 w-28" />
                                    <Skeleton className="h-10 w-28" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
