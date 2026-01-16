"use client";

import { API_BASE_URL } from "@/lib/config";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Medal, Award, Loader2 } from "lucide-react";

interface LeaderboardEntry {
    rank: number;
    name: string;
    count: number;
}

export default function LeaderboardPage() {
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
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Leaderboard</h2>
                <p className="text-muted-foreground">Top contributors who have helped the community.</p>
            </div>

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
        </div>
    );
}
