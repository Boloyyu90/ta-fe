import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
    title: string;
    actionLabel?: string;
    actionHref?: string;
}

/**
 * SectionHeader Component
 *
 * Displays a section title with an optional action link on the right side.
 * Used for dashboard sections like "Pilihan Ujian Terbaru", "Hasil Terbaru", etc.
 */
export function SectionHeader({ title, actionLabel, actionHref }: SectionHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{title}</h2>
            {actionLabel && actionHref && (
                <Link
                    href={actionHref}
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                    {actionLabel}
                    <ArrowRight className="h-4 w-4" />
                </Link>
            )}
        </div>
    );
}
