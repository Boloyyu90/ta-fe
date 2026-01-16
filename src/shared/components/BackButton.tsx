'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
    /** Target URL. If not provided, uses router.back() */
    href?: string;
    /** Button label. Defaults to "Kembali" */
    label?: string;
}

/**
 * Standardized back button for nested pages.
 *
 * Provides consistent styling across the app.
 * Use this on pages that don't have the main navbar navigation.
 *
 * @example
 * // With explicit href
 * <BackButton href="/exams" label="Kembali ke Daftar Ujian" />
 *
 * @example
 * // With browser back (no href)
 * <BackButton label="Kembali" />
 */
export function BackButton({ href, label = 'Kembali' }: BackButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        if (!href) {
            router.back();
        }
    };

    const buttonContent = (
        <>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {label}
        </>
    );

    if (href) {
        return (
            <Button variant="ghost" size="sm" asChild>
                <Link href={href}>
                    {buttonContent}
                </Link>
            </Button>
        );
    }

    return (
        <Button variant="ghost" size="sm" onClick={handleClick}>
            {buttonContent}
        </Button>
    );
}

export default BackButton;
