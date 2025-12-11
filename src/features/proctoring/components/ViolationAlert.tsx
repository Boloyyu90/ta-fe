// src/features/proctoring/components/ViolationAlert.tsx

/**
 * Violation Alert Component
 *
 * ============================================================================
 * AUDIT FIX v5: Fixed type alignments
 * ============================================================================
 *
 * Changes:
 * - Removed violation.details (doesn't exist on Violation type)
 * - Changed ViolationSeverity to Severity (matches enum.types.ts)
 * - Violation has: id, type, severity, timestamp, message
 */

'use client';

import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Badge } from '@/shared/components/ui/badge';
import { AlertTriangle, AlertCircle, XCircle } from 'lucide-react';
import type { Violation, Severity } from '../types/proctoring.types';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface ViolationAlertProps {
    violation: Violation;
    onDismiss?: () => void;
}

// ============================================================================
// SEVERITY CONFIG
// ============================================================================

const severityConfig: Record<Severity, {
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

// ============================================================================
// COMPONENT
// ============================================================================

export function ViolationAlert({ violation, onDismiss }: ViolationAlertProps) {
    const config = severityConfig[violation.severity];
    const Icon = config.icon;

    return (
        <Alert variant={config.variant} className="relative">
            <Icon className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-2">
                {config.label}
                <Badge variant="outline" className="text-xs">
                    {violation.type.replace(/_/g, ' ')}
                </Badge>
            </AlertTitle>
            <AlertDescription>
                {violation.message}
                {/*
                 * ✅ FIX: Removed violation.details
                 * Violation type only has: id, type, severity, timestamp, message
                 * Show timestamp instead for additional context
                 */}
                <span className="block mt-1 text-xs opacity-80">
                    {new Date(violation.timestamp).toLocaleTimeString('id-ID')}
                </span>
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