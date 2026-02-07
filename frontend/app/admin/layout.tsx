"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/config";
import { AdminSidebar, MobileAdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
            <AdminSidebar />
            <div className="flex-1 overflow-y-auto">
                <header className="flex h-14 items-center gap-4 border-b bg-white px-6 dark:bg-slate-950 lg:h-[60px]">
                    <MobileAdminSidebar />
                    <h1 className="text-lg font-semibold">Admin Area</h1>
                </header>
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
