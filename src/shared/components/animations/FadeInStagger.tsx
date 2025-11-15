"use client";

import { useInView } from "@/shared/hooks/useInView";
import { cn } from "@/shared/lib/utils";
import { Children, ReactNode } from "react";

interface FadeInStaggerProps {
    children: ReactNode;
    staggerDelay?: number;
    baseDelay?: number;
    duration?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    className?: string;
    threshold?: number;
}

export const FadeInStagger = ({
                                  children,
                                  staggerDelay = 100,
                                  baseDelay = 0,
                                  duration = 600,
                                  direction = "up",
                                  className,
                                  threshold = 0.1,
                              }: FadeInStaggerProps) => {
    const { ref, isInView } = useInView<HTMLDivElement>({ threshold, triggerOnce: true });

    const directionClasses = {
        up: "translate-y-8",
        down: "-translate-y-8",
        left: "translate-x-8",
        right: "-translate-x-8",
        none: "",
    };

    return (
        <div ref={ref} className={className}>
            {Children.map(children, (child, index) => (
                <div
                    key={index}
                    className={cn(
                        "transition-all",
                        !isInView && "opacity-0",
                        !isInView && directionClasses[direction],
                        isInView && "opacity-100 translate-x-0 translate-y-0"
                    )}
                    style={{
                        transitionDuration: `${duration}ms`,
                        transitionDelay: `${baseDelay + index * staggerDelay}ms`,
                        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                >
                    {child}
                </div>
            ))}
        </div>
    );
};