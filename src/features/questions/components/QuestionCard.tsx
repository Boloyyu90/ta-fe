// src/features/questions/components/QuestionCard.tsx

/**
 * Question Card Component
 *
 * ✅ AUDIT FIX v3: onDelete now expects number ID, not string
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import { MoreVertical, Edit, Trash2, Eye, FileText } from 'lucide-react';
import type { QuestionWithUsage, QuestionType } from '../types/questions.types';

export interface QuestionCardProps {
    question: QuestionWithUsage;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
    onView?: (id: number) => void;
    isDeleting?: boolean;
}

const questionTypeConfig: Record<QuestionType, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
    TIU: { label: 'TIU', variant: 'default' },
    TWK: { label: 'TWK', variant: 'secondary' },
    TKP: { label: 'TKP', variant: 'outline' },
};

export function QuestionCard({ question, onEdit, onDelete, onView, isDeleting }: QuestionCardProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const typeConfig = questionTypeConfig[question.questionType];
    const usageCount = question._count?.examQuestions ?? 0;

    const handleDelete = () => {
        if (onDelete) {
            // ✅ FIX: question.id is already number
            onDelete(question.id);
        }
        setShowDeleteDialog(false);
    };

    return (
        <>
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                                <Badge variant={typeConfig.variant}>
                                    {typeConfig.label}
                                </Badge>
                                <Badge variant="outline">
                                    {question.defaultScore} poin
                                </Badge>
                            </div>
                            <CardTitle className="text-base line-clamp-2 mt-2">
                                {question.content}
                            </CardTitle>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {onView && (
                                    <DropdownMenuItem onClick={() => onView(question.id)}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Lihat Detail
                                    </DropdownMenuItem>
                                )}
                                {onEdit && (
                                    <DropdownMenuItem onClick={() => onEdit(question.id)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                )}
                                {onDelete && (
                                    <DropdownMenuItem
                                        onClick={() => setShowDeleteDialog(true)}
                                        className="text-destructive focus:text-destructive"
                                        disabled={usageCount > 0}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Hapus
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>

                <CardContent className="space-y-3">
                    {/* Options Preview */}
                    <div className="grid grid-cols-1 gap-1 text-sm">
                        {Object.entries(question.options).slice(0, 3).map(([key, value]) => (
                            <div
                                key={key}
                                className={`flex items-start gap-2 p-2 rounded ${
                                    key === question.correctAnswer
                                        ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                        : 'bg-muted'
                                }`}
                            >
                                <span className="font-medium">{key}.</span>
                                <span className="line-clamp-1">{value}</span>
                            </div>
                        ))}
                        {Object.keys(question.options).length > 3 && (
                            <div className="text-muted-foreground text-center py-1">
                                +{Object.keys(question.options).length - 3} opsi lainnya
                            </div>
                        )}
                    </div>

                    {/* Footer Info */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                        <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            <span>
                                Digunakan di {usageCount} ujian
                            </span>
                        </div>
                        <span>
                            Jawaban: {question.correctAnswer}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Pertanyaan?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Pertanyaan akan dihapus secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? 'Menghapus...' : 'Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default QuestionCard;