"use client";

import { API_BASE_URL } from "@/lib/config";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Clock, Star, TrendingUp } from "lucide-react";

import { Megaphone } from "lucide-react";
import { useState, useEffect } from "react";

interface Circular {
    id: string;
    title: string;
    message: string;
    link: string;
    created_at: string;
}

export default function DashboardPage() {
    const [circulars, setCirculars] = useState<Circular[]>([]);
    const [recentNotes, setRecentNotes] = useState<any[]>([]);
    const [userProfile, setUserProfile] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                // Fetch Circulars
                const circularRes = await fetch(`${API_BASE_URL}/circulars/`);
                if (circularRes.ok) {
                    setCirculars(await circularRes.json());
                }

                // Fetch Recent Notes (Limit 5)
                const notesRes = await fetch(`${API_BASE_URL}/notes/?limit=5`);
                if (notesRes.ok) {
                    setRecentNotes(await notesRes.json());
                }

                // Fetch Profile
                if (token) {
                    const profileRes = await fetch(`${API_BASE_URL}/auth/me`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    if (profileRes.ok) {
                        setUserProfile(await profileRes.json());
                    }
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Notes"
                    value="12"
                    icon={Book}
                    description="Uploaded this semester"
                />
                <StatsCard
                    title="Study Hours"
                    value={userProfile?.study_hours ? `${userProfile.study_hours}h` : "0h"}
                    icon={Clock}
                    description="Total logged time"
                />
                <StatsCard
                    title="Premium Access"
                    value={userProfile?.is_premium ? "Active" : "Basic"}
                    icon={Star}
                    description={userProfile?.is_premium ? "Unlimited Access" : "Upgrade to unlock"}
                />
                <StatsCard
                    title="Exam Score"
                    value={userProfile?.cgpa ? `${userProfile.cgpa} CGPA` : "N/A"}
                    icon={TrendingUp}
                    description={userProfile?.target_cgpa ? `Target: ${userProfile.target_cgpa}` : "Set a target"}
                />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentNotes.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                You haven't viewed any notes recently.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {recentNotes.map((note) => (
                                    <div key={note.id} className="flex items-center gap-4 rounded-md border p-4">
                                        <div className="rounded-full bg-slate-100 p-2 dark:bg-slate-800">
                                            <Book className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none">{note.title}</p>
                                            <p className="text-xs text-muted-foreground">{note.subject}</p>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {new Date(note.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Megaphone className="h-5 w-5 text-blue-500" />
                            Announcements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {circulars.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No new announcements.</p>
                            ) : (
                                circulars.map((circular) => (
                                    <div key={circular.id} className="flex items-start gap-4 rounded-md border p-3">
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {circular.title}
                                            </p>
                                            {circular.message && (
                                                <p className="text-xs text-muted-foreground">
                                                    {circular.message}
                                                </p>
                                            )}
                                            {circular.link && (
                                                <a href={circular.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                                                    View Link
                                                </a>
                                            )}
                                            <p className="text-[10px] text-slate-400">
                                                {new Date(circular.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatsCard({
    title,
    value,
    icon: Icon,
    description,
}: {
    title: string;
    value: string;
    icon: any;
    description: string;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}
