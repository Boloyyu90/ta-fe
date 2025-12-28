import { Skeleton } from '@/shared/components/ui/skeleton';

export default function ParticipantLoading() {
    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header skeleton */}
            <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-9 w-20" />
                    </div>
                </div>
            </div>

            {/* Content skeleton */}
            <div className="container py-8 space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-48 rounded-lg" />
                    ))}
                </div>
            </div>
        </div>
    );
}
