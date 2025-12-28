import { Button } from '@/shared/components/ui/button';
import { FileQuestion, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function AdminNotFound() {
    return (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center">
            <div className="text-center space-y-4 px-4">
                <FileQuestion className="h-16 w-16 text-muted-foreground mx-auto" />
                <h2 className="text-2xl font-semibold">Halaman Tidak Ditemukan</h2>
                <p className="text-muted-foreground max-w-md">
                    Halaman admin yang Anda cari tidak ada atau telah dipindahkan.
                </p>
                <Button asChild>
                    <Link href="/admin/dashboard">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Kembali ke Dashboard Admin
                    </Link>
                </Button>
            </div>
        </div>
    );
}
