/**
 * Admin Edit Exam Page
 *
 * ✅ FIXED:
 * - Use `undefined` instead of `null` for optional fields
 * - Use `id` instead of `examId` for UpdateExamVariables
 */

'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAdminExam, useUpdateExam } from '@/features/exams/hooks';
import type { UpdateExamRequest } from '@/features/exams/types/exams.types';

// UI Components
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
    ArrowLeft,
    Save,
    Loader2,
    Clock,
    Target,
    Calendar,
    FileText,
    AlertTriangle,
} from 'lucide-react';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditExamPage({ params }: PageProps) {
    const router = useRouter();
    const resolvedParams = use(params);
    const examId = parseInt(resolvedParams.id, 10);

    // Fetch exam data
    const { data: examData, isLoading, isError } = useAdminExam(examId);
    const updateMutation = useUpdateExam();

    // Form state
    const [formData, setFormData] = useState<UpdateExamRequest>({
        title: '',
        description: '',
        durationMinutes: 90,
        passingScore: 70,
        startTime: '',
        endTime: '',
    });

    // Initialize form with exam data
    useEffect(() => {
        if (examData?.exam) {
            const exam = examData.exam;
            setFormData({
                title: exam.title,
                description: exam.description || '',
                durationMinutes: exam.durationMinutes,
                passingScore: exam.passingScore,
                startTime: exam.startTime ? formatDateForInput(exam.startTime) : '',
                endTime: exam.endTime ? formatDateForInput(exam.endTime) : '',
            });
        }
    }, [examData]);

    // Format date for datetime-local input
    const formatDateForInput = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    };

    // Form validation
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (formData.title !== undefined) {
            if (!formData.title.trim()) {
                newErrors.title = 'Judul ujian wajib diisi';
            } else if (formData.title.length < 3) {
                newErrors.title = 'Judul minimal 3 karakter';
            } else if (formData.title.length > 200) {
                newErrors.title = 'Judul maksimal 200 karakter';
            }
        }

        if (formData.durationMinutes !== undefined) {
            if (formData.durationMinutes < 1) {
                newErrors.durationMinutes = 'Durasi minimal 1 menit';
            } else if (formData.durationMinutes > 480) {
                newErrors.durationMinutes = 'Durasi maksimal 480 menit (8 jam)';
            }
        }

        if (formData.passingScore !== undefined) {
            if (formData.passingScore < 0) {
                newErrors.passingScore = 'Passing score minimal 0';
            } else if (formData.passingScore > 100) {
                newErrors.passingScore = 'Passing score maksimal 100';
            }
        }

        // Validate time range
        if (formData.startTime && formData.endTime) {
            const start = new Date(formData.startTime);
            const end = new Date(formData.endTime);
            if (end <= start) {
                newErrors.endTime = 'Waktu selesai harus setelah waktu mulai';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle input changes
    const handleChange = (field: keyof UpdateExamRequest, value: string | number | undefined) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user types
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Mohon perbaiki kesalahan pada form');
            return;
        }

        try {
            // ✅ FIX: Use undefined instead of null for optional fields
            const payload: UpdateExamRequest = {};

            if (formData.title?.trim()) {
                payload.title = formData.title.trim();
            }
            if (formData.description !== undefined) {
                payload.description = formData.description?.trim() || undefined;
            }
            if (formData.durationMinutes !== undefined) {
                payload.durationMinutes = formData.durationMinutes;
            }
            if (formData.passingScore !== undefined) {
                payload.passingScore = formData.passingScore;
            }
            if (formData.startTime !== undefined) {
                payload.startTime = formData.startTime ? new Date(formData.startTime).toISOString() : undefined;
            }
            if (formData.endTime !== undefined) {
                payload.endTime = formData.endTime ? new Date(formData.endTime).toISOString() : undefined;
            }

            // ✅ FIX: Use `id` instead of `examId`
            await updateMutation.mutateAsync({ id: examId, data: payload });
            toast.success('Ujian berhasil diupdate');
            router.push(`/admin/exams/${examId}`);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            const message = err?.response?.data?.message || 'Gagal update ujian';
            toast.error(message);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="container mx-auto py-8 max-w-3xl space-y-6">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-48" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
            </div>
        );
    }

    // Error state
    if (isError || !examData) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="py-8 text-center">
                        <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
                        <p className="text-muted-foreground mb-4">
                            Ujian tidak ditemukan.
                        </p>
                        <Link href="/admin/exams">
                            <Button variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Kembali
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 max-w-3xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link href={`/admin/exams/${examId}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Edit Ujian</h1>
                    <p className="text-muted-foreground">
                        {examData.exam.title}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Informasi Dasar
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">
                                Judul Ujian <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="title"
                                value={formData.title || ''}
                                onChange={(e) => handleChange('title', e.target.value)}
                                placeholder="Contoh: Ujian SKD CPNS 2024"
                                className={errors.title ? 'border-destructive' : ''}
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">{errors.title}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea
                                id="description"
                                value={formData.description || ''}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Deskripsi ujian (opsional)"
                                rows={3}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Duration & Scoring */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Durasi & Penilaian
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="duration">
                                    Durasi (menit) <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    min={1}
                                    max={480}
                                    value={formData.durationMinutes || ''}
                                    onChange={(e) => handleChange('durationMinutes', parseInt(e.target.value) || 0)}
                                    className={errors.durationMinutes ? 'border-destructive' : ''}
                                />
                                {errors.durationMinutes && (
                                    <p className="text-sm text-destructive">{errors.durationMinutes}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="passingScore">
                                    Passing Score
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="passingScore"
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={formData.passingScore || ''}
                                        onChange={(e) => handleChange('passingScore', parseInt(e.target.value) || 0)}
                                        className={errors.passingScore ? 'border-destructive' : ''}
                                    />
                                    <Target className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                </div>
                                {errors.passingScore && (
                                    <p className="text-sm text-destructive">{errors.passingScore}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Schedule */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Jadwal (Opsional)
                        </CardTitle>
                        <CardDescription>
                            Kosongkan untuk menghapus batasan waktu
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startTime">Waktu Mulai</Label>
                                <Input
                                    id="startTime"
                                    type="datetime-local"
                                    value={formData.startTime || ''}
                                    onChange={(e) => handleChange('startTime', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endTime">Waktu Selesai</Label>
                                <Input
                                    id="endTime"
                                    type="datetime-local"
                                    value={formData.endTime || ''}
                                    onChange={(e) => handleChange('endTime', e.target.value)}
                                    className={errors.endTime ? 'border-destructive' : ''}
                                />
                                {errors.endTime && (
                                    <p className="text-sm text-destructive">{errors.endTime}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-end gap-4">
                    <Link href={`/admin/exams/${examId}`}>
                        <Button type="button" variant="outline">
                            Batal
                        </Button>
                    </Link>
                    <Button type="submit" disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        Simpan Perubahan
                    </Button>
                </div>
            </form>
        </div>
    );
}