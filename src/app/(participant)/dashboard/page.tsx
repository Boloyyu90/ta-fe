"use client";

/**
 * PARTICIPANT DASHBOARD (MOCK)
 *
 * PURPOSE:
 * - Landing page after participant login
 * - Shows overview of available exams, recent sessions, results
 * - Demonstrates successful authentication
 *
 * This is a MOCK implementation with sample data for testing auth
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useLogout } from "@/features/auth/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Loader2, BookOpen, Clock, Trophy, LogOut, User, CheckCircle2 } from "lucide-react";

export default function ParticipantDashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuth();
    const { mutate: logout, isPending: isLoggingOut } = useLogout();

    // Redirect unauthenticated users to login
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, isLoading, router]);

    // Redirect admin users to admin dashboard
    useEffect(() => {
        if (!isLoading && isAuthenticated && user?.role === "ADMIN") {
            router.push("/admin/dashboard");
        }
    }, [isAuthenticated, isLoading, user, router]);

    // Show loading state
    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    // Don't render if not participant
    if (user.role !== "PARTICIPANT") {
        return null;
    }

    // Mock data for testing
    const mockStats = {
        availableExams: 5,
        completedExams: 3,
        averageScore: 78,
        totalTimeSpent: "4h 30m",
    };

    const mockRecentExams = [
        { id: 1, title: "CPNS TIU - Verbal Reasoning", date: "2024-11-10", score: 85, status: "completed" },
        { id: 2, title: "CPNS TWK - Nasionalisme", date: "2024-11-08", score: 72, status: "completed" },
        { id: 3, title: "CPNS TKP - Integritas", date: "2024-11-05", score: 78, status: "completed" },
    ];

    const mockAvailableExams = [
        { id: 4, title: "CPNS TIU - Numerical Reasoning", questions: 30, duration: 60 },
        { id: 5, title: "CPNS TWK - Pancasila", questions: 25, duration: 45 },
    ];

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg" />
                        <span className="font-bold text-xl">Prestige Tryout</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{user.name}</span>
                            <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                                Participant
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => logout()}
                            disabled={isLoggingOut}
                        >
                            {isLoggingOut ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <LogOut className="h-4 w-4" />
                            )}
                            <span className="ml-2">Logout</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Welcome back, {user.name}! 👋
                    </h1>
                    <p className="text-muted-foreground">
                        Ready to continue your exam preparation journey?
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Available Exams</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockStats.availableExams}</div>
                            <p className="text-xs text-muted-foreground">Ready to start</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockStats.completedExams}</div>
                            <p className="text-xs text-muted-foreground">Exams finished</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockStats.averageScore}%</div>
                            <p className="text-xs text-muted-foreground">Keep improving!</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockStats.totalTimeSpent}</div>
                            <p className="text-xs text-muted-foreground">Practice time</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* Recent Results */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Exam Results</CardTitle>
                            <CardDescription>Your latest completed exams</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockRecentExams.map((exam) => (
                                    <div key={exam.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{exam.title}</p>
                                            <p className="text-xs text-muted-foreground">{exam.date}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-bold ${exam.score >= 80 ? 'text-green-600' : exam.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                {exam.score}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full mt-4">
                                View All Results
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Available Exams */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Available Exams</CardTitle>
                            <CardDescription>Start a new exam simulation</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockAvailableExams.map((exam) => (
                                    <div key={exam.id} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium leading-none">{exam.title}</p>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span>{exam.questions} questions</span>
                                                <span>•</span>
                                                <span>{exam.duration} minutes</span>
                                            </div>
                                            <Button size="sm" className="w-full mt-2">
                                                Start Exam
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full mt-4">
                                Browse All Exams
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Auth Test Info */}
                <Card className="mt-8 border-primary/50 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            Authentication Successful!
                        </CardTitle>
                        <CardDescription>Your auth module is working correctly</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <p><strong>User ID:</strong> {user.id}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Role:</strong> {user.role}</p>
                            <p><strong>Email Verified:</strong> {user.isEmailVerified ? '✅ Yes' : '❌ No'}</p>
                            <p className="text-xs text-muted-foreground pt-2">
                                This is a mock dashboard with sample data. Replace with real API calls to display actual exam data.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}