// src/features/proctoring/components/WebcamCapture.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { webcamUtils } from '../utils/webcam.utils';
import { useProctoringStore } from '../store/proctoring.store';

interface WebcamCaptureProps {
    onFrameCapture?: (imageBase64: string) => void;
    captureInterval?: number; // milliseconds
    className?: string;
}

export function WebcamCapture({
                                  onFrameCapture,
                                  captureInterval = 3000, // 3 seconds default
                                  className = ''
                              }: WebcamCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const { webcam, setWebcam } = useProctoringStore();
    const [localError, setLocalError] = useState<string | null>(null);

    // Initialize webcam
    useEffect(() => {
        let stream: MediaStream | null = null;

        const initWebcam = async () => {
            try {
                stream = await webcamUtils.requestWebcam();

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setWebcam({ isActive: true, stream, error: null });
                    setLocalError(null);
                }
            } catch (error: any) {
                const errorMsg = error.message || 'Failed to access webcam';
                setWebcam({ isActive: false, stream: null, error: errorMsg });
                setLocalError(errorMsg);
            }
        };

        initWebcam();

        return () => {
            if (stream) {
                webcamUtils.stopWebcam(stream);
                setWebcam({ isActive: false, stream: null });
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [setWebcam]);

    // Start periodic frame capture
    useEffect(() => {
        if (!webcam.isActive || !videoRef.current || !onFrameCapture) return;

        intervalRef.current = setInterval(() => {
            if (videoRef.current && videoRef.current.readyState === 4) {
                try {
                    const frame = webcamUtils.captureFrame(videoRef.current);
                    onFrameCapture(frame);
                    setWebcam({ lastCapture: new Date().toISOString() });
                } catch (error) {
                    console.error('Frame capture error:', error);
                }
            }
        }, captureInterval);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [webcam.isActive, onFrameCapture, captureInterval, setWebcam]);

    if (localError || webcam.error) {
        return (
            <Alert variant="destructive" className={className}>
                <CameraOff className="h-4 w-4" />
                <AlertDescription>
                    {localError || webcam.error}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className={`relative ${className}`}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-auto rounded-lg border border-border bg-black"
            />

            {webcam.isActive && (
                <div className="absolute top-2 right-2 flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/90 text-white text-xs font-medium">
                    <Camera className="h-3 w-3" />
                    <span>Monitoring</span>
                </div>
            )}
        </div>
    );
}