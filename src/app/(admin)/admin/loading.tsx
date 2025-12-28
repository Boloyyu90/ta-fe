import { Skeleton } from '@/shared/components/ui/skeleton';

export default function AdminLoading() {
    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header skeleton */}
            <header className="bg-background border-b border-border sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <div>
                                <Skeleton className="h-6 w-40 mb-1" />
                                <Skeleton className="h-4 w-56" />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-9 w-24" />
                            <Skeleton className="h-9 w-20" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Content skeleton */}
            <div className="container mx-auto px-4 py-8 space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-lg" />
                    ))}
                </div>
                <Skeleton className="h-64 rounded-lg" />
            </div>
        </div>
    );
}
