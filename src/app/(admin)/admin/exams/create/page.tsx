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
import { EXAM_ERRORS, getErrorMessage } from '@/shared/lib/errors';

// UI Components
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Checkbox } from '@/shared/components/ui/checkbox';
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
    RefreshCw,
    AlertTriangle,
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
        allowRetake: false,
        maxAttempts: null,
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

        // Validate retake settings
        if (formData.allowRetake && formData.maxAttempts !== null && formData.maxAttempts !== undefined) {
            if (formData.maxAttempts < 1) {
                newErrors.maxAttempts = 'Maksimal percobaan minimal 1';
            } else if (formData.maxAttempts > 10) {
                newErrors.maxAttempts = 'Maksimal percobaan tidak boleh lebih dari 10';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle input changes
    const handleChange = (field: keyof CreateExamRequest, value: string | number | boolean | null) => {
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
                allowRetake: formData.allowRetake,
                maxAttempts: formData.maxAttempts,
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
        } catch (error: unknown) {
            const err = error as {
                response?: {
                    data?: {
                        errorCode?: string;
                        message?: string;
                        errors?: Array<{ field: string; message: string }>;
                    };
                };
            };

            const errorCode = err?.response?.data?.errorCode;
            const backendMessage = err?.response?.data?.message;
            const fieldErrors = err?.response?.data?.errors;

            // Handle specific error codes
            if (errorCode) {
                if (errorCode === EXAM_ERRORS.EXAM_NO_QUESTIONS) {
                    toast.error(getErrorMessage(errorCode));
                    return;
                }
                if (errorCode === EXAM_ERRORS.EXAM_NO_DURATION) {
                    toast.error(getErrorMessage(errorCode));
                    return;
                }
                // Try to get Indonesian message for error code
                const message = getErrorMessage(errorCode);
                if (message !== 'Terjadi kesalahan') {
                    toast.error(message);
                    return;
                }
            }

            // Handle validation errors with field-level messages
            if (fieldErrors && fieldErrors.length > 0) {
                const newErrors: Record<string, string> = {};
                fieldErrors.forEach((err) => {
                    newErrors[err.field] = err.message;
                });
                setErrors(newErrors);
                toast.error('Terdapat kesalahan validasi. Mohon periksa form Anda.');
                return;
            }

            // Fallback to generic error
            const message = backendMessage || 'Gagal membuat ujian';
            toast.error(message);
        }
    };

    return (
        <div className="container mx-auto py-8 max-w-3xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/exams">
                    <Button variant="ghost" size="icon" aria-label="Kembali">
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

                {/* Retake Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <RefreshCw className="h-5 w-5" />
                            Pengaturan Pengulangan
                        </CardTitle>
                        <CardDescription>
                            Atur apakah peserta dapat mengulang ujian ini
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="allowRetake"
                                checked={formData.allowRetake || false}
                                onCheckedChange={(checked) => {
                                    handleChange('allowRetake', checked as boolean);
                                    // Reset maxAttempts when disabling retake
                                    if (!checked) {
                                        handleChange('maxAttempts', null);
                                    }
                                }}
                            />
                            <Label
                                htmlFor="allowRetake"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Izinkan peserta mengulang ujian
                            </Label>
                        </div>

                        {formData.allowRetake && (
                            <div className="space-y-2 ml-6">
                                <Label htmlFor="maxAttempts">
                                    Maksimal Percobaan
                                </Label>
                                <Input
                                    id="maxAttempts"
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={formData.maxAttempts || ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        handleChange('maxAttempts', value ? parseInt(value) : null);
                                    }}
                                    placeholder="Kosongkan untuk unlimited"
                                    className={errors.maxAttempts ? 'border-destructive' : ''}
                                />
                                {errors.maxAttempts && (
                                    <p className="text-sm text-destructive">{errors.maxAttempts}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Jumlah maksimal peserta dapat mengulang ujian (1-10). Kosongkan untuk unlimited.
                                </p>
                            </div>
                        )}

                        {!formData.allowRetake && (
                            <div className="space-y-2 ml-6">
                                <p className="text-sm text-muted-foreground">
                                    Peserta hanya dapat mengikuti ujian ini satu kali.
                                </p>
                                {formData.maxAttempts && formData.maxAttempts > 0 && (
                                    <p className="text-xs text-warning flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        Catatan: Nilai maksimal percobaan akan diabaikan karena pengulangan dinonaktifkan.
                                    </p>
                                )}
                            </div>
                        )}
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