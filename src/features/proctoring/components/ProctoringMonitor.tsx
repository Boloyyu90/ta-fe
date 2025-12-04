// src/features/proctoring/components/ProctoringMonitor.tsx
'use client';

import { useEffect, useState } from 'react';
import { WebcamCapture } from './WebcamCapture';
import { ViolationAlert } from './ViolationAlert';
import { useAnalyzeFace } from '../hooks/useAnalyzeFace';
import { useProctoringStore } from '../store/proctoring.store';
import { Loader2 } from 'lucide-react';

interface ProctoringMonitorProps {
    sessionId: number;
    onExamCancelled?: () => void;
    captureInterval?: number;
    className?: string;
}

export function ProctoringMonitor({
                                      sessionId,
                                      onExamCancelled,
                                      captureInterval = 3000,
                                      className = ''
                                  }: ProctoringMonitorProps) {
    const { violations, warningLevel, startMonitoring, reset } = useProctoringStore();
    const [showAlert, setShowAlert] = useState(false);

    const { mutate: analyzeFace, isPending } = useAnalyzeFace({
        sessionId,
        onViolation: (level) => {
            setShowAlert(true);
            // Auto-hide alert after 5 seconds
            setTimeout(() => setShowAlert(false), 5000);
        },
        onCancel: onExamCancelled,
    });

    // Start monitoring on mount
    useEffect(() => {
        startMonitoring();
        return () => reset();
    }, [startMonitoring, reset]);

    const handleFrameCapture = (imageBase64: string) => {
        if (!isPending) {
            analyzeFace({ imageBase64 });
        }
    };

    return (
        <div className={className}>
            {/* Webcam feed */}
            <div className="relative">
                <WebcamCapture
                    onFrameCapture={handleFrameCapture}
                    captureInterval={captureInterval}
                    className="max-w-xs"
                />

                {isPending && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                    </div>
                )}
            </div>

            {/* Violation alerts */}
            {showAlert && (
                <ViolationAlert
                    violations={violations}
                    warningLevel={warningLevel}
                    onDismiss={() => setShowAlert(false)}
                />
            )}

            {/* Violation counter (subtle) */}
            {warningLevel > 0 && (
                <div className="mt-2 text-xs text-muted-foreground text-center">
                    Warnings: {warningLevel}/3
                </div>
            )}
        </div>
    );
}