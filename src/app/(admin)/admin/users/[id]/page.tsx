'use client';

/**
 * USER DETAIL PAGE (Admin View)
 *
 * Full implementation using existing hooks/APIs.
 * Backend: GET /api/v1/admin/users/:id
 */

import { use } from 'react';
import Link from 'next/link';
import { useUser } from '@/features/users/hooks';
import type { UserRole } from '@/features/users/types/users.types';

// UI Components
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Separator } from '@/shared/components/ui/separator';
import {
    ArrowLeft,
    Edit,
    Mail,
    User as UserIcon,
    Shield,
    Calendar,
    CheckCircle,
    XCircle,
    BookOpen,
    FileText,
} from 'lucide-react';

interface PageProps {
    params: Promise<{ id: string }>;
}

// Role badge configuration
const roleConfig: Record<UserRole, { label: string; variant: 'default' | 'secondary' }> = {
    ADMIN: { label: 'Administrator', variant: 'default' },
    PARTICIPANT: { label: 'Peserta', variant: 'secondary' },
};

export default function UserDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const userId = parseInt(id, 10);

    const { data, isLoading, isError, error } = useUser(userId);
    const user = data?.user;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-muted/30">
                <div className="bg-background border-b border-border">
                    <div className="container mx-auto px-4 py-4">
                        <Skeleton className="h-8 w-48" />
                    </div>
                </div>
                <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        );
    }

    // Error state
    if (isError || !user) {
        return (
            <div className="min-h-screen bg-muted/30">
                <div className="bg-background border-b border-border">
                    <div className="container mx-auto px-4 py-4">
                        <Link href="/admin/users">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Kembali ke Daftar User
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="container mx-auto px-4 py-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-center py-8">
                                <XCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
                                <p className="text-destructive mb-4">
                                    {error?.message || 'User tidak ditemukan'}
                                </p>
                                <Link href="/admin/users">
                                    <Button variant="outline">
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Kembali ke Daftar
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/admin/users">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Kembali ke Daftar User
                            </Button>
                        </Link>
                        <Link href={`/admin/users/${userId}/edit`}>
                            <Button>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
                {/* User Profile Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                {user.role === 'ADMIN' ? (
                                    <Shield className="h-8 w-8 text-primary" />
                                ) : (
                                    <UserIcon className="h-8 w-8 text-muted-foreground" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <CardTitle className="text-2xl">{user.name}</CardTitle>
                                    <Badge variant={roleConfig[user.role].variant}>
                                        {roleConfig[user.role].label}
                                    </Badge>
                                </div>
                                <CardDescription className="flex items-center gap-1 mt-1">
                                    <Mail className="h-4 w-4" />
                                    {user.email}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Email Verification Status */}
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Status Verifikasi</p>
                                {user.isEmailVerified ? (
                                    <div className="flex items-center gap-2 text-green-600">
                                        <CheckCircle className="h-5 w-5" />
                                        <span className="font-medium">Email Terverifikasi</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-yellow-600">
                                        <XCircle className="h-5 w-5" />
                                        <span className="font-medium">Belum Diverifikasi</span>
                                    </div>
                                )}
                            </div>

                            {/* User ID */}
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">ID User</p>
                                <p className="font-medium">#{user.id}</p>
                            </div>

                            {/* Created At */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span className="text-sm">Terdaftar</span>
                                </div>
                                <p className="font-medium">{formatDate(user.createdAt)}</p>
                            </div>

                            {/* Updated At */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span className="text-sm">Terakhir Diupdate</span>
                                </div>
                                <p className="font-medium">{formatDate(user.updatedAt)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Statistik</CardTitle>
                        <CardDescription>
                            Aktivitas user dalam sistem
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Created Exams (for Admin) */}
                            <div className="p-4 rounded-lg bg-muted text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <BookOpen className="h-5 w-5 text-primary" />
                                </div>
                                <div className="text-2xl font-bold">
                                    {user._count?.createdExams ?? 0}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Ujian Dibuat
                                </div>
                            </div>

                            {/* Exam Attempts */}
                            <div className="p-4 rounded-lg bg-muted text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <div className="text-2xl font-bold">
                                    {user._count?.userExams ?? 0}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Percobaan Ujian
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Kelola informasi user ini
                            </p>
                            <Link href={`/admin/users/${userId}/edit`}>
                                <Button variant="outline">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit User
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
