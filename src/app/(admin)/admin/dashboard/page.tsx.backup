"use client";

/**
 * ADMIN DASHBOARD (MOCK)
 *
 * PURPOSE:
 * - Landing page after admin login
 * - Overview of system statistics, active sessions, users
 * - Demonstrates successful admin authentication
 *
 * This is a MOCK implementation with sample data for testing auth
 *
 * ROUTE: /admin/dashboard (after fixing route structure)
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useLogout } from "@/features/auth/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Loader2, Users, BookOpen, Activity, AlertCircle, LogOut, User, ShieldCheck, BarChart3 } from "lucide-react";

export default function AdminDashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuth();
    const { mutate: logout, isPending: isLoggingOut } = useLogout();

    // Redirect unauthenticated users to login
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, isLoading, router]);

    // Redirect non-admin users to participant dashboard
    useEffect(() => {
        if (!isLoading && isAuthenticated && user?.role === "PARTICIPANT") {
            router.push("/dashboard");
        }
    }, [isAuthenticated, isLoading, user, router]);

    // Show loading state
    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    // Don't render if not admin
    if (user.role !== "ADMIN") {
        return null;
    }

    // Mock data for testing
    const mockStats = {
        totalUsers: 142,
        totalExams: 28,
        activeSessions: 7,
        totalQuestions: 856,
    };

    const mockActiveSessions = [
        { id: 1, userName: "John Doe", examTitle: "CPNS TIU - Verbal", startedAt: "10 minutes ago", progress: 45 },
        { id: 2, userName: "Jane Smith", examTitle: "CPNS TWK - Pancasila", startedAt: "23 minutes ago", progress: 78 },
        { id: 3, userName: "Bob Johnson", examTitle: "CPNS TKP - Integritas", startedAt: "35 minutes ago", progress: 62 },
    ];

    const mockRecentResults = [
        { id: 1, userName: "Alice Williams", examTitle: "CPNS TIU Complete", score: 88, submittedAt: "2 hours ago" },
        { id: 2, userName: "Charlie Brown", examTitle: "CPNS TWK Complete", score: 76, submittedAt: "3 hours ago" },
        { id: 3, userName: "Diana Prince", examTitle: "CPNS TKP Complete", score: 92, submittedAt: "5 hours ago" },
    ];

    const mockSystemAlerts = [
        { id: 1, type: "warning", message: "3 users reported proctoring issues", time: "1 hour ago" },
        { id: 2, type: "info", message: "New exam 'CPNS Complete Mock Test' published", time: "2 hours ago" },
    ];

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg" />
                        <span className="font-bold text-xl">Prestige Tryout</span>
                        <span className="px-2 py-1 rounded-md bg-destructive/10 text-destructive text-xs font-medium ml-2">
                            ADMIN PANEL
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{user.name}</span>
                            <span className="px-2 py-1 rounded-md bg-destructive/10 text-destructive text-xs font-medium">
                                Admin
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
                        Admin Dashboard 🛡️
                    </h1>
                    <p className="text-muted-foreground">
                        Monitor and manage your exam platform
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockStats.totalUsers}</div>
                            <p className="text-xs text-muted-foreground">+12 from last week</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockStats.totalExams}</div>
                            <p className="text-xs text-muted-foreground">3 drafts pending</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockStats.activeSessions}</div>
                            <p className="text-xs text-muted-foreground">In progress now</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Question Bank</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockStats.totalQuestions}</div>
                            <p className="text-xs text-muted-foreground">Ready to use</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-8 md:grid-cols-2 mb-8">
                    {/* Active Sessions Monitor */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Exam Sessions</CardTitle>
                            <CardDescription>Monitor ongoing exams in real-time</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockActiveSessions.map((session) => (
                                    <div key={session.id} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium">{session.userName}</p>
                                                <span className="px-2 py-1 rounded-md bg-green-500/10 text-green-700 text-xs font-medium">
                                                    Live
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">{session.examTitle}</p>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-muted rounded-full h-2">
                                                    <div
                                                        className="bg-primary h-2 rounded-full transition-all"
                                                        style={{ width: `${session.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-medium">{session.progress}%</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Started {session.startedAt}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full mt-4">
                                View All Sessions
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Recent Results */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Exam Results</CardTitle>
                            <CardDescription>Latest completed exams</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockRecentResults.map((result) => (
                                    <div key={result.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">{result.userName}</p>
                                            <p className="text-xs text-muted-foreground">{result.examTitle}</p>
                                            <p className="text-xs text-muted-foreground">{result.submittedAt}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-bold ${result.score >= 80 ? 'text-green-600' : result.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                {result.score}%
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
                </div>

                {/* System Alerts */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>System Alerts</CardTitle>
                        <CardDescription>Recent notifications and updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {mockSystemAlerts.map((alert) => (
                                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                                    <AlertCircle className={`h-5 w-5 flex-shrink-0 ${alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'}`} />
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm">{alert.message}</p>
                                        <p className="text-xs text-muted-foreground">{alert.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Auth Test Info */}
                <Card className="border-primary/50 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-green-600" />
                            Admin Authentication Successful!
                        </CardTitle>
                        <CardDescription>You are logged in with admin privileges</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <p><strong>User ID:</strong> {user.id}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Role:</strong> <span className="text-destructive font-bold">{user.role}</span></p>
                            <p><strong>Email Verified:</strong> {user.isEmailVerified ? '✅ Yes' : '❌ No'}</p>
                            <p className="text-xs text-muted-foreground pt-2">
                                This is a mock admin dashboard with sample data. Replace with real API calls to manage users, exams, and monitor sessions.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-3 mt-8">
                    <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <CardHeader>
                            <CardTitle className="text-base">Manage Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Create, edit, and manage user accounts</p>
                            <Button variant="outline" size="sm" className="w-full mt-4">
                                Go to Users →
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <CardHeader>
                            <CardTitle className="text-base">Question Bank</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Add and organize exam questions</p>
                            <Button variant="outline" size="sm" className="w-full mt-4">
                                Go to Questions →
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <CardHeader>
                            <CardTitle className="text-base">Create Exam</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Build new exam from question bank</p>
                            <Button variant="outline" size="sm" className="w-full mt-4">
                                Create Exam →
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}