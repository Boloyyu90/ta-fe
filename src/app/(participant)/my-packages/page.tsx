'use client';

/**
 * My Packages Page (Paket Saya)
 *
 * Menampilkan paket ujian yang sudah dibeli (status PAID).
 * User bisa langsung ke halaman detail untuk mulai ujian.
 */

import { useState } from 'react';
import Link from 'next/link';
import {
    Play,
    Clock,
    FileText,
    Search,
    PackageX,
    Calendar,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Badge } from '@/shared/components/ui/badge';
import { PageHeaderTitle } from '@/shared/components/PageHeaderTitle';
import { useMyPaidPackages } from '@/features/transactions';

export default function MyPackagesPage() {
    const [search, setSearch] = useState('');

    // Fetch ONLY PAID transactions using the hook
    const { transactions: packages, isLoading } = useMyPaidPackages();

    // Filter packages by search query
    const filteredPackages = packages.filter((pkg) =>
        pkg.exam.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container mx-auto py-8 space-y-6">
            <PageHeaderTitle title="Paket Saya" />

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari paket..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* ========== Loading State ========== */}
            {isLoading && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2 mt-2" />
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-4 mb-4">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                                <Skeleton className="h-10 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* ========== Empty State ========== */}
            {!isLoading && filteredPackages.length === 0 && (
                <Card className="text-center py-16">
                    <CardContent>
                        <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6">
                            <PackageX className="h-12 w-12 text-primary" />
                        </div>
                        <h3 className="font-semibold text-xl mb-2">
                            {search ? 'Tidak Ditemukan' : 'Belum Ada Paket'}
                        </h3>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                            {search
                                ? `Tidak ada paket yang cocok dengan "${search}"`
                                : 'Anda belum membeli paket ujian. Jelajahi pilihan paket yang tersedia untuk memulai persiapan CPNS Anda.'
                            }
                        </p>
                        {!search && (
                            <Button asChild size="lg">
                                <Link href="/exams">
                                    Lihat Pilihan Paket
                                </Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* ========== Packages Grid ========== */}
            {!isLoading && filteredPackages.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPackages.map((pkg) => (
                        <Card key={pkg.id} className="flex flex-col hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-2">
                                    <CardTitle className="text-lg line-clamp-2">
                                        {pkg.exam.title}
                                    </CardTitle>
                                    <Badge variant="secondary" className="shrink-0">
                                        Aktif
                                    </Badge>
                                </div>
                                <CardDescription className="flex items-center gap-1 mt-1">
                                    <Calendar className="h-3 w-3" />
                                    Dibeli {pkg.paidAt ? new Date(pkg.paidAt).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    }) : '-'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col pt-0">
                                {/* Action Button - Links to /exams/[id] */}
                                <div className="mt-auto">
                                    <Button asChild className="w-full">
                                        <Link href={`/exams/${pkg.examId}`}>
                                            <Play className="mr-2 h-4 w-4" />
                                            Mulai Ujian
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* ========== Stats Footer ========== */}
            {!isLoading && filteredPackages.length > 0 && (
                <div className="mt-8 text-center text-sm text-muted-foreground">
                    Menampilkan {filteredPackages.length} dari {packages.length} paket
                </div>
            )}
        </div>
    );
}
