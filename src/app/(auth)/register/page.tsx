"use client";

/**
 * REGISTRATION PAGE - FIXED
 *
 * ✅ FIXED:
 * - Redirects authenticated users to appropriate dashboard
 * - Shows loading state while checking authentication
 * - Prevents flash of register form for authenticated users
 *
 * PURPOSE:
 * - Public page for new user registration
 * - Displays RegisterForm component
 * - Redirects authenticated users to dashboard
 *
 * BACKEND INTEGRATION:
 * - Maps to: POST /api/v1/auth/register
 * - Creates account with PARTICIPANT role by default
 * - Returns tokens immediately (auto-login)
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { useAuth } from "@/features/auth/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Shield, BookOpen, Trophy, Loader2 } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();

    // Redirect authenticated users to their dashboard
    useEffect(() => {
        if (!isLoading && isAuthenticated && user) {
            const redirectPath = user.role === 'ADMIN'
                ? '/admin/dashboard'
                : '/dashboard';
            router.push(redirectPath);
        }
    }, [isAuthenticated, isLoading, user, router]);

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="text-sm text-muted-foreground mt-2">Memeriksa status login...</p>
                </div>
            </div>
        );
    }

    // Don't render register form if already authenticated (will redirect)
    if (isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
            <div className="w-full max-w-4xl">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Left Column: Benefits */}
                    <div className="hidden md:block space-y-6">
                        <div className="space-y-2">
                            <Link href="/" className="inline-flex items-center space-x-2 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg" />
                                <span className="text-2xl font-bold text-foreground">Prestige Tryout</span>
                            </Link>
                            <h1 className="text-3xl font-bold text-foreground">
                                Start Your Exam Preparation Journey
                            </h1>
                            <p className="text-muted-foreground">
                                Join thousands of students preparing for success with our AI-powered exam simulation platform.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <BookOpen className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-1">Realistic Exam Simulations</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Practice with real exam conditions, time limits, and question formats.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-1">AI-Powered Proctoring</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Experience authentic exam conditions with our advanced proctoring technology.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Trophy className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-1">Track Your Progress</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Get detailed analytics and insights to improve your performance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Register Form */}
                    <div className="w-full">
                        {/* Mobile Logo */}
                        <div className="text-center mb-8 md:hidden">
                            <Link href="/" className="inline-flex items-center justify-center space-x-2 mb-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg" />
                                <span className="text-2xl font-bold text-foreground">Prestige Tryout</span>
                            </Link>
                            <p className="text-sm text-muted-foreground">
                                Create your account to get started
                            </p>
                        </div>

                        <Card className="border-border shadow-lg">
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-2xl font-bold text-center">
                                    Create an account
                                </CardTitle>
                                <CardDescription className="text-center">
                                    Enter your information to register
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RegisterForm />
                            </CardContent>
                        </Card>

                        {/* Footer Links */}
                        <div className="mt-6 text-center space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="font-medium text-primary hover:underline"
                                >
                                    Sign in
                                </Link>
                            </p>
                            <p className="text-xs text-muted-foreground">
                                By signing up, you agree to our{" "}
                                <a href="#" className="underline hover:text-foreground">
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a href="#" className="underline hover:text-foreground">
                                    Privacy Policy
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}