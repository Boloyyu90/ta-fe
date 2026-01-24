'use client';

import { Card, CardContent } from '@/shared/components/ui/card';
import { MonitorX } from 'lucide-react';

export function EmptyAttemptsPlaceholder() {
    return (
        <Card className="border-dashed border-2">
            <CardContent className="py-16">
                <div className="flex flex-col md:flex-row items-center justify-center gap-16">
                    <p className="text-2xl text-muted-foreground/60 font-medium">
                        Belum ada yang dikerjakan!
                    </p>

                    {/* Icon placeholder */}
                    <div className="w-48 h-32 flex items-center justify-center">
                        <div
                            className="flex items-center justify-center w-48 h-48 rounded-2xl border"
                            style={{
                                // 1) warna icon (solid, no opacity) → nggak ada “shade tebal-tipis”
                                color:
                                    'color-mix(in oklab, hsl(var(--muted-foreground)) 35%, hsl(var(--background)))',

                                // 2) border selaras (lebih tipis/pucat dari icon)
                                borderColor:
                                    'color-mix(in oklab, hsl(var(--muted-foreground)) 12%, hsl(var(--background)))',

                                // 3) bg selaras (sangat halus)
                                backgroundColor:
                                    'color-mix(in oklab, hsl(var(--muted)) 25%, hsl(var(--background)))',
                            }}
                        >
                            <MonitorX className="h-20 w-20" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default EmptyAttemptsPlaceholder;
