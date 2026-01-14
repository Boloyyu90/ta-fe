'use client';

import Image from 'next/image';
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
    /** Optional logo element - defaults to Prestige logo */
    logo?: ReactNode;
}

/**
 * Default logo component with white background and top-right rounded corner
 * Designed to be flush with parent container edges (left, top, bottom)
 */
function DefaultLogo() {
    return (
        <Image
            src="/images/logo/logo-prestige.svg"
            alt="Logo Prestige"
            width={40}
            height={40}
            className="w-15 h-15 object-contain"
            priority
        />
    );
}

/**
 * Timer box component for displaying individual time segments
 */
function TimerBox({ value, label, isCritical }: { value: string; label: string; isCritical: boolean }) {
    return (
        <div className="flex flex-col items-center">
            <div
                className={`
                    bg-primary text-primary-foreground px-3 py-2 rounded-md min-w-[3.5rem] text-center
                    flex flex-col items-center
                    ${isCritical ? 'animate-pulse' : ''}
                `}
            >
                <span className="text-3xl font-bold font-mono">{value}</span>
                <span className="text-xs font-medium text-background">{label}</span>
            </div>
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
                               logo,
                           }: ExamHeaderProps) {
    return (
        <div className="bg-background">
            <div className="max-w-7xl mx-auto pl-0 pr-4 py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Left: Logo + Title Panel */}
                    <div className="flex-1 min-w-0 bg-primary rounded-r-2xl overflow-hidden">
                        <div className="flex items-stretch">
                            {/* Logo container */}
                            <div className="bg-background rounded-tr-full pl-4 pr-5 flex items-center flex-shrink-0">
                                {logo ?? <DefaultLogo />}
                            </div>

                            {/* Title & subtitle */}
                            <div className="min-w-0 flex-1 py-4 pl-4 pr-8">
                                <div>
                                    <h1 className="text-2xl font-bold truncate text-background">
                                        {examTitle}
                                    </h1>
                                    <div className="w-full max-w-md h-0.5 bg-background mt-1 rounded-full" />
                                </div>
                                {subtitle && (
                                    <p className="text-sm text-background/90 truncate mt-2">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                        </div>
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