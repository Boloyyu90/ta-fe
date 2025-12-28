'use client';

import { useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { AlertCircle, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Admin page error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center">
            <div className="max-w-md mx-auto text-center space-y-4 px-4">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                <h2 className="text-xl font-semibold">Terjadi Kesalahan</h2>
                <p className="text-muted-foreground">
                    {error.message || 'Gagal memuat halaman admin. Silakan coba lagi.'}
                </p>
                <div className="flex gap-2 justify-center">
                    <Button onClick={reset}>Coba Lagi</Button>
                    <Button variant="outline" asChild>
                        <Link href="/admin/dashboard">
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            Dashboard Admin
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
