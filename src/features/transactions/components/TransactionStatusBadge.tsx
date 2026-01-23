/**
 * TransactionStatusBadge
 *
 * Pattern: Same as status badges in UserExamCard.tsx and ResultCard.tsx
 */

'use client';

import { Badge } from '@/shared/components/ui/badge';
import { Clock, CheckCircle, XCircle, AlertTriangle, RotateCcw } from 'lucide-react';
import { transactionStatusConfig, type TransactionStatus } from '../types/transactions.types';

const iconMap = {
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    RotateCcw,
};

interface TransactionStatusBadgeProps {
    status: TransactionStatus;
    showIcon?: boolean;
}

export function TransactionStatusBadge({ status, showIcon = true }: TransactionStatusBadgeProps) {
    const config = transactionStatusConfig[status];
    const IconComponent = iconMap[config.icon as keyof typeof iconMap];

    return (
        <Badge variant={config.variant}>
            {showIcon && IconComponent && <IconComponent className="h-3 w-3 mr-1" />}
            {config.label}
        </Badge>
    );
}

export default TransactionStatusBadge;
