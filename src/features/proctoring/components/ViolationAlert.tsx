// src/features/proctoring/components/ViolationAlert.tsx

/**
 * Violation Alert Component
 *
 * ✅ AUDIT FIX v3: Import Violation from proctoring types (now properly exported)
 */

'use client';

import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Badge } from '@/shared/components/ui/badge';
import { AlertTriangle, AlertCircle, XCircle } from 'lucide-react';
import type { Violation, ViolationSeverity } from '../types/proctoring.types';

export interface ViolationAlertProps {
    violation: Violation;
    onDismiss?: () => void;
}

const severityConfig: Record<ViolationSeverity, {
    variant: 'default' | 'destructive';
    icon: typeof AlertTriangle;
    label: string;
}> = {
    LOW: {
        variant: 'default',
        icon: AlertCircle,
        label: 'Peringatan Ringan',
    },
    MEDIUM: {
        variant: 'default',
        icon: AlertTriangle,
        label: 'Peringatan',
    },
    HIGH: {
        variant: 'destructive',
        icon: XCircle,
        label: 'Pelanggaran Serius',
    },
};

export function ViolationAlert({ violation, onDismiss }: ViolationAlertProps) {
    const config = severityConfig[violation.severity];
    const Icon = config.icon;

    return (
        <Alert variant={config.variant} className="relative">
            <Icon className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-2">
                {config.label}
                <Badge variant="outline" className="text-xs">
                    {violation.type}
                </Badge>
            </AlertTitle>
            <AlertDescription>
                {violation.message}
                {violation.details && (
                    <p className="mt-1 text-xs opacity-80">{violation.details}</p>
                )}
            </AlertDescription>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="absolute top-2 right-2 p-1 hover:bg-accent rounded"
                    aria-label="Dismiss"
                >
                    <XCircle className="h-4 w-4" />
                </button>
            )}
        </Alert>
    );
}

export default ViolationAlert;