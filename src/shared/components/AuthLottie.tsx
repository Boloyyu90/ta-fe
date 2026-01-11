"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/shared/lib/utils";

// Dynamic import lottie-react to avoid SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface AuthLottieProps {
    url: string;
    className?: string;
}

export function AuthLottie({ url, className }: AuthLottieProps) {
    const [animationData, setAnimationData] = useState<object | null>(null);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check prefers-reduced-motion
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setPrefersReducedMotion(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    // Fetch Lottie JSON
    useEffect(() => {
        if (prefersReducedMotion) {
            setIsLoading(false);
            return;
        }

        const fetchLottie = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    const errMsg = `Lottie fetch failed: ${response.status} ${response.statusText} for ${url}`;
                    console.warn(errMsg);
                    setError(errMsg);
                    setIsLoading(false);
                    return;
                }
                const data = await response.json();
                setAnimationData(data);
            } catch (err) {
                const errMsg = `Lottie parse/network error: ${err instanceof Error ? err.message : String(err)}`;
                console.error(errMsg);
                setError(errMsg);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLottie();
    }, [url, prefersReducedMotion]);

    // Don't render if prefers-reduced-motion
    if (prefersReducedMotion) {
        return null;
    }

    // Show fallback during loading or error (for debugging)
    if (isLoading || error || !animationData) {
        return (
            <div
                className={cn(
                    "hidden lg:flex items-center justify-center w-full max-w-md min-h-[300px]",
                    className
                )}
            >
                {isLoading && (
                    <div className="text-muted-foreground text-sm">Loading animation...</div>
                )}
                {error && (
                    <div className="text-destructive text-xs text-center p-4 border border-destructive/30 rounded bg-destructive/5">
                        <p className="font-medium">Lottie failed to load</p>
                        <p className="mt-1 opacity-70">{error}</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            className={cn(
                "hidden lg:flex items-center justify-center w-full max-w-md",
                className
            )}
        >
            <Lottie
                animationData={animationData}
                loop={true}
                autoplay={true}
                className="w-full h-auto max-h-[400px]"
            />
        </div>
    );
}
