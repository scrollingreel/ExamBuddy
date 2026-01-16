"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ShieldCheck, FileCheck, LogOut, Users, Book, Megaphone, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/config";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.replace("/login");
                return;
            }

            try {
                const res = await fetch(`${API_BASE_URL}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.ok) {
                    const user = await res.json();
                    if (user.role === "ADMIN") {
                        setIsAuthorized(true);
                        setIsLoading(false);
                    } else {
                        // Not admin, redirect to dashboard
                        router.replace("/dashboard");
                    }
                } else {
                    router.replace("/login");
                }
            } catch (error) {
                console.error("Auth check failed", error);
                router.replace("/login");
            }
        };
        checkAuth();
    }, [router]);

    const adminSidebarItems = [
        { href: "/admin", icon: ShieldCheck, label: "Overview" },
        { href: "/admin/approvals", icon: FileCheck, label: "Approve Notes" },
        { href: "/admin/notes", icon: Book, label: "Manage Notes" },
        { href: "/admin/circulars", icon: Megaphone, label: "Circulars" },
        { href: "/admin/users", icon: Users, label: "Manage Users" },
    ];

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
            </div>
        );
    }

    if (!isAuthorized) return null;

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <div className="hidden border-r bg-zinc-900 text-zinc-50 md:block md:w-64">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b border-zinc-800 px-6">
                        <Link className="flex items-center gap-2 font-semibold" href="/admin">
                            <ShieldCheck className="h-6 w-6 text-red-500" />
                            <span>Admin Panel</span>
                        </Link>
                    </div>
                    <div className="flex-1 overflow-auto py-2">
                        <nav className="grid items-start px-4 text-sm font-medium">
                            {adminSidebarItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-zinc-800",
                                        pathname === item.href
                                            ? "bg-zinc-800 text-white"
                                            : "text-zinc-400"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="mt-auto p-4 border-t border-zinc-800">
                        <Link
                            href="/login"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-all hover:text-white"
                            onClick={() => localStorage.removeItem("token")}
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                <header className="flex h-14 items-center gap-4 border-b bg-white px-6 dark:bg-slate-950 lg:h-[60px]">
                    <h1 className="text-lg font-semibold">Admin Area</h1>
                </header>
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
