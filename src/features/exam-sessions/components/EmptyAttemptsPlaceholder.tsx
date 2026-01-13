'use client';

import { Card, CardContent } from '@/shared/components/ui/card';

export function EmptyAttemptsPlaceholder() {
    return (
        <Card className="border-dashed border-2">
            <CardContent className="py-16">
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                    <p className="text-2xl text-muted-foreground/60 font-medium">
                        Belum ada yang dikerjakan!
                    </p>
                    <div className="relative w-48 h-32 flex items-center justify-center">
                        {/* Laptop illustration */}
                        <div className="relative">
                            <div className="w-32 h-20 bg-muted rounded-t-lg border-4 border-muted-foreground/20 flex items-center justify-center">
                                <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                                    <div className="w-1 h-3 bg-muted-foreground/30 rounded-full" />
                                </div>
                            </div>
                            <div className="w-40 h-2 bg-muted-foreground/20 rounded-b-lg -mt-0.5" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default EmptyAttemptsPlaceholder;
