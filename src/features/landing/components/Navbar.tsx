"use client";

import Image from "next/image";
import { Button } from "@/shared/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useActiveSection } from "@/shared/hooks/useActiveSection";
import { cn } from "@/shared/lib/utils";

const NAV_LINKS = [
    { href: "#about", label: "Tentang" },
    { href: "#benefits", label: "Keunggulan" },
    { href: "#features", label: "Fitur" },
    { href: "#pricing", label: "Harga" },
    { href: "#testimonials", label: "Testimoni" },
    { href: "#faq", label: "FAQ" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const activeSection = useActiveSection();

    const isActive = (href: string) => {
        const sectionId = href.replace("#", "");
        return activeSection === sectionId;
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="relative w-10 h-10 rounded-lg overflow-hidden">
                                <Image
                                    src="/logo-prestige.svg"
                                    alt="Prestige Tryout logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </span>
                            <span className="text-xl font-bold text-foreground">Prestige Tryout</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium transition-colors relative py-1",
                                    isActive(link.href)
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-primary"
                                )}
                            >
                                {link.label}
                                {isActive(link.href) && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
                                )}
                            </a>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/login">Masuk</Link>
                        </Button>
                        <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
                            <Link href="/register">Daftar</Link>
                        </Button>
                    </div>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-md text-foreground hover:bg-muted transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden border-t border-border bg-background">
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "block px-3 py-2 text-base font-medium rounded-md transition-colors",
                                    isActive(link.href)
                                        ? "text-primary bg-primary/10"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}
                        <div className="pt-4 space-y-2">
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/login">Masuk</Link>
                            </Button>
                            <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                                <Link href="/register">Daftar</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
