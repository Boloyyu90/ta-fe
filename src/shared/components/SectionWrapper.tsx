import { cn } from "@/shared/lib/utils";
import { ReactNode } from "react";

interface SectionWrapperProps {
    children: ReactNode;
    id?: string;
    className?: string;
    containerClassName?: string;
}

export function SectionWrapper({
    children,
    id,
    className,
    containerClassName,
}: SectionWrapperProps) {
    return (
        <section
            id={id}
            className={cn("py-16 md:py-20 lg:py-24 scroll-mt-20", className)}
        >
            <div className={cn("container mx-auto px-4 sm:px-6 lg:px-8", containerClassName)}>
                {children}
            </div>
        </section>
    );
}
