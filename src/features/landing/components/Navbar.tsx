"use client";

import { Button } from "@/shared/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg" />
                            <span className="text-xl font-bold text-foreground">Prestige Tryout</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Features
                        </a>
                        <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            How It Works
                        </a>
                        <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Pricing
                        </a>
                        <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Testimonials
                        </a>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                        <Button size="sm" className="bg-primary hover:bg-primary-700">
                            Book Demo
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
                <div className="md:hidden border-t border-border bg-background animate-slide-in-bottom">
                    <div className="px-4 pt-2 pb-4 space-y-3">
                        <a
                            href="#features"
                            className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Features
                        </a>
                        <a
                            href="#how-it-works"
                            className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            How It Works
                        </a>
                        <a
                            href="#pricing"
                            className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Pricing
                        </a>
                        <a
                            href="#testimonials"
                            className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Testimonials
                        </a>
                        <div className="pt-4 space-y-2">
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button className="w-full bg-primary hover:bg-primary-700">
                                Book Demo
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}