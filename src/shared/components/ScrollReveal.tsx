"use client";

import { useRef, useState, useEffect, ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type AnimationDirection = "up" | "down" | "left" | "right" | "fade";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: AnimationDirection;
  delay?: number;
  threshold?: number;
  once?: boolean;
}

const animationClasses: Record<AnimationDirection, { initial: string; animate: string }> = {
  up: {
    initial: "opacity-0 translate-y-6",
    animate: "animate-fade-in-up",
  },
  down: {
    initial: "opacity-0 -translate-y-6",
    animate: "animate-fade-in-down",
  },
  left: {
    initial: "opacity-0 translate-x-6",
    animate: "animate-fade-in-left",
  },
  right: {
    initial: "opacity-0 -translate-x-6",
    animate: "animate-fade-in-right",
  },
  fade: {
    initial: "opacity-0",
    animate: "animate-fade-in",
  },
};

export function ScrollReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  threshold = 0.1,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // DEMO MODE: Animasi selalu berjalan, abaikan preferensi reduced motion
    // Uncomment blok di bawah untuk mengembalikan ke mode aksesibilitas:
    /*
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }
    */

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, once]);

  const { initial, animate } = animationClasses[direction];

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700",
        isVisible ? animate : initial,
        className
      )}
      style={{ animationDelay: isVisible ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  );
}

export default ScrollReveal;
