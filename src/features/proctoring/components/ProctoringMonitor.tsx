// src/features/proctoring/components/ProctoringMonitor.tsx

'use client';

/**
 * PROCTORING MONITOR COMPONENT
 *
 * ✅ Webcam access and frame capture
 * ✅ Periodic face analysis via YOLO
 * ✅ Progressive warning system
 * ✅ Auto-cancel on excessive violations
 *
 * USAGE:
 * <ProctoringMonitor
 *   sessionId={sessionId}
 *   onExamCancelled={() => router.push('/dashboard')}
 * />
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAnalyzeFace } from '../hooks/useAnalyzeFace';
import { useProctoringEvents } from '../hooks/useProctoringEvents';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Badge } from '@/shared/components/ui/badge';
import {
    Camera,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Eye,
    EyeOff
} from 'lucide-react';
import type { ViolationCounts } from '../types/proctoring.types';

interface ProctoringMonitorProps {
    sessionId: number;
    onExamCancelled?: () => void;
    analyzeIntervalMs?: number; // Default: 10000 (10 seconds)
    maxViolations?: number; // Default: 10
}

export function ProctoringMonitor({
                                      sessionId,
                                      onExamCancelled,
                                      analyzeIntervalMs = 10000,
                                      maxViolations = 10,
                                  }: ProctoringMonitorProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const [cameraStatus, setCameraStatus] = useState<'initializing' | 'active' | 'error' | 'denied'>('initializing');
    const [lastAnalysis, setLastAnalysis] = useState<{
        faceDetected: boolean;
        message: string;
        timestamp: Date;
    } | null>(null);

    const analyzeFaceMutation = useAnalyzeFace(sessionId);
    const { data: eventsData } = useProctoringEvents(sessionId, { limit: 100 });

    // Calculate violation counts
    const violationCounts: ViolationCounts = {
        low: 0,
        medium: 0,
        high: 0,
        total: 0,
    };

    if (eventsData?.data) {
        eventsData.data.forEach((event) => {
            if (event.eventType !== 'FACE_DETECTED') {
                violationCounts.total++;
                if (event.severity === 'LOW') violationCounts.low++;
                if (event.severity === 'MEDIUM') violationCounts.medium++;
                if (event.severity === 'HIGH') violationCounts.high++;
            }
        });
    }

    // Check if exam should be auto-cancelled
    const shouldCancel = violationCounts.total >= maxViolations;

    useEffect(() => {
        if (shouldCancel && onExamCancelled) {
            onExamCancelled();
        }
    }, [shouldCancel, onExamCancelled]);

    // Initialize webcam
    const initializeCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user',
                },
                audio: false,
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setCameraStatus('active');
            }
        } catch (error: any) {
            console.error('Camera access error:', error);
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                setCameraStatus('denied');
            } else {
                setCameraStatus('error');
            }
        }
    }, []);

    // Capture frame and analyze
    const captureAndAnalyze = useCallback(async () => {
        if (!videoRef.current || !canvasRef.current || cameraStatus !== 'active') {
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) {
            return;
        }

        // Draw video frame to canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to base64
        const imageBase64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];

        // Send to backend for analysis
        try {
            const result = await analyzeFaceMutation.mutateAsync({ imageBase64 });

            setLastAnalysis({
                faceDetected: result.analysis.faceDetected,
                message: result.analysis.message,
                timestamp: new Date(),
            });
        } catch (error) {
            console.error('Face analysis error:', error);
        }
    }, [cameraStatus, analyzeFaceMutation]);

    // Initialize camera on mount
    useEffect(() => {
        initializeCamera();

        return () => {
            // Cleanup: stop camera stream
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [initializeCamera]);

    // Periodic face analysis
    useEffect(() => {
        if (cameraStatus !== 'active') return;

        const interval = setInterval(() => {
            captureAndAnalyze();
        }, analyzeIntervalMs);

        return () => clearInterval(interval);
    }, [cameraStatus, analyzeIntervalMs, captureAndAnalyze]);

    // Render camera permission denied
    if (cameraStatus === 'denied') {
        return (
            <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                    <strong>Camera access denied.</strong> You must allow camera access to continue the exam.
                    Please refresh the page and grant camera permissions.
                </AlertDescription>
            </Alert>
        );
    }

    // Render camera error
    if (cameraStatus === 'error') {
        return (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                    <strong>Camera error.</strong> Unable to access your camera. Please check your device settings.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <Card className="border-2">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        Proctoring Active
                    </CardTitle>

                    <div className="flex items-center gap-2">
                        {/* Status indicator */}
                        {lastAnalysis?.faceDetected ? (
                            <Badge variant="default" className="gap-1">
                                <Eye className="h-3 w-3" />
                                Face Detected
                            </Badge>
                        ) : lastAnalysis ? (
                            <Badge variant="destructive" className="gap-1">
                                <EyeOff className="h-3 w-3" />
                                No Face
                            </Badge>
                        ) : (
                            <Badge variant="secondary">
                                Initializing...
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Video preview */}
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />
                    <canvas
                        ref={canvasRef}
                        className="hidden"
                    />

                    {/* Recording indicator */}
                    <div className="absolute top-2 left-2 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        Recording
                    </div>
                </div>

                {/* Violation warnings */}
                {violationCounts.total > 0 && (
                    <Alert variant={violationCounts.high >= 3 ? 'destructive' : 'default'}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            <strong>Violations detected: {violationCounts.total}/{maxViolations}</strong>
                            <div className="text-sm mt-1">
                                High: {violationCounts.high} | Medium: {violationCounts.medium} | Low: {violationCounts.low}
                            </div>
                            {violationCounts.total >= maxViolations * 0.7 && (
                                <div className="text-sm mt-2 font-semibold">
                                    ⚠️ Warning: Your exam will be cancelled at {maxViolations} violations!
                                </div>
                            )}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Last analysis message */}
                {lastAnalysis && (
                    <div className="text-sm text-muted-foreground flex items-center justify-between">
                        <span>{lastAnalysis.message}</span>
                        <span className="text-xs">
                            {lastAnalysis.timestamp.toLocaleTimeString()}
                        </span>
                    </div>
                )}

                {/* Instructions */}
                <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        Keep your face clearly visible at all times
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        Look at the screen during the exam
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        Ensure good lighting
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}