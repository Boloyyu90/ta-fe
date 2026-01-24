/**
 * StartExamDialog Component
 *
 * Modal konfirmasi sebelum memulai ujian dengan checklist persiapan.
 * Design based on Figma reference - "Perhatian Sebelum Pengerjaan"
 *
 * Usage:
 * <StartExamDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   examTitle="Tryout CPNS 2025"
 *   attemptInfo="Percobaan ke-1"
 *   isRetake={false}
 *   isLoading={isStarting}
 *   onConfirm={handleStartExam}
 * />
 */

'use client';

import { Globe, Wifi, FileEdit, Heart, Info, Loader2, Play, ArrowLeft } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
} from '@/shared/components/ui/alert-dialog';
import { Button } from '@/shared/components/ui/button';

// ============================================================================
// TYPES
// ============================================================================

interface StartExamDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    examTitle: string;
    attemptInfo?: string;
    isRetake?: boolean;
    isLoading?: boolean;
    onConfirm: () => void;
}

// ============================================================================
// PREPARATION ITEMS CONFIG
// ============================================================================

const PREPARATION_ITEMS = [
    {
        icon: Globe,
        title: 'Rekomendasi Browser',
        description: 'Gunakan Chrome/Firefox untuk pengalaman maksimal.',
    },
    {
        icon: Wifi,
        title: 'Koneksi Stabil',
        description: 'Pastikan koneksi internetmu stabil untuk menghindari kendala lain.',
    },
    {
        icon: FileEdit,
        title: 'Kotretan',
        description: 'Siapkan kotretanmu kalau diperluin',
    },
    {
        icon: Heart,
        title: 'Kejujuran #1',
        description: 'Kerjakan dengan junjung tinggi kejujuran',
    },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function StartExamDialog({
                                    open,
                                    onOpenChange,
                                    examTitle,
                                    attemptInfo,
                                    isRetake = false,
                                    isLoading = false,
                                    onConfirm,
                                }: StartExamDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
                {/* Header */}
                <div className="px-6 pt-6 pb-4 text-center">
                    <h2 className="text-xl font-bold text-foreground">
                        Perhatian Sebelum Pengerjaan
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Sip! Biar Hasilnya Mulus Kayak Jalan Tol!
                    </p>
                </div>

                {/* Preparation Checklist */}
                <div className="px-6 pb-4">
                    <div className="border rounded-xl p-8 space-y-8">
                        {PREPARATION_ITEMS.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <div key={index} className="flex items-start gap-5">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center">
                                        <IconComponent className="w-7 h-7 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-sm text-foreground">
                                            {item.title}
                                        </h4>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Action Buttons */}
                <AlertDialogFooter className="px-6 pb-4 pt-0 flex-row gap-3 sm:gap-3">
                    <Button
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        className="flex-1 rounded-full"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 rounded-full"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Play className="w-4 h-4 mr-2" />
                        )}
                        {isLoading ? 'Memulai...' : 'Mulai Mengerjakan'}
                    </Button>
                </AlertDialogFooter>

                {/* Footer Note */}
                <div className="px-6 pb-6 pt-2">
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <p>
                            <span className="font-medium">Pesan hangat:</span> Baca dengan Cermat! Luangkan waktu untuk memahami setiap pertanyaan sebelum menjawab. Jangan terburu-buru, oke?.
                        </p>
                    </div>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default StartExamDialog;