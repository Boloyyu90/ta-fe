'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from 'next/link';
import { toast } from 'sonner';
import { useExamWithAttempts } from '@/features/exams/hooks';
import { useStartExam, useExamAttempts } from '@/features/exam-sessions/hooks';
import { AttemptResultCard, EmptyAttemptsPlaceholder } from '@/features/exam-sessions/components';
import type { ExamAttemptInfo } from '@/features/exams/types/exams.types';
import { EXAM_SESSION_ERRORS, EXAM_ERRORS, getErrorMessage } from '@/shared/lib/errors';
import {
    useCheckExamAccess,
    useCreateTransaction,
    PriceBadge,
    formatPrice,
    type ExamAccessResponse,
} from '@/features/transactions';
import { useCpnsCategoriesWithFallback } from '@/shared/hooks/useCpnsConfig';
import { BackButton } from '@/shared/components/BackButton';
import { StartExamDialog } from '@/features/exams/components';
import {
    isExamAvailable,
    getExamAvailabilityStatus,
    formatDuration,
} from '@/features/exams/types/exams.types';
import type { Exam } from '@/features/exams/types/exams.types';

// UI Components
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog';
import {
    ArrowLeft,
    Clock,
    FileText,
    Target,
    Calendar,
    Play,
    Camera,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Info,
    Loader2,
    RotateCcw,
    Eye,
    CreditCard,
    ClipboardList,
    Tag,
} from 'lucide-react';

interface PageProps {
    params: Promise<{ id: string }>;
}

// Availability config for UI
const availabilityConfig = {
    available: {
        label: 'Tersedia',
        description: 'Ujian ini siap untuk dikerjakan',
        icon: CheckCircle,
        canStart: true,
    },
    upcoming: {
        label: 'Segera',
        description: 'Ujian ini belum dimulai',
        icon: Clock,
        canStart: false,
    },
    ended: {
        label: 'Berakhir',
        description: 'Waktu pengerjaan ujian telah habis',
        icon: XCircle,
        canStart: false,
    },
    'no-questions': {
        label: 'Belum Ada Soal',
        description: 'Ujian ini belum memiliki soal',
        icon: AlertTriangle,
        color: 'text-warning',
        canStart: false,
    },
};

/**
 * Determine the button state based on exam config and attempts data from backend
 *
 * Uses attemptsCount and latestAttempt from GET /exams/:id response
 * which are already filtered to THIS exam only (no pollution from other exams)
 *
 * MODIFIED: Added accessData parameter for payment consideration
 */
function getExamButtonState(
    exam: Exam,
    attemptsCount: number,
    latestAttempt?: ExamAttemptInfo | null,
    accessData?: ExamAccessResponse | null,
): {
    label: string;
    action: 'start' | 'retake' | 'view-result' | 'disabled' | 'payment-required' | 'payment-pending';
    disabled: boolean;
    icon: typeof Play;
    latestAttemptId?: number;
    attemptInfo?: string;
} {
    // NEW: Check payment status for paid exams
    if (exam.price && exam.price > 0) {
        // Still loading access check
        if (!accessData) {
            return {
                label: 'Memeriksa...',
                action: 'disabled',
                disabled: true,
                icon: Clock,
            };
        }

        // No access yet - need to pay
        if (!accessData.hasAccess) {
            if (accessData.reason === 'pending') {
                return {
                    label: 'Lanjutkan Pembayaran',
                    action: 'payment-pending',
                    disabled: false,
                    icon: Clock,
                };
            }
            return {
                label: `Beli ${formatPrice(exam.price)}`,
                action: 'payment-required',
                disabled: false,
                icon: CreditCard,
            };
        }
        // Has access - continue to normal flow
    }

    // No attempts yet - first attempt
    if (attemptsCount === 0 || !latestAttempt) {
        return {
            label: 'Mulai Ujian',
            action: 'start',
            disabled: false,
            icon: Play,
            attemptInfo: 'Percobaan ke-1',
        };
    }

    // Has completed attempts
    // Check retake eligibility
    // Safety defaults (backend now returns these fields, but keeping for robustness)
    const allowRetake = exam.allowRetake ?? false;
    const maxAttempts = exam.maxAttempts ?? null;

    // Edge case guard: invalid maxAttempts value
    if (maxAttempts !== null && maxAttempts <= 0) {
        console.warn(`[ExamDetail] Invalid maxAttempts=${maxAttempts} for exam ${exam.id}`);
        return {
            label: 'Lihat Hasil',
            action: 'view-result',
            disabled: false,
            icon: Eye,
            latestAttemptId: latestAttempt?.id,
            attemptInfo: `Percobaan: ${attemptsCount}`,
        };
    }

    if (!allowRetake) {
        return {
            label: 'Lihat Hasil',
            action: 'view-result',
            disabled: false,
            icon: Eye,
            latestAttemptId: latestAttempt.id,
            attemptInfo: `Percobaan: ${attemptsCount}`,
        };
    }

    // Check if max attempts reached
    if (maxAttempts !== null && attemptsCount >= maxAttempts) {
        return {
            label: `Batas Tercapai (${attemptsCount}/${maxAttempts})`,
            action: 'disabled',
            disabled: true,
            icon: XCircle,
            attemptInfo: `Percobaan: ${attemptsCount}/${maxAttempts}`,
        };
    }

    // Can retake
    const nextAttempt = attemptsCount + 1;
    return {
        label: 'Mulai Lagi',
        action: 'retake',
        disabled: false,
        icon: RotateCcw,
        attemptInfo: maxAttempts
            ? `Percobaan ke-${nextAttempt} dari ${maxAttempts}`
            : `Percobaan ke-${nextAttempt}`,
    };
}

export default function ExamDetailPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const router = useRouter();
    const examId = parseInt(resolvedParams.id, 10);
    const [showStartDialog, setShowStartDialog] = useState(false);

    // Fetch exam details WITH attempts info
    // Backend returns: { exam, attemptsCount, firstAttempt, latestAttempt }
    // This is already filtered to THIS exam only (no pollution from other exams)
    const { data: examData, isLoading, isError } = useExamWithAttempts(examId);

    // Start exam mutation
    const { startExam, isLoading: isStarting } = useStartExam();

    // Fetch user's attempts for this exam (for results section)
    const {
        hasAttempts,
        firstAttempt,
        lastAttempt,
        totalAttempts,
        isLoading: attemptsLoading,
    } = useExamAttempts(examId);

    // Fetch CPNS config with fallback to constants
    const { categories: cpnsCategories } = useCpnsCategoriesWithFallback();

    // Extract data from response
    const exam = examData?.exam;
    const attemptsCount = examData?.attemptsCount ?? 0;
    const latestAttempt = examData?.latestAttempt;

    // NEW: Check payment access for paid exams
    const { data: accessData, isLoading: isCheckingAccess } = useCheckExamAccess(examId, {
        enabled: !!exam?.price, // Only check if exam has price
    });

    // NEW: Payment mutation
    const { createTransaction, isPending: isProcessingPayment } = useCreateTransaction({
        onPaymentSuccess: () => {
            toast.success('Pembayaran berhasil!', {
                description: 'Anda sekarang dapat memulai ujian.',
            });
        },
        onPaymentPending: () => {
            toast.info('Pembayaran tertunda', {
                description: 'Silakan selesaikan pembayaran Anda.',
            });
        },
        onPaymentError: () => {
            toast.error('Pembayaran gagal', {
                description: 'Silakan coba lagi.',
            });
        },
    });

    // Handle start/resume exam
    const handleStartExam = () => {
        startExam(examId, {
            onError: (error: unknown) => {
                const err = error as {
                    response?: {
                        data?: {
                            errorCode?: string;
                            message?: string;
                            context?: { maxAttempts?: number };
                        };
                    };
                };
                const errorCode = err?.response?.data?.errorCode;
                const context = err?.response?.data?.context;
                let message = err?.response?.data?.message || 'Gagal memulai ujian';

                // Map error codes to Indonesian messages
                if (errorCode === 'EXAM_NO_QUESTIONS') {
                    message = getErrorMessage('EXAM_NO_QUESTIONS');
                } else if (errorCode === 'EXAM_NO_DURATION') {
                    message = getErrorMessage('EXAM_NO_DURATION');
                } else if (errorCode === 'EXAM_SESSION_ALREADY_STARTED') {
                    message = getErrorMessage('EXAM_SESSION_ALREADY_STARTED');
                } else if (errorCode === 'EXAM_SESSION_RETAKE_DISABLED') {
                    message = getErrorMessage('EXAM_SESSION_RETAKE_DISABLED');
                } else if (errorCode === 'EXAM_SESSION_MAX_ATTEMPTS') {
                    const maxAttempts = context?.maxAttempts || 'maksimal';
                    message = `Anda telah mencapai batas percobaan (${maxAttempts} kali)`;
                }

                toast.error(message);
            },
        });
    };

    // Handle view result navigation
    const handleViewResult = (attemptId?: number) => {
        if (attemptId) {
            router.push(`/exam-sessions/${attemptId}/review`);
        } else {
            toast.error('Tidak ada hasil ujian yang dapat ditampilkan');
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="container mx-auto py-8 max-w-6xl space-y-8">
                <Skeleton className="h-8 w-24" />
                <div className="space-y-6">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-10 w-96" />
                    <Skeleton className="h-6 w-32" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <Skeleton className="h-48" />
                            <Skeleton className="h-32" />
                        </div>
                        <div className="flex flex-col items-center space-y-6">
                            <Skeleton className="w-full max-w-md aspect-[4/3] rounded-2xl" />
                            <Skeleton className="h-12 w-full max-w-md rounded-full" />
                        </div>
                    </div>
                </div>
                <Skeleton className="h-64" />
            </div>
        );
    }

    // Error or not found
    if (isError || !exam) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="py-8 text-center">
                        <AlertTriangle className="h-12 w-12 mx-auto text-warning mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Ujian Tidak Ditemukan</h2>
                        <p className="text-muted-foreground mb-4">
                            Ujian yang Anda cari tidak tersedia atau sudah dihapus.
                        </p>
                        <Link href="/exams">
                            <Button variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Kembali ke Daftar Ujian
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Get availability and button state
    const availability = getExamAvailabilityStatus(exam);
    const availInfo = availabilityConfig[availability];
    const AvailIcon = availInfo.icon;
    const questionCount = exam._count?.examQuestions ?? 0;

    // Get smart button state using attempts data from backend
    // MODIFIED: Added accessData parameter for payment consideration
    const buttonState = getExamButtonState(exam, attemptsCount, latestAttempt, accessData);
    const ButtonIcon = buttonState.icon;

    // Format dates
    const formatDateTime = (dateString: string | null) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="container mx-auto py-8 max-w-6xl space-y-8">
            <BackButton href="/exams" />

            {/* ========== TOP HERO/DETAIL SECTION ========== */}
            <div className="space-y-6">


                {/* Title */}
                <h1 className="text-3xl font-bold">{exam.title}</h1>

                {/* Status Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                        variant={availability === 'available' ? 'default' : 'secondary'}
                    >
                        <AvailIcon className="h-3 w-3 mr-1" />
                        {availInfo.label}
                    </Badge>
                    {buttonState.attemptInfo && (
                        <Badge variant="outline">{buttonState.attemptInfo}</Badge>
                    )}
                </div>

                {/* Description (if available) */}
                {/* Description (derived from backend policy to avoid mismatch) */}
                {(() => {
                    const attemptText = exam.allowRetake
                        ? (exam.maxAttempts
                            ? `Tryout CPNS dengan maksimal ${exam.maxAttempts} percobaan. Gunakan kesempatan dengan bijak!`
                            : 'Tryout CPNS dengan percobaan tanpa batas. Gunakan kesempatan dengan bijak!')
                        : 'Tryout CPNS tanpa pengulangan. Cocok untuk evaluasi kesiapan ujian.';

                    // Optional: kalau kamu tetap mau tampilkan deskripsi dari backend,
                    // tampilkan hanya jika tidak mengandung info "maksimal X percobaan"
                    const hasAttemptMention =
                        !!exam.description && /maksimal\s+\d+\s+(kali\s+)?percobaan/i.test(exam.description);

                    const heroText = !exam.description
                        ? attemptText
                        : (hasAttemptMention ? attemptText : exam.description);

                    return (
                        <p className="text-muted-foreground max-w-2xl">
                            {heroText}
                        </p>
                    );
                })()}

                {/* 2-Column Layout: Details (left) + Asset & CTA (right) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Detail Paket + Passing Grade */}
                    <div className="space-y-6">
                        {/* Detail Paket Card */}
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <ClipboardList className="h-5 w-5" />
                                    Detail Paket
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg flex items-center justify-center">
                                        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Nama Paket</p>
                                        <p className="font-semibold">{exam.title}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg flex items-center justify-center">
                                        <div className="h-2.5 w-2.5 rounded-full bg-secondary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Jumlah Soal</p>
                                        <p className="font-semibold">{questionCount} Soal</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg flex items-center justify-center">
                                        <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Waktu Pengerjaan</p>
                                        <p className="font-semibold">{formatDuration(exam.durationMinutes)}</p>
                                    </div>
                                </div>
                            </CardContent>

                        </Card>

                        {/* Passing Grade Card */}
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Target className="h-5 w-5" />
                                    Passing Grade
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-2">
                                    {cpnsCategories.map((cat) => (
                                        <Badge
                                            key={cat.type}
                                            variant="secondary"
                                            className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 px-4 py-2 w-fit"
                                        >
                                            {cat.label}: <span className="font-bold ml-1">{cat.passing}</span>
                                        </Badge>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground mt-3">
                                    Nilai minimum: {exam.passingScore} Poin
                                </p>
                            </CardContent>
                        </Card>

                        {/* Schedule Info */}
                        {(exam.startTime || exam.endTime) && (
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Jadwal Ujian
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {exam.startTime && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-muted-foreground">Mulai:</span>
                                            <span>{formatDateTime(exam.startTime)}</span>
                                        </div>
                                    )}
                                    {exam.endTime && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-muted-foreground">Berakhir:</span>
                                            <span>{formatDateTime(exam.endTime)}</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column: Asset Image + Action Button */}
                    <div className="flex flex-col items-center space-y-6">
                        {/* Asset Image */}
                        <div className="relative w-full max-w-md aspect-[3/2] overflow-hidden">
                            <Image
                                src="/images/mockups/exam-detail.webp"
                                alt="Mockup detail ujian"
                                fill
                                className="object-contain p-2"
                                priority
                            />
                        </div>


                        {/* Action Button - Moved to right column */}
                        <div className="w-full max-w-md">
                            {/* Payment Required Action */}
                            {buttonState.action === 'payment-required' && (
                                <Button
                                    size="lg"
                                    onClick={() => createTransaction(examId)}
                                    disabled={isProcessingPayment}
                                    className="w-full rounded-full"
                                >
                                    {isProcessingPayment ? (
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    ) : (
                                        <CreditCard className="h-5 w-5 mr-2" />
                                    )}
                                    {isProcessingPayment ? 'Memproses...' : buttonState.label}
                                </Button>
                            )}

                            {/* Payment Pending Action */}
                            {buttonState.action === 'payment-pending' && (
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => createTransaction(examId)}
                                    disabled={isProcessingPayment}
                                    className="w-full rounded-full"
                                >
                                    {isProcessingPayment ? (
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    ) : (
                                        <Clock className="h-5 w-5 mr-2" />
                                    )}
                                    Lanjutkan Pembayaran
                                </Button>
                            )}

                            {/* View Result Action */}
                            {buttonState.action === 'view-result' && (
                                <Button
                                    size="lg"
                                    onClick={() => handleViewResult(buttonState.latestAttemptId)}
                                    className="w-full rounded-full"
                                >
                                    <Eye className="h-5 w-5 mr-2" />
                                    Lihat Hasil
                                </Button>
                            )}

                            {/* Disabled Action (Max Attempts Reached) */}
                            {buttonState.action === 'disabled' && (
                                <Button size="lg" disabled className="w-full rounded-full">
                                    <XCircle className="h-5 w-5 mr-2" />
                                    {buttonState.label}
                                </Button>
                            )}

                            {(buttonState.action === 'start' || buttonState.action === 'retake') &&
                                availInfo.canStart && (
                                    <>
                                        <Button
                                            size="lg"
                                            disabled={isStarting}
                                            className="w-full rounded-full"
                                            onClick={() => setShowStartDialog(true)}
                                        >
                                            {isStarting ? (
                                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                            ) : (
                                                <ButtonIcon className="h-5 w-5 mr-2" />
                                            )}
                                            {buttonState.label}
                                        </Button>

                                        <StartExamDialog
                                            open={showStartDialog}
                                            onOpenChange={setShowStartDialog}
                                            examTitle={exam.title}
                                            attemptInfo={buttonState.attemptInfo}
                                            isRetake={buttonState.action === 'retake'}
                                            isLoading={isStarting}
                                            onConfirm={handleStartExam}
                                        />
                                    </>
                                )}

                            {/* Unavailable State */}
                            {(buttonState.action === 'start' || buttonState.action === 'retake') &&
                                !availInfo.canStart && (
                                    <Button size="lg" disabled className="w-full rounded-full">
                                        <AvailIcon className="h-5 w-5 mr-2" />
                                        {availInfo.label}
                                    </Button>
                                )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ========== HASIL UJIAN SECTION ========== */}
            <section className="space-y-6 mt-8 pt-8 border-t">
                <h2 className="text-xl font-bold text-center">
                    Kerjakan TryOut untuk Mengetahui Kemampuanmu!
                </h2>

                {attemptsLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                ) : !hasAttempts ? (
                    /* Kondisi A: Belum ada attempt */
                    <EmptyAttemptsPlaceholder />
                ) : (
                    /* Kondisi B: Ada attempts */
                    <div className="space-y-6">
                        {/* Perolehan TryOut Pertama */}
                        {firstAttempt && (
                            <AttemptResultCard
                                title="Perolehan TryOut Pertama"
                                result={firstAttempt}
                            />
                        )}

                        {/* Perolehan TryOut Terakhir (hanya jika > 1 attempt) */}
                        {lastAttempt && totalAttempts > 1 && (
                            <AttemptResultCard
                                title="Perolehan TryOut Terakhir"
                                result={lastAttempt}
                            />
                        )}

                        {/* Button Lihat Selengkapnya */}
                        <div className="flex justify-end">
                            <Button asChild className="bg-primary hover:bg-primary/90">
                                <Link href={`/exams/${examId}/history`}>
                                    Lihat Selengkapnya
                                </Link>
                            </Button>
                        </div>
                    </div>
                )}

            </section>
        </div>
    );
}