"use client";

import { API_BASE_URL } from "@/lib/config";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2, Shield, ShieldCheck, Crown } from "lucide-react";

interface User {
    id: string;
    email: string;
    full_name: string;
    role: "STUDENT" | "ADMIN";
    is_premium: boolean;
    created_at: string;
}

export default function ManageUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_BASE_URL}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const togglePremium = async (userId: string) => {
        setActionLoading(userId);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/premium`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                // Optimistic update
                setUsers(users.map(u =>
                    u.id === userId ? { ...u, is_premium: !u.is_premium } : u
                ));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Manage Users</h2>
                <p className="text-muted-foreground">
                    View and manage all registered users.
                </p>
            </div>

            {loading ? (
                <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="rounded-md border bg-white dark:bg-slate-950">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User Details</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="font-medium">{user.full_name || "No Name"}</div>
                                        <div className="text-sm text-muted-foreground">{user.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {user.role === "ADMIN" ? (
                                                <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 dark:bg-purple-400/10 dark:text-purple-400 dark:ring-purple-400/30">
                                                    <ShieldCheck className="mr-1 h-3 w-3" /> Admin
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20">
                                                    Student
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {user.is_premium ? (
                                            <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-500 dark:ring-yellow-400/20">
                                                <Crown className="mr-1 h-3 w-3" /> Premium
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">Free</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant={user.is_premium ? "outline" : "default"}
                                            size="sm"
                                            onClick={() => togglePremium(user.id)}
                                            disabled={actionLoading === user.id}
                                        >
                                            {actionLoading === user.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : user.is_premium ? (
                                                "Downgrade"
                                            ) : (
                                                "Upgrade to Premium"
                                            )}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
