/**
 * ExamTakingSkeleton - Loading skeleton for the exam taking page
 *
 * Matches the new layout of TakeExamPage to prevent layout shift
 */

import { Skeleton } from '@/shared/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';

export function ExamTakingSkeleton() {
    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header skeleton with timer boxes */}
            <div className="sticky top-0 z-40 bg-primary">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between gap-4">
                        {/* Title skeleton */}
                        <div className="flex-1">
                            <Skeleton className="h-6 w-48 bg-primary-foreground/20" />
                            <Skeleton className="h-4 w-64 mt-2 bg-primary-foreground/20" />
                        </div>

                        {/* Timer boxes skeleton */}
                        <div className="flex items-center gap-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <Skeleton className="h-12 w-14 rounded-md bg-background" />
                                    <Skeleton className="h-3 w-8 mt-1 bg-primary-foreground/20" />
                                </div>
                            ))}
                        </div>

                        {/* Webcam skeleton */}
                        <Skeleton className="h-16 w-24 rounded-md bg-primary-foreground/20 hidden md:block" />
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-7xl mx-auto p-4 lg:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
                    {/* Left: Question Card skeleton */}
                    <div className="order-2 lg:order-1">
                        <Card>
                            <CardHeader className="pb-4">
                                <Skeleton className="h-6 w-40" />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question text skeleton */}
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>

                                {/* Answer options skeleton */}
                                <div className="space-y-3">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Skeleton key={i} className="h-14 w-full rounded-lg" />
                                    ))}
                                </div>

                                {/* Navigation buttons skeleton */}
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <Skeleton className="h-9 w-28" />
                                    <Skeleton className="h-9 w-28" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Sidebar skeleton */}
                    <div className="order-1 lg:order-2 space-y-4">
                        {/* Question navigation skeleton */}
                        <Card>
                            <CardHeader className="pb-3">
                                <Skeleton className="h-5 w-24" />
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-5 gap-2">
                                    {Array.from({ length: 25 }).map((_, i) => (
                                        <Skeleton key={i} className="aspect-square rounded-lg" />
                                    ))}
                                </div>
                                <Skeleton className="h-4 w-32 mt-4 mx-auto" />
                            </CardContent>
                        </Card>

                        {/* Submit button skeleton */}
                        <Skeleton className="h-11 w-full rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
}
