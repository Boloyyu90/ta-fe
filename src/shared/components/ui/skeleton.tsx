// src/shared/components/ui/skeleton.tsx

/**
 * SKELETON COMPONENT
 *
 * Used for loading placeholders while data is being fetched
 * Provides a shimmer effect for better UX
 */

import { cn } from "../../lib/utils"

function Skeleton({
                      className,
                      ...props
                  }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-muted", className)}
            {...props}
        />
    )
}

export { Skeleton }