"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/config";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, Medal, Award, Search, RefreshCw, Clock, Filter, CheckCircle2, User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LeaderboardItem {
    id: string;
    student_name: string;
    student_email?: string | null;
    college?: string | null;
    test_id: string;
    test_title: string;
    score: number;
    total_marks: number;
    percentage: number;
    time_taken_seconds: number;
    ai_score: number;
    tech_score: number;
    submitted_at: string;
    rank?: number;
}

interface LeaderboardViewProps {
    initialTestFilter?: string;
    highlightSubmissionId?: string;
}

export function CapgeminiLeaderboardView({ initialTestFilter = "all", highlightSubmissionId }: LeaderboardViewProps) {
    const [entries, setEntries] = useState<LeaderboardItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterTest, setFilterTest] = useState(initialTestFilter);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const url = filterTest === "all" 
                ? `${API_BASE_URL}/placement/mock-tests/leaderboard` 
                : `${API_BASE_URL}/placement/mock-tests/leaderboard?test_id=${filterTest}`;
            
            const res = await fetch(url);
            let apiData: LeaderboardItem[] = [];
            if (res.ok) {
                apiData = await res.json();
            }

            // Also read local submissions from localStorage to merge seamlessly
            let localSubs: LeaderboardItem[] = [];
            try {
                const stored = localStorage.getItem("capgemini_mock_submissions");
                if (stored) {
                    localSubs = JSON.parse(stored);
                }
            } catch (e) {
                console.error("Error reading local submissions", e);
            }

            // Merge and deduplicate by id (ONLY real submissions)
            const map = new Map<string, LeaderboardItem>();
            apiData.forEach(item => map.set(item.id, item));
            localSubs.forEach(item => {
                if (!map.has(item.id)) map.set(item.id, item);
            });

            // Filter by test if not all
            let list = Array.from(map.values());
            if (filterTest !== "all") {
                list = list.filter(item => item.test_id === filterTest);
            }

            // Sort: highest score first, then lowest time taken, then earliest date
            list.sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                if (a.time_taken_seconds !== b.time_taken_seconds) return a.time_taken_seconds - b.time_taken_seconds;
                return new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime();
            });

            // Assign ranks
            const ranked = list.map((item, idx) => ({ ...item, rank: idx + 1 }));
            setEntries(ranked);
        } catch (error) {
            console.error("Failed to load leaderboard from API", error);
            // Use only real local submissions if API is unreachable
            let list: LeaderboardItem[] = [];
            try {
                const stored = localStorage.getItem("capgemini_mock_submissions");
                if (stored) {
                    list = JSON.parse(stored);
                }
            } catch {}
            if (filterTest !== "all") {
                list = list.filter(item => item.test_id === filterTest);
            }
            list.sort((a, b) => b.score - a.score || a.time_taken_seconds - b.time_taken_seconds);
            setEntries(list.map((item, idx) => ({ ...item, rank: idx + 1 })));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, [filterTest]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${String(s).padStart(2, "0")}s`;
    };

    const formatDate = (dateStr: string) => {
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
        } catch {
            return "Recently";
        }
    };

    const getRankBadge = (rank?: number) => {
        if (!rank) return null;
        if (rank === 1) {
            return (
                <div className="flex items-center gap-1.5 font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 w-fit">
                    <Trophy className="h-4 w-4" />
                    <span>#1</span>
                </div>
            );
        }
        if (rank === 2) {
            return (
                <div className="flex items-center gap-1.5 font-bold text-slate-400 bg-slate-400/10 px-2.5 py-1 rounded-full border border-slate-400/20 w-fit">
                    <Medal className="h-4 w-4" />
                    <span>#2</span>
                </div>
            );
        }
        if (rank === 3) {
            return (
                <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-600 bg-amber-700/10 px-2.5 py-1 rounded-full border border-amber-700/20 w-fit">
                    <Award className="h-4 w-4" />
                    <span>#3</span>
                </div>
            );
        }
        return <span className="font-mono text-muted-foreground font-semibold px-2">#{rank}</span>;
    };

    const filteredEntries = entries.filter(e => {
        const matchesSearch = e.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (e.college && e.college.toLowerCase().includes(searchQuery.toLowerCase())) ||
            e.test_title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const testTabs = [
        { id: "all", label: "All Tests" },
        { id: "mock-1", label: "Mock Test 1" },
        { id: "mock-2", label: "Mock Test 2" },
        { id: "mock-3", label: "Mock Test 3" },
        { id: "mock-4", label: "Mock Test 4" },
        { id: "mock-5", label: "Mock Test 5" },
    ];

    return (
        <Card className="border shadow-md bg-white dark:bg-slate-950 overflow-hidden">
            <CardHeader className="border-b bg-gradient-to-r from-blue-900/10 via-slate-900/5 to-emerald-900/10 dark:from-blue-950/40 dark:via-slate-900/40 dark:to-emerald-950/40 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-2">
                            <Trophy className="h-3.5 w-3.5" /> Capgemini 2027 Leaderboard
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            AI Literacy &amp; Technical Assessment Standings
                        </CardTitle>
                        <CardDescription className="text-sm mt-1">
                            Live rankings of students across all 5 mock tests based on score and completion speed.
                        </CardDescription>
                    </div>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={fetchLeaderboard} 
                        disabled={loading}
                        className="rounded-xl shrink-0 self-start md:self-auto gap-2"
                    >
                        <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                        Refresh
                    </Button>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pt-4 scrollbar-hide">
                    {testTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setFilterTest(tab.id)}
                            className={cn(
                                "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer",
                                filterTest === tab.id
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </CardHeader>

            <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4 mb-5">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by student name or college..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-10 rounded-xl"
                        />
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">
                        Showing {filteredEntries.length} student{filteredEntries.length === 1 ? "" : "s"}
                    </div>
                </div>

                {loading ? (
                    <div className="py-16 text-center text-muted-foreground">
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3 opacity-40" />
                        <p className="text-sm">Loading assessment standings...</p>
                    </div>
                ) : filteredEntries.length === 0 ? (
                    <div className="py-16 text-center text-muted-foreground border border-dashed rounded-xl">
                        <Trophy className="h-10 w-10 mx-auto mb-3 opacity-20" />
                        <p className="text-base font-semibold text-slate-800 dark:text-slate-200">No submissions found yet</p>
                        <p className="text-xs mt-1">Be the first student to complete this mock test and claim the #1 spot!</p>
                    </div>
                ) : (
                    <div className="rounded-xl border overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
                                <TableRow>
                                    <TableHead className="w-[80px]">Rank</TableHead>
                                    <TableHead>Student</TableHead>
                                    <TableHead className="hidden md:table-cell">Assessment</TableHead>
                                    <TableHead className="text-center">Score</TableHead>
                                    <TableHead className="text-center hidden sm:table-cell">Accuracy</TableHead>
                                    <TableHead className="text-center hidden lg:table-cell">Time Spent</TableHead>
                                    <TableHead className="text-right hidden sm:table-cell">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEntries.map((row) => {
                                    const isHighlighted = highlightSubmissionId === row.id;
                                    return (
                                        <TableRow 
                                            key={row.id} 
                                            className={cn(
                                                "transition-colors",
                                                isHighlighted && "bg-blue-500/10 dark:bg-blue-500/20 font-medium"
                                            )}
                                        >
                                            <TableCell>{getRankBadge(row.rank)}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                                        {row.student_name}
                                                        {isHighlighted && (
                                                            <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded-full">YOU</span>
                                                        )}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {row.college || "ABES Engineering College"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                    {row.test_title.replace("Capgemini 2027 ", "")}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="font-bold text-slate-900 dark:text-white text-base">
                                                    {row.score}
                                                </span>
                                                <span className="text-xs text-muted-foreground font-normal"> / {row.total_marks}</span>
                                            </TableCell>
                                            <TableCell className="text-center hidden sm:table-cell">
                                                <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    {Math.round(row.percentage)}%
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center hidden lg:table-cell">
                                                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-mono">
                                                    <Clock className="h-3 w-3" />
                                                    {formatTime(row.time_taken_seconds)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right text-xs text-muted-foreground hidden sm:table-cell">
                                                {formatDate(row.submitted_at)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
