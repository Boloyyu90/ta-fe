// src/features/proctoring/components/ProctoringMonitor.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, AlertCircle, CheckCircle2, Eye } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Badge } from '@/shared/components/ui/badge';
import { useWebcam } from '../hooks/useWebcam';
import { useProctoring } from '../hooks/useProctoring';
import { useProctoringEvents } from '../hooks/useProctoringEvents';
import type { ViolationCounts, ProctoringEvent } from '../types/proctoring.types';

interface ProctoringMonitorProps {
    sessionId: number;
    isActive: boolean;
    onViolationLimit?: () => void;
}

const VIOLATION_LIMIT = 5;
const CAPTURE_INTERVAL = 5000; // 5 seconds

export function ProctoringMonitor({
                                      sessionId,
                                      isActive,
                                      onViolationLimit,
                                  }: ProctoringMonitorProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const intervalRef = useRef<NodeJS.Timeout>();

    const [violationCounts, setViolationCounts] = useState<ViolationCounts>({
        low: 0,
        medium: 0,
        high: 0,
        total: 0,
    });

    const { webcamState, initializeWebcam, stopWebcam } = useWebcam();
    const { analyzeFace, isAnalyzing } = useProctoring(sessionId);
    const { data: eventsData } = useProctoringEvents(sessionId, {
        page: 1,
        limit: 100,
    });

    // ✅ FIXED: Properly handle unwrapped response - eventsData is already { data: [...], pagination: {...} }
    useEffect(() => {
        if (eventsData) {
            const counts: ViolationCounts = {
                low: 0,
                medium: 0,
                high: 0,
                total: 0,
            };

            // ✅ FIXED: Type the event parameter properly
            eventsData.data.forEach((event: ProctoringEvent) => {
                if (event.severity === 'LOW') counts.low++;
                else if (event.severity === 'MEDIUM') counts.medium++;
                else if (event.severity === 'HIGH') counts.high++;
                counts.total++;
            });

            setViolationCounts(counts);

            // Check if high violations exceed limit
            if (counts.high >= VIOLATION_LIMIT && onViolationLimit) {
                onViolationLimit();
            }
        }
    }, [eventsData, onViolationLimit]);

    // Initialize webcam
    useEffect(() => {
        if (isActive && !webcamState.isActive) {
            initializeWebcam(videoRef);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            stopWebcam();
        };
    }, [isActive, webcamState.isActive, initializeWebcam, stopWebcam]);

    // Start face detection interval
    useEffect(() => {
        if (isActive && webcamState.isActive && !isAnalyzing) {
            intervalRef.current = setInterval(() => {
                captureAndAnalyze();
            }, CAPTURE_INTERVAL);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive, webcamState.isActive, isAnalyzing]);

    const captureAndAnalyze = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(video, 0, 0);

        // Convert to base64
        const imageBase64 = canvas.toDataURL('image/jpeg').split(',')[1];

        await analyzeFace(imageBase64);
    };

    return (
        <Card className="border-2">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        Proctoring Monitor
                    </CardTitle>

                    <Badge variant={isActive ? 'default' : 'secondary'}>
                        {isActive ? 'Active' : 'Inactive'}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Webcam Preview */}
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                    {webcamState.isActive ? (
                        <>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />
                            <canvas ref={canvasRef} className="hidden" />

                            {isAnalyzing && (
                                <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                                    Analyzing...
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white">
                            <div className="text-center space-y-2">
                                <Eye className="h-12 w-12 mx-auto opacity-50" />
                                <p className="text-sm">Webcam not active</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Violation Counts */}
                <div className="grid grid-cols-4 gap-2">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center">
                        <div className="text-xs text-muted-foreground mb-1">Total</div>
                        <div className="text-xl font-bold">{violationCounts.total}</div>
                    </div>
                    <div className="bg-green-100 dark:bg-green-950 rounded-lg p-3 text-center">
                        <div className="text-xs text-green-700 dark:text-green-400 mb-1">Low</div>
                        <div className="text-xl font-bold text-green-700 dark:text-green-400">
                            {violationCounts.low}
                        </div>
                    </div>
                    <div className="bg-yellow-100 dark:bg-yellow-950 rounded-lg p-3 text-center">
                        <div className="text-xs text-yellow-700 dark:text-yellow-400 mb-1">Medium</div>
                        <div className="text-xl font-bold text-yellow-700 dark:text-yellow-400">
                            {violationCounts.medium}
                        </div>
                    </div>
                    <div className="bg-red-100 dark:bg-red-950 rounded-lg p-3 text-center">
                        <div className="text-xs text-red-700 dark:text-red-400 mb-1">High</div>
                        <div className="text-xl font-bold text-red-700 dark:text-red-400">
                            {violationCounts.high}
                        </div>
                    </div>
                </div>

                {/* Warnings */}
                {violationCounts.high >= VIOLATION_LIMIT - 2 && violationCounts.high < VIOLATION_LIMIT && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            ⚠️ Warning: You have {violationCounts.high} high violations. {VIOLATION_LIMIT - violationCounts.high} more will result in exam cancellation!
                        </AlertDescription>
                    </Alert>
                )}

                {violationCounts.high >= VIOLATION_LIMIT && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            ❌ Violation limit reached! Your exam will be automatically cancelled.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Status Messages */}
                {webcamState.error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{webcamState.error}</AlertDescription>
                    </Alert>
                )}

                {!webcamState.error && webcamState.isActive && (
                    <Alert>
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertDescription>
                            Proctoring is active. Please remain in view of the camera.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}