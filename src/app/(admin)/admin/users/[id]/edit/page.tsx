'use client';

/**
 * EDIT USER PAGE (Admin)
 *
 * Full implementation using existing hooks/APIs.
 * Backend: PATCH /api/v1/admin/users/:id
 */

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useUser, useUpdateUser } from '@/features/users/hooks';
import type { UserRole, UpdateUserRequest } from '@/features/users/types/users.types';

// UI Components
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import { ArrowLeft, Loader2, Save, User as UserIcon, XCircle } from 'lucide-react';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditUserPage({ params }: PageProps) {
    const { id } = use(params);
    const userId = parseInt(id, 10);
    const router = useRouter();

    const { data, isLoading, isError, error } = useUser(userId);
    const updateMutation = useUpdateUser();

    const [formData, setFormData] = useState<UpdateUserRequest>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [hasChanges, setHasChanges] = useState(false);

    const user = data?.user;

    // Initialize form when user data loads
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
            });
        }
    }, [user]);

    // Track changes
    useEffect(() => {
        if (user) {
            const changed =
                formData.name !== user.name ||
                formData.email !== user.email ||
                formData.role !== user.role ||
                formData.isEmailVerified !== user.isEmailVerified ||
                !!(formData.password && formData.password.length > 0);
            setHasChanges(changed);
        }
    }, [formData, user]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (formData.name && formData.name.length < 2) {
            newErrors.name = 'Nama minimal 2 karakter';
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Format email tidak valid';
        }

        if (formData.password && formData.password.length > 0 && formData.password.length < 8) {
            newErrors.password = 'Password minimal 8 karakter';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Only send changed fields
        const updateData: UpdateUserRequest = {};
        if (formData.name !== user?.name) updateData.name = formData.name;
        if (formData.email !== user?.email) updateData.email = formData.email;
        if (formData.role !== user?.role) updateData.role = formData.role;
        if (formData.isEmailVerified !== user?.isEmailVerified) {
            updateData.isEmailVerified = formData.isEmailVerified;
        }
        if (formData.password && formData.password.length > 0) {
            updateData.password = formData.password;
        }

        // Skip if nothing changed
        if (Object.keys(updateData).length === 0) {
            toast.info('Tidak ada perubahan');
            return;
        }

        try {
            await updateMutation.mutateAsync({ userId, data: updateData });
            toast.success('User berhasil diupdate');
            router.push(`/admin/users/${userId}`);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string; errorCode?: string } } };
            const message = err?.response?.data?.message || 'Gagal update user';
            const errorCode = err?.response?.data?.errorCode;

            if (errorCode === 'EMAIL_ALREADY_EXISTS') {
                setErrors({ email: 'Email sudah digunakan' });
            } else {
                toast.error(message);
            }
        }
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
                <div className="container mx-auto px-4 py-8 max-w-2xl">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-8 w-64 mb-2" />
                            <Skeleton className="h-4 w-48" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </CardContent>
                    </Card>
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
                    <Link href={`/admin/users/${userId}`}>
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali ke Detail User
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <UserIcon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Edit User</CardTitle>
                                <CardDescription>
                                    Ubah data untuk {user.name}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    value={formData.name || ''}
                                    onChange={(e) => {
                                        setFormData({ ...formData, name: e.target.value });
                                        if (errors.name) setErrors({ ...errors, name: '' });
                                    }}
                                    placeholder="Masukkan nama lengkap"
                                    className={errors.name ? 'border-destructive' : ''}
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={(e) => {
                                        setFormData({ ...formData, email: e.target.value });
                                        if (errors.email) setErrors({ ...errors, email: '' });
                                    }}
                                    placeholder="email@example.com"
                                    className={errors.email ? 'border-destructive' : ''}
                                />
                                {errors.email && (
                                    <p className="text-sm text-destructive">{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Password Baru (opsional)</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password || ''}
                                    onChange={(e) => {
                                        setFormData({ ...formData, password: e.target.value || undefined });
                                        if (errors.password) setErrors({ ...errors, password: '' });
                                    }}
                                    placeholder="Kosongkan jika tidak ingin mengubah"
                                    className={errors.password ? 'border-destructive' : ''}
                                />
                                {errors.password && (
                                    <p className="text-sm text-destructive">{errors.password}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Kosongkan jika tidak ingin mengubah password
                                </p>
                            </div>

                            {/* Role */}
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value: UserRole) =>
                                        setFormData({ ...formData, role: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PARTICIPANT">Peserta</SelectItem>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Email Verified */}
                            <div className="flex items-center gap-3 p-4 rounded-lg border">
                                <Checkbox
                                    id="isEmailVerified"
                                    checked={formData.isEmailVerified || false}
                                    onCheckedChange={(checked: boolean | 'indeterminate') =>
                                        setFormData({ ...formData, isEmailVerified: checked === true })
                                    }
                                />
                                <div className="space-y-0.5">
                                    <Label htmlFor="isEmailVerified" className="cursor-pointer">
                                        Email Terverifikasi
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Tandai email sebagai terverifikasi
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push(`/admin/users/${userId}`)}
                                    className="flex-1"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={updateMutation.isPending || !hasChanges}
                                    className="flex-1"
                                >
                                    {updateMutation.isPending ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Simpan Perubahan
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
