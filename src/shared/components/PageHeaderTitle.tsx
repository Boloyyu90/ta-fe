import { cn } from "@/shared/lib/utils";

/**
 * PageHeaderTitle Component
 *
 * A reusable page header with decorative layered circles on the left
 * and a centered title. Matches the Figma "Paket Saya" design.
 */

interface PageHeaderTitleProps {
    /** Main title text */
    title: string;
    /** Optional subtitle/description text */
    subtitle?: string;
    /** Additional CSS classes for the wrapper */
    className?: string;
}

/**
 * Flower Icon Component
 * 4-petal flower design matching Figma reference
 */
function FlowerIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* 4 petals arranged in cross pattern */}
            {/* Top petal */}
            <ellipse
                cx="24"
                cy="12"
                rx="8"
                ry="12"
                fill="currentColor"
            />
            {/* Bottom petal */}
            <ellipse
                cx="24"
                cy="36"
                rx="8"
                ry="12"
                fill="currentColor"
            />
            {/* Left petal */}
            <ellipse
                cx="12"
                cy="24"
                rx="12"
                ry="8"
                fill="currentColor"
            />
            {/* Right petal */}
            <ellipse
                cx="36"
                cy="24"
                rx="12"
                ry="8"
                fill="currentColor"
            />
            {/* Center circle */}
            <circle cx="24" cy="24" r="4" fill="currentColor" />
        </svg>
    );
}

export function PageHeaderTitle({ title, subtitle, className }: PageHeaderTitleProps) {
    // Determine if we need extra height for subtitle
    const hasSubtitle = Boolean(subtitle);

    return (
        <div
            className={cn(
                // Base wrapper styles
                "relative overflow-hidden bg-primary rounded-3xl md:rounded-[40px]",
                "flex items-center",
                // Height adjusts based on subtitle presence
                hasSubtitle
                    ? "h-24 sm:h-28 md:h-32"
                    : "h-20 sm:h-24 md:h-28",
                "w-full",
                className
            )}
        >
            {/* Layer 1: Secondary arc (orange) - largest, behind tertiary */}
            <div
                className={cn(
                    "absolute rounded-full bg-secondary",
                    // Positioning: extends from left edge, vertically centered
                    "left-[-100px] sm:left-[-110px] md:left-[-120px]",
                    "top-1/2 -translate-y-1/2",
                    // Size: large circle that gets clipped
                    "w-[200px] h-[200px]",
                    "sm:w-[240px] sm:h-[240px]",
                    "md:w-[280px] md:h-[280px]",
                    // Z-index layering
                    "z-[1]"
                )}
            />

            {/* Layer 2: Tertiary circle (yellow) - smaller, in front */}
            <div
                className={cn(
                    "absolute rounded-full bg-tertiary",
                    // Positioning: more to the left than secondary
                    "left-[-80px] sm:left-[-90px] md:left-[-100px]",
                    "top-1/2 -translate-y-1/2",
                    // Size: smaller than secondary arc
                    "w-[160px] h-[160px]",
                    "sm:w-[190px] sm:h-[190px]",
                    "md:w-[220px] md:h-[220px]",
                    // Z-index layering
                    "z-[2]",
                    // Flex to position flower icon
                    "flex items-center justify-center"
                )}
            >
                {/* Flower icon positioned toward visible area */}
                <FlowerIcon
                    className={cn(
                        "text-white",
                        "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14",
                        // Offset to right and slightly up to be in visible portion
                        "translate-x-[30px] sm:translate-x-[35px] md:translate-x-[40px]",
                        "-translate-y-1"
                    )}
                />
            </div>

            {/* Text content - title and optional subtitle */}
            <div
                className={cn(
                    "relative z-10",
                    // Padding to shift text away from ornament
                    "pl-24 sm:pl-32 md:pl-40 lg:pl-48",
                    "pr-4 sm:pr-6 md:pr-8",
                    // Flex column for title + subtitle
                    "flex flex-col justify-center"
                )}
            >
                <h1
                    className={cn(
                        "text-white font-bold tracking-tight",
                        "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
                        // Reduce bottom margin if subtitle exists
                        hasSubtitle && "mb-1"
                    )}
                >
                    {title}
                </h1>

                {subtitle && (
                    <p
                        className={cn(
                            "text-white/90",
                            "text-sm sm:text-base md:text-lg",
                            "font-normal"
                        )}
                    >
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}

export default PageHeaderTitle;