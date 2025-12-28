'use client';

import { useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function AuthError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Auth error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background">
            <div className="text-center space-y-4 max-w-md mx-auto px-4">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                <h2 className="text-xl font-semibold">Terjadi Kesalahan</h2>
                <p className="text-muted-foreground">
                    {error.message || 'Gagal memuat halaman. Silakan coba lagi.'}
                </p>
                <Button onClick={reset}>Coba Lagi</Button>
            </div>
        </div>
    );
}
