/**
 * PriceBadge
 *
 * Simple badge to display exam price.
 * Shows "Gratis" for free exams, price for paid exams.
 */

'use client';

import { Badge } from '@/shared/components/ui/badge';
import { Tag } from 'lucide-react';
import { formatPrice } from '../utils/midtrans.utils';

interface PriceBadgeProps {
    price: number | null;
    showIcon?: boolean;
    className?: string;
}

export function PriceBadge({ price, showIcon = false, className }: PriceBadgeProps) {
    const isFree = !price || price === 0;

    return (
        <Badge variant={isFree ? 'outline' : 'secondary'} className={className}>
            {showIcon && <Tag className="h-3 w-3 mr-1" />}
            {isFree ? 'Gratis' : formatPrice(price)}
        </Badge>
    );
}

export default PriceBadge;
