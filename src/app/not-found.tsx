import { Button } from '@/shared/components/ui/button';
import { FileQuestion } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background">
            <div className="text-center space-y-4 px-4">
                <FileQuestion className="h-16 w-16 text-muted-foreground mx-auto" />
                <h2 className="text-2xl font-semibold">Halaman Tidak Ditemukan</h2>
                <p className="text-muted-foreground max-w-md">
                    Halaman yang Anda cari tidak ada atau telah dipindahkan.
                </p>
                <Button asChild>
                    <Link href="/">Kembali ke Beranda</Link>
                </Button>
            </div>
        </div>
    );
}
