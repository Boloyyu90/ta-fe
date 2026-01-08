'use client';

import type { ReactNode } from 'react';
import type { TimeSegments } from '../utils/timer.utils';

interface ExamHeaderProps {
    examTitle: string;
    subtitle?: string;
    timeSegments: TimeSegments;
    isCritical: boolean;
    isExpired: boolean;
    /** Slot for webcam preview or device status indicator */
    webcamSlot?: ReactNode;
}

/**
 * Timer box component for displaying individual time segments
 */
function TimerBox({ value, label, isCritical }: { value: string; label: string; isCritical: boolean }) {
    return (
        <div className="flex flex-col items-center">
            <div
                className={`
                    bg-primary text-background px-3 py-2 rounded-md min-w-[3.5rem] text-center
                    ${isCritical ? 'animate-pulse' : ''}
                `}
            >
                <span className="text-2xl font-bold font-mono">{value}</span>
            </div>
            <span className="text-xs font-semibold mt-1 text-primary">{label}</span>
        </div>
    );
}

export function ExamHeader({
    examTitle,
    subtitle,
    timeSegments,
    isCritical,
    isExpired,
    webcamSlot,
}: ExamHeaderProps) {
    return (
        <div className="bg-background text-background">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Left: Title & subtitle */}
                    <div className="flex-1 min-w-0 bg-primary p-5">
                        <h1 className="text-xl font-bold truncate">{examTitle}</h1>
                        {subtitle && (
                            <p className="text-sm text-background truncate">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Center-Right: Timer boxes */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <TimerBox
                            value={timeSegments.hours}
                            label="Jam"
                            isCritical={isCritical && !isExpired}
                        />
                        <TimerBox
                            value={timeSegments.minutes}
                            label="Menit"
                            isCritical={isCritical && !isExpired}
                        />
                        <TimerBox
                            value={timeSegments.seconds}
                            label="Detik"
                            isCritical={isCritical && !isExpired}
                        />
                    </div>

                    {/* Right: Webcam/status indicator slot */}
                    {webcamSlot && (
                        <div className="flex-shrink-0 hidden md:block w-[200px]">
                            {webcamSlot}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
