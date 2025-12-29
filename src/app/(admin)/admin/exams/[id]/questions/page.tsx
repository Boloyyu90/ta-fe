'use client';

/**
 * MANAGE EXAM QUESTIONS PAGE
 *
 * This page redirects to the main exam detail page which already has
 * full question management functionality (attach/detach questions).
 *
 * The question management UI is integrated into /admin/exams/[id] to provide
 * a unified experience for exam administration.
 */

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ManageExamQuestionsPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();

    // Auto-redirect to main exam detail page
    useEffect(() => {
        router.replace(`/admin/exams/${id}`);
    }, [id, router]);

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-4">
                    <Link href={`/admin/exams/${id}`}>
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali ke Detail Ujian
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Content - Redirect notice */}
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle>Manajemen Soal</CardTitle>
                                <CardDescription>
                                    Mengalihkan ke halaman detail ujian...
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                        <p className="text-muted-foreground mb-4">
                            Fitur manajemen soal tersedia di halaman detail ujian.
                        </p>
                        <Link href={`/admin/exams/${id}`}>
                            <Button>
                                <FileText className="h-4 w-4 mr-2" />
                                Buka Halaman Detail Ujian
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
