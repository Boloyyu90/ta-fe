"use client";

import Image from "next/image";
import { Button } from "@/shared/components/ui/button";
import { Menu, X, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
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

interface NavbarProps {
    variant?: 'landing' | 'auth';
}

export function Navbar({ variant = 'landing' }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const activeSection = useActiveSection();

    // Track scroll position - only for landing variant
    useEffect(() => {
        if (variant === 'auth') return; // Skip scroll tracking on auth pages

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [variant]);

    const isActive = (href: string) => {
        const sectionId = href.replace("#", "");
        return activeSection === sectionId;
    };

    // Auth variant always shows scrolled style (solid background)
    const showScrolledStyle = variant === 'auth' ? true : isScrolled;

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                showScrolledStyle
                    ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm"
                    : "bg-transparent border-b border-transparent"
            )}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo - same for all variants */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="relative w-10 h-10 rounded-lg overflow-hidden">
                                <Image
                                    src="/images/logo/logo-prestige.svg"
                                    alt="Prestige Tryout logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </span>
                            <span className="text-xl font-bold text-foreground">Prestige Tryout</span>
                        </Link>
                    </div>

                    {/* Nav Links - only for landing variant */}
                    {variant === 'landing' && (
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
                    )}

                    {/* Action Buttons - different per variant */}
                    <div className="hidden md:flex items-center space-x-4">
                        {variant === 'auth' ? (
                            // Auth variant: Back to home button
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Beranda
                                </Link>
                            </Button>
                        ) : (
                            // Landing variant: Login/Register buttons
                            <>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/login">Masuk</Link>
                                </Button>
                                <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
                                    <Link href="/register">Daftar</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button - only for landing variant */}
                    {variant === 'landing' && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </Button>
                    )}

                    {/* Mobile: Back button for auth variant */}
                    {variant === 'auth' && (
                        <Button variant="ghost" size="sm" asChild className="md:hidden">
                            <Link href="/">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Beranda
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Mobile menu - only for landing variant */}
            {variant === 'landing' && isOpen && (
                <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-lg">
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
