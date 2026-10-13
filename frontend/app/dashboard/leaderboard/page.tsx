"use client";

import { API_BASE_URL } from "@/lib/config";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Medal, Award, Loader2, BookOpen, Sparkles } from "lucide-react";
import { CapgeminiLeaderboardView } from "@/components/capgemini/leaderboard-view";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
    rank: number;
    name: string;
    count: number;
}

export default function LeaderboardPage() {
    const [activeTab, setActiveTab] = useState<"capgemini" | "notes">("capgemini");
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/notes/leaderboard`);
                if (res.ok) {
                    setLeaderboard(await res.json());
                }
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
            case 2: return <Medal className="h-5 w-5 text-gray-400" />;
            case 3: return <Award className="h-5 w-5 text-amber-600" />;
            default: return <span className="text-muted-foreground font-mono">#{rank}</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Leaderboard</h2>
                    <p className="text-muted-foreground">Top performers in mock assessments and community contributors.</p>
                </div>

                {/* Primary Category Switcher */}
                <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border w-fit">
                    <button
                        onClick={() => setActiveTab("capgemini")}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
                            activeTab === "capgemini"
                                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Trophy className="h-4 w-4 text-amber-500" />
                        Capgemini Mock Tests
                    </button>
                    <button
                        onClick={() => setActiveTab("notes")}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
                            activeTab === "notes"
                                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <BookOpen className="h-4 w-4" />
                        Top Note Uploaders
                    </button>
                </div>
            </div>

            {activeTab === "capgemini" ? (
                <CapgeminiLeaderboardView initialTestFilter="all" />
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Top Note Uploaders</CardTitle>
                        <CardDescription>Rankings based on number of approved notes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex h-40 justify-center items-center">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : leaderboard.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground">
                                No data available yet. Start uploading notes to appear here!
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Rank</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead className="text-right">Notes Uploaded</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {leaderboard.map((entry) => (
                                        <TableRow key={entry.rank}>
                                            <TableCell className="font-medium flex items-center gap-2">
                                                {getRankIcon(entry.rank)}
                                            </TableCell>
                                            <TableCell>{entry.name}</TableCell>
                                            <TableCell className="text-right font-bold">{entry.count}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
