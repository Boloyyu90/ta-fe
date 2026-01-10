"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

export const useInView = <T extends HTMLElement = HTMLDivElement>(
    options: UseInViewOptions = {}
) => {
    const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;
    const ref = useRef<T>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        let observer: IntersectionObserver | null = null;

        // Double rAF: memastikan browser sudah paint state awal (opacity-0)
        // sebelum kita mulai observe untuk trigger animasi
        const rafId = requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                observer = new IntersectionObserver(
                    ([entry]) => {
                        if (entry.isIntersecting) {
                            setIsInView(true);
                            if (triggerOnce && observer) {
                                observer.unobserve(element);
                            }
                        } else if (!triggerOnce) {
                            setIsInView(false);
                        }
                    },
                    { threshold, rootMargin }
                );

                observer.observe(element);
            });
        });

        return () => {
            cancelAnimationFrame(rafId);
            observer?.disconnect();
        };
    }, [threshold, rootMargin, triggerOnce]);

    return { ref, isInView };
};