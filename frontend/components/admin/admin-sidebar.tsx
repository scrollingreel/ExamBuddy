"use client";

import { cn } from "@/lib/utils";
import { ShieldCheck, FileCheck, LogOut, Users, Book, Megaphone, Settings, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const adminSidebarItems = [
    { href: "/admin", icon: ShieldCheck, label: "Overview" },
    { href: "/admin/approvals", icon: FileCheck, label: "Approve Notes" },
    { href: "/admin/notes", icon: Book, label: "Manage Notes" },
    { href: "/admin/circulars", icon: Megaphone, label: "Circulars" },
    { href: "/admin/users", icon: Users, label: "Manage Users" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
];

interface AdminSidebarContentProps {
    className?: string;
    onLinkClick?: () => void;
}

export function AdminSidebarContent({ className, onLinkClick }: AdminSidebarContentProps) {
    const pathname = usePathname();

    return (
        <div className={cn("flex h-full flex-col gap-2 bg-zinc-900 text-zinc-50", className)}>
            <div className="flex h-14 items-center border-b border-zinc-800 px-6">
                <Link className="flex items-center gap-2 font-semibold" href="/admin" onClick={onLinkClick}>
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
                            onClick={onLinkClick}
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
                    onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user_profile_cache");
                        if (onLinkClick) onLinkClick();
                    }}
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </Link>
            </div>
        </div>
    );
}

export function AdminSidebar() {
    return (
        <div className="hidden border-r bg-zinc-900 md:block md:w-64">
            <AdminSidebarContent />
        </div>
    );
}

export function MobileAdminSidebar() {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-zinc-900 border-zinc-800">
                <SheetHeader className="sr-only">
                    <SheetTitle>Admin Navigation</SheetTitle>
                    <SheetDescription>
                        Navigate through admin options.
                    </SheetDescription>
                </SheetHeader>
                <AdminSidebarContent onLinkClick={() => setOpen(false)} />
            </SheetContent>
        </Sheet>
    );
}
