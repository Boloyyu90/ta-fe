/**
 * Admin Edit Exam Page
 *
 * Form for editing an existing exam with fields:
 * - title
 * - description
 * - durationMinutes
 * - passingScore
 * - startTime
 * - endTime
 *
 * Uses useAdminExam to load data, useUpdateExam to submit changes
 */

'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useAdminExam, useUpdateExam } from '@/features/exams/hooks';

// UI Components
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/components/ui/form';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface PageProps {
    params: Promise<{ id: string }>;
}

// Form validation schema
const updateExamSchema = z.object({
    title: z
        .string()
        .min(3, 'Judul minimal 3 karakter')
        .max(200, 'Judul maksimal 200 karakter'),
    description: z
        .string()
        .max(2000, 'Deskripsi maksimal 2000 karakter')
        .optional()
        .or(z.literal('')),
    durationMinutes: z
        .number({ invalid_type_error: 'Durasi harus berupa angka' })
        .min(1, 'Durasi minimal 1 menit')
        .max(300, 'Durasi maksimal 300 menit (5 jam)'),
    passingScore: z
        .number({ invalid_type_error: 'Passing score harus berupa angka' })
        .min(0, 'Passing score minimal 0')
        .optional(),
    startTime: z.string().optional().or(z.literal('')),
    endTime: z.string().optional().or(z.literal('')),
}).refine(
    (data) => {
        // Validate endTime is after startTime if both are provided
        if (data.startTime && data.endTime) {
            return new Date(data.endTime) > new Date(data.startTime);
        }
        return true;
    },
    {
        message: 'Waktu selesai harus setelah waktu mulai',
        path: ['endTime'],
    }
);

type UpdateExamFormValues = z.infer<typeof updateExamSchema>;

// Helper to convert ISO string to datetime-local format
const toDatetimeLocal = (isoString: string | null): string => {
    if (!isoString) return '';
    const date = new Date(isoString);
    // Format: YYYY-MM-DDTHH:mm
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function EditExamPage({ params }: PageProps) {
    const router = useRouter();
    const resolvedParams = use(params);
    const examId = parseInt(resolvedParams.id, 10);

    // Queries & Mutations
    const { data: examData, isLoading, isError, error } = useAdminExam(examId);
    const updateMutation = useUpdateExam();

    const exam = examData?.exam;

    const form = useForm<UpdateExamFormValues>({
        resolver: zodResolver(updateExamSchema),
        defaultValues: {
            title: '',
            description: '',
            durationMinutes: 90,
            passingScore: 60,
            startTime: '',
            endTime: '',
        },
    });

    // Populate form when exam data loads
    useEffect(() => {
        if (exam) {
            form.reset({
                title: exam.title,
                description: exam.description || '',
                durationMinutes: exam.durationMinutes,
                passingScore: exam.passingScore,
                startTime: toDatetimeLocal(exam.startTime),
                endTime: toDatetimeLocal(exam.endTime),
            });
        }
    }, [exam, form]);

    const onSubmit = async (data: UpdateExamFormValues) => {
        try {
            // Only include changed fields
            const updateData: Record<string, unknown> = {};

            if (data.title !== exam?.title) {
                updateData.title = data.title;
            }
            if (data.description !== (exam?.description || '')) {
                updateData.description = data.description || null;
            }
            if (data.durationMinutes !== exam?.durationMinutes) {
                updateData.durationMinutes = data.durationMinutes;
            }
            if (data.passingScore !== exam?.passingScore) {
                updateData.passingScore = data.passingScore;
            }

            // Handle datetime fields
            const newStartTime = data.startTime ? new Date(data.startTime).toISOString() : null;
            const oldStartTime = exam?.startTime || null;
            if (newStartTime !== oldStartTime) {
                updateData.startTime = newStartTime;
            }

            const newEndTime = data.endTime ? new Date(data.endTime).toISOString() : null;
            const oldEndTime = exam?.endTime || null;
            if (newEndTime !== oldEndTime) {
                updateData.endTime = newEndTime;
            }

            // Check if any changes were made
            if (Object.keys(updateData).length === 0) {
                toast.info('Tidak ada perubahan');
                return;
            }

            await updateMutation.mutateAsync({
                id: examId,
                data: updateData,
            });

            toast.success('Ujian berhasil diperbarui');
            router.push(`/admin/exams/${examId}`);
        } catch (err: any) {
            console.error('Failed to update exam:', err);
            toast.error(err.message || 'Gagal memperbarui ujian');
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-muted/30">
                <div className="bg-background border-b border-border">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-10 w-10" />
                            <Skeleton className="h-8 w-48" />
                        </div>
                    </div>
                </div>
                <div className="container mx-auto px-4 py-8">
                    <Card className="max-w-2xl mx-auto">
                        <CardContent className="p-6 space-y-6">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Error state
    if (isError || !exam) {
        return (
            <div className="min-h-screen bg-muted/30">
                <div className="container mx-auto px-4 py-8">
                    <Card className="max-w-2xl mx-auto">
                        <CardContent className="p-6">
                            <div className="text-center py-8">
                                <p className="text-destructive mb-4">
                                    Gagal memuat data ujian: {error?.message || 'Ujian tidak ditemukan'}
                                </p>
                                <Link href="/admin/exams">
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
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center gap-4">
                        <Link href={`/admin/exams/${examId}`}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Edit Ujian</h1>
                            <p className="text-muted-foreground">
                                {exam.title} (ID: {exam.id})
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Detail Ujian</CardTitle>
                        <CardDescription>
                            Perbarui informasi ujian
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/* Title */}
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Judul Ujian *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Contoh: Simulasi CPNS 2024 - Paket 1"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Nama ujian yang akan ditampilkan kepada peserta
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Description */}
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Deskripsi</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Deskripsi singkat tentang ujian ini..."
                                                    rows={4}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Informasi tambahan untuk peserta (opsional)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Duration & Passing Score */}
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="durationMinutes"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Durasi (menit) *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        max={300}
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(parseInt(e.target.value) || 0)
                                                        }
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Waktu pengerjaan (1-300 menit)
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="passingScore"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Passing Score</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(parseInt(e.target.value) || 0)
                                                        }
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Nilai minimal untuk lulus
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Start & End Time */}
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="startTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Waktu Mulai</FormLabel>
                                                <FormControl>
                                                    <Input type="datetime-local" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Kosongkan jika selalu tersedia
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="endTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Waktu Selesai</FormLabel>
                                                <FormControl>
                                                    <Input type="datetime-local" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Kosongkan jika tidak ada batas waktu
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex justify-end gap-3 pt-4">
                                    <Link href={`/admin/exams/${examId}`}>
                                        <Button type="button" variant="outline">
                                            Batal
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={updateMutation.isPending}>
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
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}