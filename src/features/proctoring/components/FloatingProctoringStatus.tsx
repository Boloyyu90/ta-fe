// src/features/proctoring/components/FloatingProctoringStatus.tsx

/**
 * Floating Proctoring Status Indicator
 *
 * A fixed-position component that shows AI monitoring status prominently
 * at the top-right corner of the exam interface. Designed to be highly
 * visible for thesis defense demonstration.
 *
 * Features:
 * - Animated pulse indicating live monitoring
 * - Small webcam thumbnail preview
 * - Violation count badge
 * - Expandable webcam modal
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/shared/components/ui/dialog';
import {
    Camera,
    CameraOff,
    Maximize2,
    Wifi,
    WifiOff,
    Eye,
} from 'lucide-react';
import { useProctoringStore } from '../store/proctoring.store';
import { cn } from '@/shared/lib/utils';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface FloatingProctoringStatusProps {
    /** Reference to the video element for thumbnail display */
    videoRef: React.RefObject<HTMLVideoElement | null>;
    /** Session ID for display */
    sessionId: number;
    /** Whether to show the component */
    visible?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function FloatingProctoringStatus({
    videoRef,
    sessionId,
    visible = true,
}: FloatingProctoringStatusProps) {
    const [showWebcamModal, setShowWebcamModal] = useState(false);
    const thumbnailRef = useRef<HTMLVideoElement>(null);

    // Get proctoring state
    const { webcam, violationCount, isAnalyzing } = useProctoringStore();

    // Check online status
    const [isOnline, setIsOnline] = useState(
        typeof navigator !== 'undefined' ? navigator.onLine : true
    );

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Sync video stream to thumbnail
    useEffect(() => {
        if (thumbnailRef.current && videoRef.current && videoRef.current.srcObject) {
            thumbnailRef.current.srcObject = videoRef.current.srcObject;
        }
    }, [videoRef, webcam.isStreaming]);

    if (!visible) return null;

    const isActive = webcam.isStreaming && isOnline;

    return (
        <div className="fixed top-20 right-4 z-50">
            <Card className={cn(
                "bg-background/95 backdrop-blur shadow-lg transition-all duration-300",
                isActive
                    ? "border-primary/50"
                    : "border-destructive/50"
            )}>
                <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                        {/* Animated Monitoring Pulse */}
                        <div className="flex flex-col items-center gap-1">
                            <div className="relative">
                                <div className={cn(
                                    "h-3 w-3 rounded-full",
                                    isActive ? "bg-red-500 animate-pulse" : "bg-gray-400"
                                )} />
                                {isActive && (
                                    <div className="absolute inset-0 h-3 w-3 bg-red-500 rounded-full animate-ping opacity-75" />
                                )}
                            </div>
                        </div>

                        {/* Status Text */}
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <Eye className="h-3.5 w-3.5 text-primary" />
                                <span className="text-xs font-semibold">
                                    {isActive ? 'AI Monitoring' : 'Monitoring Paused'}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                {isOnline ? (
                                    <>
                                        <Wifi className="h-3 w-3 text-green-500" />
                                        <span>{isAnalyzing ? 'Analyzing...' : 'Active'}</span>
                                    </>
                                ) : (
                                    <>
                                        <WifiOff className="h-3 w-3 text-red-500" />
                                        <span>Offline</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Webcam Thumbnail with Expand */}
                        <Dialog open={showWebcamModal} onOpenChange={setShowWebcamModal}>
                            <DialogTrigger asChild>
                                <div className="relative cursor-pointer group">
                                    <div className={cn(
                                        "h-14 w-20 rounded-lg overflow-hidden bg-black",
                                        "border-2 transition-all",
                                        isActive
                                            ? "border-primary hover:border-primary/80"
                                            : "border-destructive"
                                    )}>
                                        {webcam.isStreaming ? (
                                            <video
                                                ref={thumbnailRef}
                                                autoPlay
                                                muted
                                                playsInline
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center">
                                                <CameraOff className="h-5 w-5 text-gray-500" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Expand Button Overlay */}
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="absolute bottom-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Maximize2 className="h-3 w-3" />
                                    </Button>

                                    {/* Violation Count Badge */}
                                    {violationCount > 0 && (
                                        <Badge
                                            variant="destructive"
                                            className="absolute -top-2 -right-2 h-5 min-w-5 p-0 flex items-center justify-center text-xs animate-pulse"
                                        >
                                            {violationCount > 99 ? '99+' : violationCount}
                                        </Badge>
                                    )}

                                    {/* Live Indicator */}
                                    {isActive && (
                                        <div className="absolute top-1 left-1">
                                            <Badge
                                                className="status-live text-[10px] px-1 py-0 h-4 flex items-center gap-0.5"
                                            >
                                                <div className="h-1.5 w-1.5 bg-white rounded-full animate-blink" />
                                                LIVE
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            </DialogTrigger>

                            {/* Expanded Webcam Modal */}
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                        <Camera className="h-5 w-5" />
                                        Webcam Preview - AI Monitoring
                                    </DialogTitle>
                                </DialogHeader>

                                <div className="space-y-4">
                                    <div className={cn(
                                        "aspect-video rounded-lg overflow-hidden bg-black",
                                        "border-2",
                                        isActive ? "border-primary" : "border-destructive"
                                    )}>
                                        {webcam.isStreaming && videoRef.current ? (
                                            <video
                                                ref={(el) => {
                                                    if (el && videoRef.current?.srcObject) {
                                                        el.srcObject = videoRef.current.srcObject;
                                                    }
                                                }}
                                                autoPlay
                                                muted
                                                playsInline
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="text-center">
                                                    <CameraOff className="h-12 w-12 mx-auto mb-2 text-gray-500" />
                                                    <p className="text-sm text-gray-400">
                                                        {webcam.error || 'Camera not active'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Status Info */}
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            {isActive ? (
                                                <>
                                                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                                                    <span className="text-green-600">
                                                        Camera active - Face detection running
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="h-2 w-2 bg-red-500 rounded-full" />
                                                    <span className="text-red-600">
                                                        {webcam.error || 'Camera inactive'}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        <Badge variant="outline">Session #{sessionId}</Badge>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 rounded-lg bg-muted text-center">
                                            <div className="text-2xl font-bold">{violationCount}</div>
                                            <div className="text-xs text-muted-foreground">Total Violations</div>
                                        </div>
                                        <div className={cn(
                                            "p-3 rounded-lg text-center",
                                            isActive
                                                ? "bg-green-50 dark:bg-green-900/20"
                                                : "bg-red-50 dark:bg-red-900/20"
                                        )}>
                                            <div className={cn(
                                                "text-2xl font-bold",
                                                isActive ? "text-green-600" : "text-red-600"
                                            )}>
                                                {isActive ? 'AKTIF' : 'PAUSED'}
                                            </div>
                                            <div className="text-xs text-muted-foreground">Status Monitoring</div>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default FloatingProctoringStatus;
