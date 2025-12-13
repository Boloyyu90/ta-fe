// src/app/(admin)/admin/exams/create/page.tsx

/**
 * Admin Create Exam Page
 *
 * Form for creating a new exam with fields:
 * - title (required)
 * - description (optional)
 * - durationMinutes (required)
 * - passingScore (optional, default 60)
 * - startTime (optional)
 * - endTime (optional)
 */

'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useCreateExam } from '@/features/exams/hooks';

// UI Components
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
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

// Form validation schema
// ✅ FIX: Use z.coerce.number() for form inputs (HTML inputs always return strings)
const createExamSchema = z.object({
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
        .coerce
        .number({ required_error: 'Durasi wajib diisi' })
        .min(1, 'Durasi minimal 1 menit')
        .max(300, 'Durasi maksimal 300 menit (5 jam)'),
    passingScore: z
        .coerce
        .number()
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

type CreateExamFormValues = z.infer<typeof createExamSchema>;

export default function CreateExamPage() {
    const router = useRouter();
    const createMutation = useCreateExam();

    const form = useForm<CreateExamFormValues>({
        resolver: zodResolver(createExamSchema),
        defaultValues: {
            title: '',
            description: '',
            durationMinutes: 90,
            passingScore: 60,
            startTime: '',
            endTime: '',
        },
    });

    const onSubmit = async (data: CreateExamFormValues) => {
        try {
            // Transform data for API
            const requestData = {
                title: data.title,
                description: data.description || undefined,
                durationMinutes: data.durationMinutes,
                passingScore: data.passingScore,
                // Convert datetime-local to ISO string
                startTime: data.startTime ? new Date(data.startTime).toISOString() : undefined,
                endTime: data.endTime ? new Date(data.endTime).toISOString() : undefined,
            };

            const result = await createMutation.mutateAsync(requestData);

            toast.success('Ujian berhasil dibuat');

            // Navigate to exam detail page to add questions
            router.push(`/admin/exams/${result.exam.id}`);
        } catch (error: unknown) {
            console.error('Failed to create exam:', error);
            const errorMessage = error instanceof Error ? error.message : 'Gagal membuat ujian';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/exams">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Buat Ujian Baru</h1>
                            <p className="text-muted-foreground">
                                Isi detail ujian, lalu tambahkan soal
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
                            Informasi dasar tentang ujian yang akan dibuat
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
                                    <Link href="/admin/exams">
                                        <Button type="button" variant="outline">
                                            Batal
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={createMutation.isPending}>
                                        {createMutation.isPending ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Buat Ujian
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