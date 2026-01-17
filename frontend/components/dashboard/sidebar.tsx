"use client";

import { API_BASE_URL } from "@/lib/config";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BookOpen, Settings, CreditCard, LogOut, Trophy, FileText, GraduationCap } from "lucide-react";

const sidebarItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/notes", icon: BookOpen, label: "Notes Library" },
    { href: "/dashboard/sessional-papers", icon: FileText, label: "Sessional Papers" },
    { href: "/dashboard/university-papers", icon: GraduationCap, label: "University Papers" },

    { href: "/dashboard/leaderboard", icon: Trophy, label: "Leaderboard" },
    { href: "/dashboard/subscription", icon: CreditCard, label: "Subscription" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
    const pathname = usePathname();
    const [user, setUser] = useState<{ full_name: string; semester: number; sgpa: number } | null>(null);
    const [isGuest, setIsGuest] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsGuest(true);
                return;
            }
            try {
                const res = await fetch(`${API_BASE_URL}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                    setIsGuest(false);
                } else {
                    // Token invalid
                    setIsGuest(true);
                    localStorage.removeItem("token");
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
                setIsGuest(true);
            }
        };
        fetchProfile();
    }, []);

    // Filter items for guest
    const filteredItems = isGuest
        ? sidebarItems.filter(item => ["/dashboard", "/dashboard/notes", "/dashboard/sessional-papers", "/dashboard/university-papers"].includes(item.href))
        : sidebarItems;

    return (
        <div className="hidden border-r bg-slate-50/40 dark:bg-slate-950/40 md:block md:w-64">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-6">
                    <Link className="flex items-center gap-2 font-semibold" href="/">
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
                        <Link href="/dashboard/profile" className="mt-3 block text-xs text-blue-600 hover:underline">
                            View Full Profile
                        </Link>
                    </div>
                ) : (
                    <div className="mx-4 mt-4 rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-950">
                        <div className="mb-2 font-medium">Guest Student</div>
                        <p className="text-xs text-muted-foreground">Sign in to track progress and sync notes.</p>
                        <Link href="/login" className="mt-3 block text-xs text-blue-600 hover:underline">
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
                        >
                            <LogOut className="h-4 w-4 rotate-180" />
                            Sign In
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-all hover:text-red-500"
                            onClick={() => localStorage.removeItem("token")}
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
