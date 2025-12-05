// src/features/questions/components/QuestionCard.tsx
'use client';

import Link from 'next/link';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import type { QuestionWithUsage } from '../types/questions.types';

interface QuestionCardProps {
    question: QuestionWithUsage;
    onDelete?: (id: string) => void;
}

export function QuestionCard({ question, onDelete }: QuestionCardProps) {
    const typeColors = {
        TIU: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
        TWK: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
        TKP: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
    };

    const usageCount = question._count?.examQuestions || 0;

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge className={typeColors[question.questionType]}>
                                {question.questionType}
                            </Badge>
                            <Badge variant="outline">{question.defaultScore} pts</Badge>
                        </div>
                    </div>

                    {usageCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                            {usageCount} exam{usageCount > 1 ? 's' : ''}
                        </Badge>
                    )}
                </div>

                {/* Question Preview */}
                <p className="text-sm text-foreground line-clamp-3 mb-4 leading-relaxed">
                    {question.content}
                </p>

                {/* Metadata */}
                <div className="text-xs text-muted-foreground mb-4">
                    Created: {new Date(question.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                })}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <Link href={`/admin/questions/${question.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                        </Button>
                    </Link>
                    <Link href={`/admin/questions/${question.id}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                    </Link>
                    {onDelete && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(question.id)}
                            className="text-red-600 hover:text-red-700"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}