// src/features/proctoring/components/ViolationAlert.tsx
'use client';

import { AlertTriangle, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import type { Violation } from '../types/proctoring.types';

interface ViolationAlertProps {
    violations: Violation[];
    warningLevel: number;
    onDismiss?: () => void;
}

export function ViolationAlert({ violations, warningLevel, onDismiss }: ViolationAlertProps) {
    if (violations.length === 0) return null;

    const highViolations = violations.filter((v) => v.severity === 'HIGH');
    const showAlert = highViolations.length > 0;

    if (!showAlert) return null;

    return (
        <Alert
            variant="destructive"
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-md z-50 animate-slide-in-bottom shadow-lg"
        >
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="flex items-center justify-between">
                <span>⚠️ Warning {warningLevel}/3</span>
                {onDismiss && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={onDismiss}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </AlertTitle>
            <AlertDescription className="space-y-2">
                {highViolations.map((violation, index) => (
                    <div key={index} className="text-sm">
                        • {violation.message}
                    </div>
                ))}
                {warningLevel >= 3 ? (
                    <div className="mt-2 text-sm font-semibold">
                        ❌ Your exam will be cancelled!
                    </div>
                ) : (
                    <div className="mt-2 text-sm">
                        Warning {warningLevel} of 3 - Keep your face visible and forward.
                    </div>
                )}
            </AlertDescription>
        </Alert>
    );
}