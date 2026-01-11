"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/shared/lib/utils";

// Dynamic import lottie-react to avoid SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface AuthLottieProps {
    url: string;
    className?: string;
    lottieClassName?: string;
}

export function AuthLottie({ url, className,  lottieClassName }: AuthLottieProps) {
    const [animationData, setAnimationData] = useState<object | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch Lottie JSON on mount
    useEffect(() => {
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
    }, [url]);

    // Show fallback during loading or error (for debugging)
    if (isLoading || error || !animationData) {
        return (
            <div
                className={cn(
                    "hidden lg:flex items-center justify-center w-full min-h-[300px]",
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
                "hidden lg:flex items-center justify-center w-full",
                className
            )}
        >
            <Lottie
                animationData={animationData}
                loop={true}
                autoplay={true}
                className={cn("w-full h-full", lottieClassName)}
            />
        </div>
    );
}