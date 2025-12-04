// src/app/(participant)/exams/[id]/page.tsx
'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Clock, BookOpen, PlayCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
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
import { Separator } from '@/shared/components/ui/separator';
import { useExam } from '@/features/exams/hooks/useExam';
import { useStartExam } from '@/features/exams/hooks/useStartExam';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ExamDetailPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const examId = parseInt(resolvedParams.id);
    const router = useRouter();

    const [showStartDialog, setShowStartDialog] = useState(false);

    const { data, isLoading, error } = useExam(examId);
    const { mutate: startExam, isPending: isStarting } = useStartExam();

    const exam = data?.exam;

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading exam details...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !exam) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                    <h2 className="text-2xl font-bold text-foreground">Exam Not Found</h2>
                    <p className="text-muted-foreground">This exam does not exist or has been removed.</p>
                    <Button onClick={() => router.push('/exams')}>Browse Exams</Button>
                </div>
            </div>
        );
    }

    const handleStartExam = () => {
        setShowStartDialog(true);
    };

    const confirmStartExam = () => {
        setShowStartDialog(false);
        startExam(examId);
    };

    const hasQuestions = (exam._count?.examQuestions || 0) > 0;
    const hasSchedule = exam.startTime && exam.endTime;

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/exams')}
                        className="mb-4"
                    >
                        ← Back to Exams
                    </Button>
                    <h1 className="text-3xl font-bold text-foreground">{exam.title}</h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column: Exam Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>About This Exam</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {exam.description ? (
                                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                                        {exam.description}
                                    </p>
                                ) : (
                                    <p className="text-muted-foreground italic">No description provided.</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Exam Rules */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Exam Rules & Instructions</CardTitle>
                                <CardDescription>Please read carefully before starting</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-xs font-bold text-primary">1</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground mb-1">Webcam Required</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Your webcam will be active throughout the exam for proctoring. Ensure your face is visible.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-xs font-bold text-primary">2</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground mb-1">Time Limit Strictly Enforced</h4>
                                            <p className="text-sm text-muted-foreground">
                                                You have {exam.durationMinutes} minutes to complete the exam. Auto-submit when time expires.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-xs font-bold text-primary">3</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground mb-1">Violation Policy</h4>
                                            <p className="text-sm text-muted-foreground">
                                                3 HIGH severity violations (looking away, multiple faces detected) will automatically cancel your exam.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-xs font-bold text-primary">4</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground mb-1">No Breaks Allowed</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Once started, you cannot pause the exam. Ensure you have uninterrupted time available.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-xs font-bold text-primary">5</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground mb-1">Single Attempt Only</h4>
                                            <p className="text-sm text-muted-foreground">
                                                You can only take this exam once. Make sure you're ready before starting.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Important</AlertTitle>
                                    <AlertDescription>
                                        Ensure you have a stable internet connection and a quiet environment before starting the exam.
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                        </Card>

                        {/* Technical Requirements */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Technical Requirements</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        <span>Working webcam with clear video</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        <span>Stable internet connection (minimum 1 Mbps)</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        <span>Modern browser (Chrome, Firefox, Safari, Edge)</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        <span>Quiet environment with good lighting</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Exam Stats & Start Button */}
                    <div className="space-y-6">
                        {/* Exam Statistics */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Exam Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <BookOpen className="h-4 w-4" />
                                        <span className="text-sm">Questions</span>
                                    </div>
                                    <span className="font-semibold text-foreground">
                    {exam._count?.examQuestions || 0}
                  </span>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span className="text-sm">Duration</span>
                                    </div>
                                    <span className="font-semibold text-foreground">
                    {exam.durationMinutes} minutes
                  </span>
                                </div>

                                {hasSchedule && (
                                    <>
                                        <Separator />
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Available From</span>
                                                <span className="font-medium text-foreground">
                          {new Date(exam.startTime!).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                          })}
                        </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Available Until</span>
                                                <span className="font-medium text-foreground">
                          {new Date(exam.endTime!).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                          })}
                        </span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Warnings */}
                        {!hasQuestions && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>No Questions Available</AlertTitle>
                                <AlertDescription>
                                    This exam has no questions yet. Please contact the administrator.
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Start Button */}
                        <Card className="border-primary/50 bg-primary/5">
                            <CardContent className="pt-6">
                                <Button
                                    size="lg"
                                    className="w-full"
                                    onClick={handleStartExam}
                                    disabled={!hasQuestions || isStarting}
                                >
                                    {isStarting ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                            Starting...
                                        </>
                                    ) : (
                                        <>
                                            <PlayCircle className="h-5 w-5 mr-2" />
                                            Start Exam
                                        </>
                                    )}
                                </Button>
                                <p className="text-xs text-muted-foreground text-center mt-3">
                                    By starting, you agree to the exam rules and proctoring policy
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Start Confirmation Dialog */}
            <AlertDialog open={showStartDialog} onOpenChange={setShowStartDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ready to Start?</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3">
                            <p>Once you start the exam:</p>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>The timer will begin immediately</li>
                                <li>Your webcam will be activated for proctoring</li>
                                <li>You cannot pause or restart the exam</li>
                                <li>You have {exam.durationMinutes} minutes to complete</li>
                            </ul>
                            <p className="font-semibold">Are you ready to begin?</p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Not Yet</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmStartExam}>
                            Yes, Start Exam
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}