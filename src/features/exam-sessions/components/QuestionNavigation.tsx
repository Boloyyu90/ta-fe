// src/features/exam-sessions/components/QuestionNavigation.tsx
'use client';

import { Button } from '@/shared/components/ui/button';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/shared/components/ui/sheet';

interface QuestionNavigationProps {
    currentIndex: number;
    totalQuestions: number;
    answeredQuestions: Set<number>; // Set of examQuestionIds
    questions: Array<{ examQuestionId: number }>;
    onNavigate: (index: number) => void;
    onPrevious: () => void;
    onNext: () => void;
    canGoPrevious: boolean;
    canGoNext: boolean;
}

export function QuestionNavigation({
                                       currentIndex,
                                       totalQuestions,
                                       answeredQuestions,
                                       questions,
                                       onNavigate,
                                       onPrevious,
                                       onNext,
                                       canGoPrevious,
                                       canGoNext,
                                   }: QuestionNavigationProps) {
    return (
        <div className="sticky bottom-0 bg-background border-t border-border p-4 shadow-lg">
            <div className="container mx-auto flex items-center justify-between gap-4">
                {/* Previous Button */}
                <Button
                    variant="outline"
                    onClick={onPrevious}
                    disabled={!canGoPrevious}
                    className="flex items-center gap-2"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>

                {/* Question Overview */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                            <List className="h-4 w-4" />
                            <span className="hidden sm:inline">Question Overview</span>
                            <span className="sm:hidden">Overview</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Question Overview</SheetTitle>
                            <SheetDescription>
                                {answeredQuestions.size} of {totalQuestions} answered
                            </SheetDescription>
                        </SheetHeader>

                        <div className="grid grid-cols-5 gap-2 mt-6">
                            {questions.map((q, index) => {
                                const isAnswered = answeredQuestions.has(q.examQuestionId);
                                const isCurrent = index === currentIndex;

                                return (
                                    <Button
                                        key={q.examQuestionId}
                                        variant={isCurrent ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => onNavigate(index)}
                                        className={`
                      relative
                      ${isAnswered && !isCurrent ? 'border-green-500' : ''}
                    `}
                                    >
                                        {index + 1}
                                        {isAnswered && !isCurrent && (
                                            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-green-500" />
                                        )}
                                    </Button>
                                );
                            })}
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Next Button */}
                <Button
                    variant="outline"
                    onClick={onNext}
                    disabled={!canGoNext}
                    className="flex items-center gap-2"
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}