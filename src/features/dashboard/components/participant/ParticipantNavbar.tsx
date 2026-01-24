"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth, useLogout } from "@/features/auth/hooks";
import { Button } from "@/shared/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/shared/components/ui/sheet";
import { cn } from "@/shared/lib/utils";
import {
    Home,
    Package,
    PackageCheck,
    ShoppingCart,
    Menu,
    LogOut,
    User,
    Loader2,
    ChevronDown,
    Receipt,
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

interface NavItem {
    href: string;
    label: string;
    icon: typeof Home;
    badge?: "soon" | "new";
}

// ============================================================================
// NAVIGATION CONFIG
// ============================================================================

/**
 * Main navigation items
 *
 * Route mapping:
 * - /dashboard     → Beranda (home)
 * - /exams         → Pilihan Paket (browse all packages)
 * - /my-packages   → Paket Saya (purchased packages)
 * - /cart          → Keranjang (placeholder - coming soon)
 */
const NAV_ITEMS: NavItem[] = [
    {
        href: "/dashboard",
        label: "Beranda",
        icon: Home,
    },
    {
        href: "/exams",
        label: "Pilihan Paket",
        icon: Package,
    },
    {
        href: "/my-packages",
        label: "Paket Saya",
        icon: PackageCheck,
    },
    {
        href: "/cart",
        label: "Keranjang",
        icon: ShoppingCart,
        badge: "soon",
    },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get user initials from name or email
 */
function getInitials(name?: string, email?: string): string {
    if (name) {
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }
    if (email) {
        return email.substring(0, 2).toUpperCase();
    }
    return "??";
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Avatar component with initials fallback
 */
function UserAvatar({ name, email }: { name?: string; email?: string }) {
    const initials = getInitials(name, email);

    return (
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
            {initials}
        </div>
    );
}

/**
 * Badge component for nav items (Soon, New, etc.)
 */
function NavBadge({ badge }: { badge?: "soon" | "new" }) {
    if (!badge) return null;

    const styles = {
        soon: "bg-muted text-muted-foreground",
        new: "bg-primary text-primary-foreground",
    };

    const labels = {
        soon: "Soon",
        new: "New",
    };

    return (
        <span className={cn(
            "text-[10px] px-1.5 py-0.5 rounded-full font-medium ml-1",
            styles[badge]
        )}>
            {labels[badge]}
        </span>
    );
}

/**
 * Desktop navigation link with active state
 */
function NavLink({
    href,
    label,
    icon: Icon,
    isActive,
    badge,
}: {
    href: string;
    label: string;
    icon: typeof Home;
    isActive: boolean;
    badge?: "soon" | "new";
}) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors",
                isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
            )}
        >
            <Icon className="h-4 w-4" />
            {label}
            <NavBadge badge={badge} />
        </Link>
    );
}

/**
 * Mobile navigation link
 */
function MobileNavLink({
    href,
    label,
    icon: Icon,
    isActive,
    onClick,
    badge,
}: {
    href: string;
    label: string;
    icon: typeof Home;
    isActive: boolean;
    onClick?: () => void;
    badge?: "soon" | "new";
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition-colors",
                isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
        >
            <Icon className="h-5 w-5" />
            <span className="flex-1">{label}</span>
            <NavBadge badge={badge} />
        </Link>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * ParticipantNavbar Component
 *
 * Navigation bar for participant area with:
 * - Logo: Prestige Academy
 * - Main nav: Beranda, Pilihan Paket, Paket Saya, Keranjang
 * - User dropdown: Profil Saya, Riwayat Transaksi, Keluar
 * - Mobile responsive hamburger menu
 */
export function ParticipantNavbar() {
    const pathname = usePathname();
    const { user } = useAuth();
    const { mutate: logout, isPending: isLoggingOut } = useLogout();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    /**
     * Check if route is active
     * Special case for /dashboard to avoid matching all routes
     */
    const isActive = (href: string) => {
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }
        return pathname === href || pathname.startsWith(href + "/");
    };

    const handleLogout = () => {
        logout();
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                {/* ========== Logo Section ========== */}
                <div className="flex items-center gap-2">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <span className="relative w-10 h-10 rounded-lg overflow-hidden">
                            <Image
                                src="/images/logo/logo-prestige.svg"
                                alt="Prestige Academy logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </span>
                        <span className="font-bold text-xl hidden sm:inline">
                            <span className="text-primary">Prestige</span>{" "}
                            <span className="text-secondary">Academy</span>
                        </span>
                    </Link>
                </div>

                {/* ========== Desktop Navigation ========== */}
                <nav className="hidden md:flex items-center gap-6">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.href}
                            href={item.href}
                            label={item.label}
                            icon={item.icon}
                            isActive={isActive(item.href)}
                            badge={item.badge}
                        />
                    ))}
                </nav>

                {/* ========== Right Section ========== */}
                <div className="flex items-center gap-2">
                    {/* User Dropdown (Desktop) */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="hidden md:flex items-center gap-2 px-2"
                            >
                                <UserAvatar
                                    name={user?.name}
                                    email={user?.email}
                                />
                                <span className="text-sm font-medium max-w-[120px] truncate">
                                    {user?.name || user?.email}
                                </span>
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium">
                                        {user?.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {user?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {/* Profile Link */}
                            <DropdownMenuItem asChild>
                                <Link href="/profile" className="cursor-pointer">
                                    <User className="mr-2 h-4 w-4" />
                                    Profil Saya
                                </Link>
                            </DropdownMenuItem>

                            {/* Transaction History Link */}
                            <DropdownMenuItem asChild>
                                <Link href="/transactions" className="cursor-pointer">
                                    <Receipt className="mr-2 h-4 w-4" />
                                    Riwayat Transaksi
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {/* Logout */}
                            <DropdownMenuItem
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="text-destructive focus:text-destructive cursor-pointer"
                            >
                                {isLoggingOut ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <LogOut className="mr-2 h-4 w-4" />
                                )}
                                Keluar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* ========== Mobile Menu ========== */}
                    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                aria-label="Toggle menu"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                            <SheetHeader>
                                <SheetTitle className="flex items-center gap-2">
                                    <span className="relative w-8 h-8 rounded-lg overflow-hidden">
                                        <Image
                                            src="/images/logo/logo-prestige.svg"
                                            alt="Prestige Academy logo"
                                            fill
                                            className="object-contain"
                                        />
                                    </span>
                                    <span>
                                        <span className="text-primary">Prestige</span>{" "}
                                        <span className="text-muted-foreground">Academy</span>
                                    </span>
                                </SheetTitle>
                            </SheetHeader>

                            {/* User Info Card */}
                            <div className="flex items-center gap-3 mt-6 p-3 bg-muted/50 rounded-lg">
                                <UserAvatar
                                    name={user?.name}
                                    email={user?.email}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        {user?.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>

                            {/* Mobile Navigation Links */}
                            <nav className="flex flex-col gap-1 mt-6">
                                {NAV_ITEMS.map((item) => (
                                    <MobileNavLink
                                        key={item.href}
                                        href={item.href}
                                        label={item.label}
                                        icon={item.icon}
                                        isActive={isActive(item.href)}
                                        onClick={closeMobileMenu}
                                        badge={item.badge}
                                    />
                                ))}
                            </nav>

                            {/* Account Section */}
                            <div className="mt-6 pt-6 border-t">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 px-3">
                                    Akun
                                </p>
                                <nav className="flex flex-col gap-1">
                                    <MobileNavLink
                                        href="/profile"
                                        label="Profil Saya"
                                        icon={User}
                                        isActive={isActive("/profile")}
                                        onClick={closeMobileMenu}
                                    />
                                    <MobileNavLink
                                        href="/transactions"
                                        label="Riwayat Transaksi"
                                        icon={Receipt}
                                        isActive={isActive("/transactions")}
                                        onClick={closeMobileMenu}
                                    />
                                </nav>
                            </div>

                            {/* Logout Button */}
                            <div className="mt-6 pt-6 border-t">
                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() => {
                                        handleLogout();
                                        closeMobileMenu();
                                    }}
                                    disabled={isLoggingOut}
                                >
                                    {isLoggingOut ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <LogOut className="mr-2 h-4 w-4" />
                                    )}
                                    Keluar
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
