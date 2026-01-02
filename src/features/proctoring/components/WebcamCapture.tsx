// src/features/proctoring/components/WebcamCapture.tsx

/**
 * Webcam Capture Component
 *
 * ✅ AUDIT FIX v4:
 * - Use setWebcam action from store
 * - Use webcam.isActive field
 *
 * Handles webcam access and periodic frame capture for proctoring
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Camera, CameraOff, AlertTriangle } from 'lucide-react';
import { useProctoringStore } from '../store/proctoring.store';

interface WebcamCaptureProps {
    onFrameCapture?: (imageData: string) => void;
    captureInterval?: number; // milliseconds
    className?: string;
}

export function WebcamCapture({
                                  onFrameCapture,
                                  captureInterval = 3000,
                                  className = ''
                              }: WebcamCaptureProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // ✅ FIX: Use setWebcam from store
    const { webcam, setWebcam } = useProctoringStore();
    const [localError, setLocalError] = useState<string | null>(null);

    // Initialize webcam
    useEffect(() => {
        let stream: MediaStream | null = null;

        const initWebcam = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user', width: 640, height: 480 },
                    audio: false,
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    // ✅ FIX: Use setWebcam with isActive field
                    setWebcam({ isActive: true, stream, error: null });
                    setLocalError(null);
                }
            } catch (error) {
                const errorMsg = error instanceof Error ? error.message : 'Failed to access webcam';
                setWebcam({ isActive: false, stream: null, error: errorMsg });
                setLocalError(errorMsg);
            }
        };

        initWebcam();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            setWebcam({ isActive: false, stream: null, error: null });
        };
    }, [setWebcam]);

    // Capture frame function
    const captureFrame = useCallback(() => {
        // ✅ FIX: Use webcam.isActive
        if (!webcam.isActive || !videoRef.current || !onFrameCapture) return;

        const video = videoRef.current;

        // ✅ SAFEGUARD: Reject capture if video dimensions are 0 (not ready)
        if (video.videoWidth === 0 || video.videoHeight === 0) {
            console.warn('[WebcamCapture] Video not ready (dimensions are 0)');
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(video, 0, 0);
            const imageData = canvas.toDataURL('image/jpeg', 0.8);

            // ✅ SAFEGUARD: Validate frame size before sending
            const base64Data = imageData.split(',')[1] || imageData;
            const frameSizeKB = Math.round(base64Data.length / 1024);

            if (frameSizeKB < 10) {
                console.warn('[WebcamCapture] Frame too small, skipping:', frameSizeKB + 'KB');
                return;
            }

            onFrameCapture(imageData);
        }
    }, [webcam.isActive, onFrameCapture]);

    // Set up periodic capture
    useEffect(() => {
        // ✅ FIX: Use webcam.isActive
        if (!webcam.isActive || !onFrameCapture) return;

        // Initial capture after a short delay
        const initialDelay = setTimeout(() => {
            captureFrame();
        }, 1000);

        // Set up interval
        intervalRef.current = setInterval(captureFrame, captureInterval);

        return () => {
            clearTimeout(initialDelay);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [webcam.isActive, onFrameCapture, captureInterval, captureFrame]);

    return (
        <Card className={className}>
            <CardContent className="p-4">
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                    {/* ✅ FIX: Use webcam.isActive */}
                    {webcam.isActive ? (
                        <>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                width={640}
                                height={480}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2">
                                <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                                    <Camera className="h-3 w-3" />
                                    <span>Live</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <CameraOff className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    Webcam tidak aktif
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Error Alert */}
                {(localError || webcam.error) && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            {localError || webcam.error}
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}

export default WebcamCapture;