/**
 * Admin Users Management Page
 *
 * Features:
 * - List all users with pagination
 * - Search by name/email
 * - Filter by role
 * - Create new user
 * - Edit user (role, email, password)
 * - Delete user (with conflict handling)
 *
 * Backend endpoints:
 * - GET /api/v1/admin/users
 * - POST /api/v1/admin/users
 * - PATCH /api/v1/admin/users/:id
 * - DELETE /api/v1/admin/users/:id
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
    useUsers,
    useCreateUser,
    useUpdateUser,
    useDeleteUser,
} from '@/features/users/hooks';
import type { User, UserRole, CreateUserRequest, UpdateUserRequest } from '@/features/users/types/users.types';

// UI Components
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/shared/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import {
    Plus,
    Search,
    MoreHorizontal,
    Edit,
    Trash2,
    Users,
    Shield,
    User as UserIcon,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Mail,
    CheckCircle,
    XCircle,
    ArrowLeft,
} from 'lucide-react';

// Role badge configuration
const roleConfig: Record<UserRole, { label: string; variant: 'default' | 'secondary' }> = {
    ADMIN: { label: 'Admin', variant: 'default' },
    PARTICIPANT: { label: 'Peserta', variant: 'secondary' },
};

// ============================================================================
// CREATE USER DIALOG
// ============================================================================

interface CreateUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CreateUserRequest) => Promise<void>;
    isLoading: boolean;
}

function CreateUserDialog({ open, onOpenChange, onSubmit, isLoading }: CreateUserDialogProps) {
    const [formData, setFormData] = useState<CreateUserRequest>({
        name: '',
        email: '',
        password: '',
        role: 'PARTICIPANT',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
        setFormData({ name: '', email: '', password: '', role: 'PARTICIPANT' });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Buat User Baru</DialogTitle>
                    <DialogDescription>
                        Isi data untuk membuat akun pengguna baru.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Nama lengkap"
                                required
                                minLength={2}
                                maxLength={100}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="email@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Min. 8 karakter"
                                required
                                minLength={8}
                            />
                            <p className="text-xs text-muted-foreground">
                                Minimal 8 karakter, 1 huruf besar, 1 huruf kecil, 1 angka
                            </p>
                        </div>
                        <div className="grid gap-2">
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
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Buat User
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// ============================================================================
// EDIT USER DIALOG
// ============================================================================

interface EditUserDialogProps {
    user: User | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (userId: number, data: UpdateUserRequest) => Promise<void>;
    isLoading: boolean;
}

function EditUserDialog({ user, open, onOpenChange, onSubmit, isLoading }: EditUserDialogProps) {
    const [formData, setFormData] = useState<UpdateUserRequest>({});

    // Reset form when user changes
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role,
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        await onSubmit(user.id, formData);
    };

    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Ubah data pengguna. Kosongkan password jika tidak ingin mengubah.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Nama</Label>
                            <Input
                                id="edit-name"
                                value={formData.name || user.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Nama lengkap"
                                minLength={2}
                                maxLength={100}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={formData.email || user.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="email@example.com"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-password">Password Baru (opsional)</Label>
                            <Input
                                id="edit-password"
                                type="password"
                                value={formData.password || ''}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value || undefined })}
                                placeholder="Kosongkan jika tidak diubah"
                                minLength={8}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-role">Role</Label>
                            <Select
                                value={formData.role || user.role}
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
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
// MAIN PAGE COMPONENT
// ============================================================================

export default function AdminUsersPage() {
    // State
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

    // Debounced search
    const [debouncedSearch, setDebouncedSearch] = useState('');
    useState(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(timer);
    });

    // Queries & Mutations
    const { data, isLoading, isError } = useUsers({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        role: roleFilter === 'ALL' ? undefined : roleFilter,
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });

    const createMutation = useCreateUser();
    const updateMutation = useUpdateUser();
    const deleteMutation = useDeleteUser();

    // Handlers
    const handleCreateUser = useCallback(async (formData: CreateUserRequest) => {
        try {
            await createMutation.mutateAsync(formData);
            toast.success('User berhasil dibuat');
            setCreateDialogOpen(false);
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Gagal membuat user';
            toast.error(message);
        }
    }, [createMutation]);

    const handleUpdateUser = useCallback(async (userId: number, formData: UpdateUserRequest) => {
        try {
            await updateMutation.mutateAsync({ userId, data: formData });
            toast.success('User berhasil diupdate');
            setEditingUser(null);
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Gagal update user';
            toast.error(message);
        }
    }, [updateMutation]);

    const handleDeleteUser = useCallback(async () => {
        if (!deletingUserId) return;
        try {
            await deleteMutation.mutateAsync(deletingUserId);
            toast.success('User berhasil dihapus');
            setDeletingUserId(null);
        } catch (error: any) {
            // Handle specific error codes
            const errorCode = error?.response?.data?.errorCode;
            let message = 'Gagal menghapus user';

            if (errorCode === 'USER_HAS_EXAM_ATTEMPTS') {
                message = 'User tidak dapat dihapus karena memiliki riwayat ujian';
            } else if (errorCode === 'USER_HAS_CREATED_EXAMS') {
                message = 'User tidak dapat dihapus karena memiliki ujian yang dibuat';
            }

            toast.error(message);
        }
    }, [deletingUserId, deleteMutation]);

    // Extract data
    const users = data?.data || [];
    const pagination = data?.pagination;

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Back Navigation */}
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/admin/dashboard">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="container mx-auto py-8 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Manajemen User</h1>
                    <p className="text-muted-foreground">
                        Kelola akun pengguna sistem
                    </p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Buat User
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama atau email..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="pl-10"
                            />
                        </div>
                        <Select
                            value={roleFilter}
                            onValueChange={(value: UserRole | 'ALL') => {
                                setRoleFilter(value);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Semua Role</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                                <SelectItem value="PARTICIPANT">Peserta</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Daftar User
                    </CardTitle>
                    <CardDescription>
                        {pagination ? `Total ${pagination.total} user` : 'Memuat...'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Gagal memuat data. Silakan coba lagi.
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Tidak ada user ditemukan
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>User</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Terdaftar</TableHead>
                                            <TableHead className="w-[80px]">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                                            {user.role === 'ADMIN' ? (
                                                                <Shield className="h-5 w-5 text-primary" />
                                                            ) : (
                                                                <UserIcon className="h-5 w-5 text-muted-foreground" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{user.name}</p>
                                                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                                <Mail className="h-3 w-3" />
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={roleConfig[user.role].variant}>
                                                        {roleConfig[user.role].label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {user.isEmailVerified ? (
                                                        <div className="flex items-center gap-1 text-green-600">
                                                            <CheckCircle className="h-4 w-4" />
                                                            <span className="text-sm">Terverifikasi</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1 text-yellow-600">
                                                            <XCircle className="h-4 w-4" />
                                                            <span className="text-sm">Belum verifikasi</span>
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {formatDate(user.createdAt)}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={() => setEditingUser(user)}
                                                            >
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => setDeletingUserId(user.id)}
                                                                className="text-destructive"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {pagination && pagination.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4">
                                    <p className="text-sm text-muted-foreground">
                                        Halaman {pagination.page} dari {pagination.totalPages}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(page - 1)}
                                            disabled={!pagination.hasPrev}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(page + 1)}
                                            disabled={!pagination.hasNext}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Create User Dialog */}
            <CreateUserDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSubmit={handleCreateUser}
                isLoading={createMutation.isPending}
            />

            {/* Edit User Dialog */}
            <EditUserDialog
                user={editingUser}
                open={!!editingUser}
                onOpenChange={(open) => !open && setEditingUser(null)}
                onSubmit={handleUpdateUser}
                isLoading={updateMutation.isPending}
            />

            {/* Delete Confirmation */}
            <AlertDialog open={!!deletingUserId} onOpenChange={(open) => !open && setDeletingUserId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus User?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. User akan dihapus secara permanen
                            dari sistem.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteUser}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteMutation.isPending && (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            )}
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            </div>
        </div>
    );
}