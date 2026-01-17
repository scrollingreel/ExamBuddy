"use client";

import { useProfile } from "@/hooks/use-profile";
import { cn } from "@/lib/utils";
import { BookOpen, CreditCard, FileText, GraduationCap, LayoutDashboard, LogOut, Menu, Settings, Trophy } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const sidebarItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/notes", icon: BookOpen, label: "Notes Library" },
    { href: "/dashboard/sessional-papers", icon: FileText, label: "Sessional Papers" },
    { href: "/dashboard/university-papers", icon: GraduationCap, label: "University Papers" },
    { href: "/dashboard/leaderboard", icon: Trophy, label: "Leaderboard" },
    { href: "/dashboard/subscription", icon: CreditCard, label: "Subscription" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
    { href: "/admin/settings", icon: Settings, label: "Admin Settings" }, // Add this if user is admin (we'll filter later)
];

interface SidebarContentProps {
    className?: string;
    onLinkClick?: () => void;
}

export function SidebarContent({ className, onLinkClick }: SidebarContentProps) {
    const pathname = usePathname();
    const { user, isGuest } = useProfile();

    // Filter items for guest
    const filteredItems = isGuest
        ? sidebarItems.filter(item => ["/dashboard", "/dashboard/notes", "/dashboard/sessional-papers", "/dashboard/university-papers"].includes(item.href))
        : sidebarItems;

    return (
        <div className={cn("flex h-full flex-col gap-2", className)}>
            <div className="flex h-14 items-center border-b px-6">
                <Link className="flex items-center gap-2 font-semibold" href="/" onClick={onLinkClick}>
                    <BookOpen className="h-6 w-6" />
                    <span className="">ExamBuddy</span>
                </Link>
            </div>

            {/* Profile Widget */}
            {user ? (
                <div className="mx-4 mt-4 rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-950">
                    <div className="mb-2 font-medium">{user.full_name || "Student"}</div>
                    <div className="text-xs text-muted-foreground grid grid-cols-2 gap-2">
                        <div>
                            <span className="block font-semibold text-slate-900 dark:text-slate-100">{user.semester || "N/A"}</span>
                            <span>Semester</span>
                        </div>
                        <div>
                            <span className="block font-semibold text-slate-900 dark:text-slate-100">{user.sgpa || "N/A"}</span>
                            <span>SGPA</span>
                        </div>
                    </div>
                    <Link href="/dashboard/profile" className="mt-3 block text-xs text-blue-600 hover:underline" onClick={onLinkClick}>
                        View Full Profile
                    </Link>
                </div>
            ) : (
                <div className="mx-4 mt-4 rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-950">
                    <div className="mb-2 font-medium">Guest Student</div>
                    <p className="text-xs text-muted-foreground">Sign in to track progress and sync notes.</p>
                    <Link href="/login" className="mt-3 block text-xs text-blue-600 hover:underline" onClick={onLinkClick}>
                        Sign In / Register
                    </Link>
                </div>
            )}

            <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-4 text-sm font-medium">
                    {filteredItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onLinkClick}
                            suppressHydrationWarning
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-slate-900 dark:hover:text-slate-50",
                                pathname === item.href
                                    ? "bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-50"
                                    : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="mt-auto p-4 border-t">
                {isGuest ? (
                    <Link
                        href="/login"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-all hover:text-blue-600"
                        onClick={onLinkClick}
                    >
                        <LogOut className="h-4 w-4 rotate-180" />
                        Sign In
                    </Link>
                ) : (
                    <Link
                        href="/login"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-all hover:text-red-500"
                        onClick={() => {
                            localStorage.removeItem("token");
                            if (onLinkClick) onLinkClick();
                        }}
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Link>
                )}
            </div>
        </div>
    );
}

export function Sidebar() {
    return (
        <div className="hidden border-r bg-slate-50/40 dark:bg-slate-950/40 md:block md:w-64">
            <SidebarContent />
        </div>
    );
}

export function MobileSidebar() {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
                <SidebarContent onLinkClick={() => setOpen(false)} />
            </SheetContent>
        </Sheet>
    );
}
