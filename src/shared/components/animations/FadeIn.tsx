"use client";

import { useInView } from "@/shared/hooks/useInView";
import { cn } from "@/shared/lib/utils";
import { ReactNode } from "react";

interface FadeInProps {
    children: ReactNode;
    direction?: "up" | "down" | "left" | "right" | "none";
    delay?: number;
    duration?: number;
    className?: string;
    threshold?: number;
    triggerOnce?: boolean;
}

export const FadeIn = ({
                           children,
                           direction = "up",
                           delay = 0,
                           duration = 600,
                           className,
                           threshold = 0.1,
                           triggerOnce = true,
                       }: FadeInProps) => {
    const { ref, isInView } = useInView<HTMLDivElement>({ threshold, triggerOnce });

    const directionClasses = {
        up: "translate-y-8",
        down: "-translate-y-8",
        left: "translate-x-8",
        right: "-translate-x-8",
        none: "",
    };

    return (
        <div
            ref={ref}
            className={cn(
                "transition-all",
                !isInView && "opacity-0",
                !isInView && directionClasses[direction],
                isInView && "opacity-100 translate-x-0 translate-y-0",
                className
            )}
            style={{
                transitionDuration: `${duration}ms`,
                transitionDelay: `${delay}ms`,
                transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            }}
        >
            {children}
        </div>
    );
};