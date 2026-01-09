"use client";

import { useState, useEffect } from "react";

const SECTION_IDS = ["home", "about", "benefits", "features", "pricing", "testimonials", "faq"];

export function useActiveSection() {
    const [activeSection, setActiveSection] = useState<string>("home");

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        const handleIntersect = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        SECTION_IDS.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                const observer = new IntersectionObserver(handleIntersect, {
                    rootMargin: "-50% 0px -50% 0px",
                    threshold: 0,
                });
                observer.observe(element);
                observers.push(observer);
            }
        });

        return () => {
            observers.forEach((observer) => observer.disconnect());
        };
    }, []);

    return activeSection;
}
