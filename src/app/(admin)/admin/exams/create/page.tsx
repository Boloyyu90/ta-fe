// src/app/(admin)/admin/exams/new/page.tsx

/**
 * Admin Create Exam Page
 *
 * Features:
 * - Create new exam with form validation
 * - Set title, description, duration, passing score
 * - Set optional start/end time
 * - Redirect to exam detail after creation
 *
 * Backend endpoint:
 * - POST /api/v1/admin/exams
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useCreateExam } from '@/features/exams/hooks';
import type { CreateExamRequest } from '@/features/exams/types/exams.types';

// UI Components
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import {
    ArrowLeft,
    Save,
    Loader2,
    Clock,
    Target,
    Calendar,
    FileText,
} from 'lucide-react';

export default function CreateExamPage() {
    const router = useRouter();
    const createMutation = useCreateExam();

    // Form state
    const [formData, setFormData] = useState<CreateExamRequest>({
        title: '',
        description: '',
        durationMinutes: 90,
        passingScore: 70,
        startTime: '',
        endTime: '',
    });

    // Form validation
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Judul ujian wajib diisi';
        } else if (formData.title.length < 3) {
            newErrors.title = 'Judul minimal 3 karakter';
        } else if (formData.title.length > 200) {
            newErrors.title = 'Judul maksimal 200 karakter';
        }

        if (formData.durationMinutes < 1) {
            newErrors.durationMinutes = 'Durasi minimal 1 menit';
        } else if (formData.durationMinutes > 480) {
            newErrors.durationMinutes = 'Durasi maksimal 480 menit (8 jam)';
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
    const handleChange = (field: keyof CreateExamRequest, value: string | number) => {
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
            // Clean up empty optional fields
            const payload: CreateExamRequest = {
                title: formData.title.trim(),
                durationMinutes: formData.durationMinutes,
                passingScore: formData.passingScore,
            };

            if (formData.description?.trim()) {
                payload.description = formData.description.trim();
            }
            if (formData.startTime) {
                payload.startTime = new Date(formData.startTime).toISOString();
            }
            if (formData.endTime) {
                payload.endTime = new Date(formData.endTime).toISOString();
            }

            const response = await createMutation.mutateAsync(payload);
            toast.success('Ujian berhasil dibuat');

            // Redirect to exam detail
            if (response?.exam?.id) {
                router.push(`/admin/exams/${response.exam.id}`);
            } else {
                router.push('/admin/exams');
            }
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Gagal membuat ujian';
            toast.error(message);
        }
    };

    return (
        <div className="container mx-auto py-8 max-w-3xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/exams">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Buat Ujian Baru</h1>
                    <p className="text-muted-foreground">
                        Isi detail ujian untuk membuatnya
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
                        <CardDescription>
                            Detail utama ujian
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">
                                Judul Ujian <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="title"
                                value={formData.title}
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
                                    value={formData.durationMinutes}
                                    onChange={(e) => handleChange('durationMinutes', parseInt(e.target.value) || 0)}
                                    className={errors.durationMinutes ? 'border-destructive' : ''}
                                />
                                {errors.durationMinutes && (
                                    <p className="text-sm text-destructive">{errors.durationMinutes}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Standar SKD CPNS: 90 menit
                                </p>
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
                                        value={formData.passingScore}
                                        onChange={(e) => handleChange('passingScore', parseInt(e.target.value) || 0)}
                                        className={errors.passingScore ? 'border-destructive' : ''}
                                    />
                                    <Target className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                </div>
                                {errors.passingScore && (
                                    <p className="text-sm text-destructive">{errors.passingScore}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Nilai minimum untuk lulus (0-100)
                                </p>
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
                            Atur waktu mulai dan selesai ujian. Kosongkan jika tidak ada batasan waktu.
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
                    <Link href="/admin/exams">
                        <Button type="button" variant="outline">
                            Batal
                        </Button>
                    </Link>
                    <Button type="submit" disabled={createMutation.isPending}>
                        {createMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        Buat Ujian
                    </Button>
                </div>
            </form>
        </div>
    );
}