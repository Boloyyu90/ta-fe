/**
 * Participant Profile Page
 *
 * ✅ FIXED:
 * - Uses useProfile hook instead of useAuth
 * - Implements loading/error states
 * - Add "Update Name" functionality using PATCH /me
 * - Add "Change Password" functionality using PATCH /me
 * - Follows same patterns as admin pages
 *
 * Features:
 * - View profile information
 * - Update name
 * - Change password
 *
 * Backend endpoints:
 * - GET /api/v1/me
 * - PATCH /api/v1/me
 */

'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useProfile } from '@/features/users/hooks';
import { usersApi } from '@/features/users/api/users.api';
import type { User } from '@/features/users/types/users.types';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Badge } from '@/shared/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import {
    User as UserIcon,
    Mail,
    Shield,
    Edit,
    Lock,
    Loader2,
    CheckCircle,
    XCircle,
    Calendar,
    ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

// ============================================================================
// EDIT NAME DIALOG
// ============================================================================

interface EditNameDialogProps {
    user: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function EditNameDialog({ user, open, onOpenChange }: EditNameDialogProps) {
    const [name, setName] = useState(user.name);
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (name.trim() === user.name) {
            toast.info('Tidak ada perubahan');
            onOpenChange(false);
            return;
        }

        if (name.trim().length < 2) {
            toast.error('Nama minimal 2 karakter');
            return;
        }

        if (name.trim().length > 100) {
            toast.error('Nama maksimal 100 karakter');
            return;
        }

        setIsLoading(true);

        try {
            await usersApi.updateProfile({ name: name.trim() });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            toast.success('Nama berhasil diubah');
            onOpenChange(false);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            const message = err?.response?.data?.message || 'Gagal mengubah nama';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ubah Nama</DialogTitle>
                    <DialogDescription>
                        Masukkan nama baru Anda (2-100 karakter)
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nama lengkap"
                                required
                                minLength={2}
                                maxLength={100}
                            />
                            <p className="text-xs text-muted-foreground">
                                Nama Anda akan ditampilkan di seluruh sistem
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Simpan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// ============================================================================
// CHANGE PASSWORD DIALOG
// ============================================================================

interface ChangePasswordDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (password.length < 8) {
            toast.error('Password minimal 8 karakter');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Password tidak cocok');
            return;
        }

        // Password strength check (basic)
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);

        if (!hasUpperCase || !hasLowerCase || !hasNumber) {
            toast.error('Password harus mengandung huruf besar, huruf kecil, dan angka');
            return;
        }

        setIsLoading(true);

        try {
            await usersApi.updateProfile({ password });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            toast.success('Password berhasil diubah');
            onOpenChange(false);
            setPassword('');
            setConfirmPassword('');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            const message = err?.response?.data?.message || 'Gagal mengubah password';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ubah Password</DialogTitle>
                    <DialogDescription>
                        Masukkan password baru Anda. Password harus memenuhi kriteria keamanan.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Password Baru</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Minimal 8 karakter"
                                required
                                minLength={8}
                            />
                            <p className="text-xs text-muted-foreground">
                                Minimal 8 karakter, 1 huruf besar, 1 huruf kecil, 1 angka
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Ketik ulang password"
                                required
                                minLength={8}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                onOpenChange(false);
                                setPassword('');
                                setConfirmPassword('');
                            }}
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Ubah Password
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// ============================================================================
// MAIN PROFILE PAGE
// ============================================================================

export default function ProfilePage() {
    const { data, isLoading, isError, refetch } = useProfile();
    const [isEditNameOpen, setIsEditNameOpen] = useState(false);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);

    // Loading state
    if (isLoading) {
        return (
            <div className="container mx-auto py-8 space-y-6">
                <div>
                    <Skeleton className="h-9 w-32" />
                    <Skeleton className="h-5 w-64 mt-2" />
                </div>
                <Skeleton className="h-64" />
                <Skeleton className="h-32" />
            </div>
        );
    }

    // Error state
    if (isError || !data) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="py-12 text-center">
                        <XCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
                        <p className="text-destructive mb-4">
                            Gagal memuat profil. Silakan coba lagi.
                        </p>
                        <Button onClick={() => refetch()} variant="outline">
                            Coba Lagi
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const user = data.user;

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Back Navigation */}
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali ke Dashboard
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="container mx-auto py-8 space-y-6">
                {/* Header */}
                <div>
                <h1 className="text-3xl font-bold">Profil Saya</h1>
                <p className="text-muted-foreground mt-2">
                    Kelola informasi akun Anda
                </p>
            </div>

            {/* Profile Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Informasi Akun</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Profile Header */}
                    <div className="flex items-center gap-4">
                        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserIcon className="h-10 w-10 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-semibold">{user.name}</h2>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                                    {user.role === 'ADMIN' ? 'Admin' : 'Peserta'}
                                </Badge>
                                {user.isEmailVerified ? (
                                    <Badge variant="outline" className="text-green-600">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Email Terverifikasi
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-amber-600">
                                        <XCircle className="h-3 w-3 mr-1" />
                                        Email Belum Terverifikasi
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditNameOpen(true)}
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Nama
                        </Button>
                    </div>

                    {/* Profile Details */}
                    <div className="space-y-4 pt-6 border-t">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Nama Lengkap</p>
                                    <p className="text-sm text-muted-foreground">{user.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Email</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                    <Shield className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Role</p>
                                    <p className="text-sm text-muted-foreground">
                                        {user.role === 'ADMIN' ? 'Administrator' : 'Peserta'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Bergabung Sejak</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(user.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Security Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Keamanan Akun</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => setIsPasswordOpen(true)}
                    >
                        <Lock className="h-4 w-4 mr-2" />
                        Ubah Password
                    </Button>
                    <p className="text-xs text-muted-foreground px-1">
                        Pastikan password Anda kuat dan unik. Gunakan kombinasi huruf besar, huruf kecil, dan angka.
                    </p>
                </CardContent>
            </Card>

            {/* Additional Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Informasi Tambahan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">User ID:</span>
                            <span className="font-mono">{user.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Akun dibuat:</span>
                            <span>{formatDate(user.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Terakhir diupdate:</span>
                            <span>{formatDate(user.updatedAt)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Dialogs */}
            <EditNameDialog
                user={user}
                open={isEditNameOpen}
                onOpenChange={setIsEditNameOpen}
            />
            <ChangePasswordDialog
                open={isPasswordOpen}
                onOpenChange={setIsPasswordOpen}
            />
            </div>
        </div>
    );
}
