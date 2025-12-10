// src/features/proctoring/components/ProctoringMonitor.tsx

/**
 * Proctoring Monitor Component
 *
 * ✅ AUDIT FIX v3: Fixed details field access on ProctoringEvent
 *
 * Real-time proctoring status display
 */

'use client';

import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import {
    Camera,
    CameraOff,
    AlertTriangle,
    CheckCircle,
    RefreshCw,
    Eye,
} from 'lucide-react';
import { useProctoringStore } from '../store/proctoring.store';
import type { ProctoringEvent } from '../types/proctoring.types';

export interface ProctoringMonitorProps {
    sessionId: number;
    onViolation?: (event: ProctoringEvent) => void;
    captureInterval?: number;
    enabled?: boolean;
}

export function ProctoringMonitor({
                                      sessionId,
                                      onViolation,
                                      captureInterval = 10000,
                                      enabled = true,
                                  }: ProctoringMonitorProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const {
        webcam,
        violations,
        isAnalyzing,
        violationCount,
        highViolationCount,
        setWebcamEnabled,
        setWebcamStreaming,
        setWebcamPermission,
        setWebcamError,
    } = useProctoringStore();

    // Initialize webcam
    useEffect(() => {
        if (!enabled) return;

        const initWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user', width: 640, height: 480 },
                    audio: false,
                });

                streamRef.current = stream;

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }

                setWebcamEnabled(true);
                setWebcamStreaming(true);
                setWebcamPermission(true);
                setWebcamError(null);
            } catch (error) {
                console.error('Webcam error:', error);
                setWebcamEnabled(false);
                setWebcamStreaming(false);
                setWebcamPermission(false);
                setWebcamError(
                    error instanceof Error
                        ? error.message
                        : 'Gagal mengakses kamera'
                );
            }
        };

        initWebcam();

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [enabled, setWebcamEnabled, setWebcamStreaming, setWebcamPermission, setWebcamError]);

    // Get recent violations (last 3)
    const recentViolations = violations.slice(0, 3);

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Proctoring Monitor
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {isAnalyzing && (
                            <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                        )}
                        <Badge variant={webcam.isStreaming ? 'default' : 'destructive'}>
                            {webcam.isStreaming ? (
                                <>
                                    <Camera className="h-3 w-3 mr-1" />
                                    Aktif
                                </>
                            ) : (
                                <>
                                    <CameraOff className="h-3 w-3 mr-1" />
                                    Nonaktif
                                </>
                            )}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Webcam Preview */}
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                    {webcam.isStreaming ? (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <CameraOff className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    {webcam.error || 'Kamera tidak aktif'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Overlay with status */}
                    {webcam.isStreaming && (
                        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                            <Badge variant="secondary" className="text-xs">
                                Session #{sessionId}
                            </Badge>
                            {isAnalyzing && (
                                <Badge variant="outline" className="text-xs bg-background/80">
                                    Analyzing...
                                </Badge>
                            )}
                        </div>
                    )}
                </div>

                {/* Violation Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-muted text-center">
                        <div className="text-2xl font-bold">{violationCount}</div>
                        <div className="text-xs text-muted-foreground">Total Violations</div>
                    </div>
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-center">
                        <div className="text-2xl font-bold text-red-600">{highViolationCount}</div>
                        <div className="text-xs text-muted-foreground">High Severity</div>
                    </div>
                </div>

                {/* Recent Violations */}
                {recentViolations.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">Pelanggaran Terakhir</h4>
                        {recentViolations.map((event) => (
                            <Alert key={event.id} variant="destructive" className="py-2">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle className="text-sm">{event.type}</AlertTitle>
                                <AlertDescription className="text-xs">
                                    {event.message}
                                    {/* ✅ FIX: details is on Violation/UIViolation */}
                                    {event.details && (
                                        <p className="text-xs text-red-700 mt-1">{event.details}</p>
                                    )}
                                </AlertDescription>
                            </Alert>
                        ))}
                    </div>
                )}

                {/* Webcam Error Alert */}
                {webcam.error && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Error Kamera</AlertTitle>
                        <AlertDescription>
                            {webcam.error}
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 w-full"
                                onClick={() => window.location.reload()}
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Muat Ulang
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Success State */}
                {webcam.isStreaming && violationCount === 0 && (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4" />
                        <span>Tidak ada pelanggaran terdeteksi</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default ProctoringMonitor;