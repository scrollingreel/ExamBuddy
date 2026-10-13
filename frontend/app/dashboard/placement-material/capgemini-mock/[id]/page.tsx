"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { CAPGEMINI_MOCK_TESTS, MockTest, MockQuestion } from "@/lib/capgemini-mock-data";
import { useProfile } from "@/hooks/use-profile";
import { API_BASE_URL } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    ArrowLeft,
    Clock,
    CheckCircle2,
    XCircle,
    HelpCircle,
    Trophy,
    RotateCcw,
    Printer,
    ChevronRight,
    ChevronLeft,
    Flag,
    Award,
    Sparkles,
    BookOpen,
    ListChecks,
    AlertTriangle,
    Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CapgeminiLeaderboardView } from "@/components/capgemini/leaderboard-view";
import Link from "next/link";

const LETTERS = ["A", "B", "C", "D"];

export default function CapgeminiMockTestPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useProfile();
    
    // Resolve test ID
    const rawId = (params.id as string) || "mock-1";
    const testId = rawId.startsWith("mock-") ? rawId : `mock-${rawId}`;
    const currentMock = CAPGEMINI_MOCK_TESTS.find(t => t.id === testId) || CAPGEMINI_MOCK_TESTS[0];

    // Student identity
    const [studentName, setStudentName] = useState("");
    const [college, setCollege] = useState("ABES Engineering College");

    // Test stage: 'intro' | 'active' | 'results'
    const [stage, setStage] = useState<"intro" | "active" | "results">("intro");
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>([]);
    const [reviewFlags, setReviewFlags] = useState<boolean[]>([]);
    
    // Timer state (30 min = 1800s)
    const [timeLeft, setTimeLeft] = useState(30 * 60);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);

    // Modal state
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [isAutoSubmitted, setIsAutoSubmitted] = useState(false);

    // Results & Leaderboard state
    const [submissionId, setSubmissionId] = useState<string>("");
    const [userRank, setUserRank] = useState<number | null>(null);
    const [reviewFilter, setReviewFilter] = useState<"all" | "correct" | "wrong" | "skipped">("all");
    const [showLeaderboardTab, setShowLeaderboardTab] = useState(false);

    // Sync student name from user profile
    useEffect(() => {
        if (user?.full_name && !studentName) {
            setStudentName(user.full_name);
        }
    }, [user]);

    // Initialize answers and reviews when test loads
    useEffect(() => {
        if (currentMock) {
            setAnswers(Array(currentMock.questions.length).fill(null));
            setReviewFlags(Array(currentMock.questions.length).fill(false));
            setTimeLeft(currentMock.durationMinutes * 60);
        }
    }, [currentMock]);

    // Keyboard navigation
    useEffect(() => {
        if (stage !== "active" || showSubmitModal) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if (e.key === "ArrowLeft") {
                e.preventDefault();
                goToPrev();
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                goToNext();
            } else if (["1", "2", "3", "4"].includes(e.key)) {
                e.preventDefault();
                selectOption(Number(e.key) - 1);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [stage, currentIdx, answers, showSubmitModal]);

    // Timer effect
    useEffect(() => {
        if (stage === "active") {
            startTimeRef.current = Date.now();
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current!);
                        handleAutoSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [stage]);

    const startTest = () => {
        setAnswers(Array(currentMock.questions.length).fill(null));
        setReviewFlags(Array(currentMock.questions.length).fill(false));
        setCurrentIdx(0);
        setTimeLeft(currentMock.durationMinutes * 60);
        setElapsedSeconds(0);
        setIsAutoSubmitted(false);
        setStage("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const selectOption = (optIndex: number) => {
        setAnswers(prev => {
            const next = [...prev];
            next[currentIdx] = optIndex;
            return next;
        });
    };

    const clearResponse = () => {
        setAnswers(prev => {
            const next = [...prev];
            next[currentIdx] = null;
            return next;
        });
    };

    const toggleReview = () => {
        setReviewFlags(prev => {
            const next = [...prev];
            next[currentIdx] = !next[currentIdx];
            return next;
        });
    };

    const goToPrev = () => {
        if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
    };

    const goToNext = () => {
        if (currentIdx < currentMock.questions.length - 1) {
            setCurrentIdx(currentIdx + 1);
        } else {
            setShowSubmitModal(true);
        }
    };

    const goToQuestion = (idx: number) => {
        setCurrentIdx(Math.max(0, Math.min(currentMock.questions.length - 1, idx)));
    };

    const goToFirstUnanswered = () => {
        const firstUnanswered = answers.findIndex(a => a === null);
        if (firstUnanswered !== -1) {
            setCurrentIdx(firstUnanswered);
        } else {
            setShowSubmitModal(true);
        }
    };

    const handleAutoSubmit = () => {
        setIsAutoSubmitted(true);
        setShowSubmitModal(false);
        finalizeTest();
    };

    const confirmSubmit = () => {
        setShowSubmitModal(false);
        finalizeTest();
    };

    const finalizeTest = async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        const elapsed = Math.min(
            currentMock.durationMinutes * 60,
            Math.floor((Date.now() - startTimeRef.current) / 1000)
        );
        setElapsedSeconds(elapsed);

        // Compute scores
        let totalScore = 0;
        let aiScore = 0;
        let techScore = 0;

        currentMock.questions.forEach((q, idx) => {
            const selected = answers[idx];
            if (selected === q.answer) {
                totalScore += 1;
                if (q.section === "AI Literacy") {
                    aiScore += 1;
                } else {
                    techScore += 1;
                }
            }
        });

        const pct = Math.round((totalScore / currentMock.questions.length) * 1000) / 10;
        const generatedId = "sub_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
        setSubmissionId(generatedId);

        const subPayload = {
            student_name: studentName.trim() || user?.full_name || "Student",
            student_email: user?.email || null,
            college: college.trim() || "ABES Engineering College",
            test_id: currentMock.id,
            test_title: currentMock.title,
            score: totalScore,
            total_marks: currentMock.questions.length,
            percentage: pct,
            time_taken_seconds: elapsed,
            ai_score: aiScore,
            tech_score: techScore,
        };

        // Save locally for guaranteed immediate offline display
        try {
            const localSubmission = {
                id: generatedId,
                ...subPayload,
                submitted_at: new Date().toISOString(),
            };
            const existing = JSON.parse(localStorage.getItem("capgemini_mock_submissions") || "[]");
            localStorage.setItem("capgemini_mock_submissions", JSON.stringify([localSubmission, ...existing]));
        } catch (e) {
            console.error("Local storage error", e);
        }

        // Post to backend API
        try {
            const token = localStorage.getItem("token");
            const headers: Record<string, string> = { "Content-Type": "application/json" };
            if (token && token !== "null" && token !== "undefined") {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const res = await fetch(`${API_BASE_URL}/placement/mock-tests/submit`, {
                method: "POST",
                headers,
                body: JSON.stringify(subPayload),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.rank) setUserRank(data.rank);
                if (data.id) setSubmissionId(data.id);
            }
        } catch (err) {
            console.error("Failed to post mock test submission to server", err);
        }

        setStage("results");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Format seconds into MM:SS
    const formatTimer = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    const formatElapsed = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}m ${String(s).padStart(2, "0")}s`;
    };

    const answeredCount = answers.filter(a => a !== null).length;
    const reviewCount = reviewFlags.filter(Boolean).length;
    const unansweredCount = currentMock.questions.length - answeredCount;

    // Next test ID helper
    const currentNum = currentMock.testNumber;
    const nextTestNum = currentNum < 5 ? currentNum + 1 : 1;
    const nextTestId = `mock-${nextTestNum}`;

    // -------------------------------------------------------------------------
    // VIEW 1: INTRO SCREEN
    // -------------------------------------------------------------------------
    if (stage === "intro") {
        return (
            <div className="max-w-4xl mx-auto space-y-6 pt-2 pb-12">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/dashboard/placement-material")}
                    className="-ml-3 text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Placement Prep
                </Button>

                {/* Main Hero Card */}
                <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white p-8 md:p-12 shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
                    
                    <div className="relative z-10 space-y-6">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                                Capgemini 2027 Assessment
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                                Test #{currentMock.testNumber} of 5
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-400/30">
                                40 MCQs · 30 Mins
                            </span>
                        </div>

                        <div>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
                                {currentMock.title}
                            </h1>
                            <p className="text-slate-300 text-base md:text-lg mt-2 max-w-2xl font-light">
                                Scenario-based questions matching Capgemini’s AI Literacy &amp; Technical core round. Includes real-time student leaderboard &amp; in-depth answer explanations.
                            </p>
                        </div>

                        {/* Metric Highlights */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <span className="block text-2xl font-black text-blue-400">40</span>
                                <span className="text-xs text-slate-400">Total Questions</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <span className="block text-2xl font-black text-emerald-400">30:00</span>
                                <span className="text-xs text-slate-400">Time Limit</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <span className="block text-2xl font-black text-amber-400">20 + 20</span>
                                <span className="text-xs text-slate-400">AI Literacy + Tech</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <span className="block text-2xl font-black text-pink-400">No -ve</span>
                                <span className="text-xs text-slate-400">Negative Marking</span>
                            </div>
                        </div>

                        {/* Section Curriculum Split */}
                        <div className="grid sm:grid-cols-2 gap-4 pt-2">
                            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/60 space-y-2">
                                <h3 className="font-bold text-blue-400 text-sm flex items-center gap-2">
                                    <Sparkles className="h-4 w-4" /> Section 1: AI Literacy (20 Qs)
                                </h3>
                                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                                    <li>AI Foundations &amp; Generative AI (5 Qs)</li>
                                    <li>Prompt Engineering &amp; AI Productivity (5 Qs)</li>
                                    <li>RAG, Embeddings &amp; AI Agents (5 Qs)</li>
                                    <li>Responsible AI &amp; Evaluation (5 Qs)</li>
                                </ul>
                            </div>
                            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/60 space-y-2">
                                <h3 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" /> Section 2: Technical Assessment (20 Qs)
                                </h3>
                                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                                    <li>Programming Logic &amp; Problem Solving (5 Qs)</li>
                                    <li>Data Structures &amp; Algorithms (5 Qs)</li>
                                    <li>Software Engineering Fundamentals (5 Qs)</li>
                                    <li>Modern Engineering &amp; Cloud Awareness (5 Qs)</li>
                                </ul>
                            </div>
                        </div>

                        {/* Student Details Inputs */}
                        <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                            <h3 className="font-bold text-white text-sm">Enter Candidate Information</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-slate-300">Your Full Name</Label>
                                    <Input
                                        placeholder="e.g. Utkarsh Gupta"
                                        value={studentName}
                                        onChange={(e) => setStudentName(e.target.value)}
                                        className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 rounded-xl"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-slate-300">College / University</Label>
                                    <Input
                                        placeholder="e.g. ABES Engineering College"
                                        value={college}
                                        onChange={(e) => setCollege(e.target.value)}
                                        className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 rounded-xl"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                            <Button
                                onClick={startTest}
                                size="lg"
                                className="w-full sm:w-auto px-8 py-6 rounded-2xl text-base font-bold bg-blue-500 hover:bg-blue-400 text-slate-950 shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5"
                            >
                                Start Assessment Now <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => setShowLeaderboardTab(prev => !prev)}
                                className="w-full sm:w-auto px-6 py-6 rounded-2xl text-base font-semibold border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
                            >
                                <Trophy className="mr-2 h-5 w-5 text-amber-400" />
                                {showLeaderboardTab ? "Hide Leaderboard" : "View Test Leaderboard"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Other Mock Tests Selector Bar */}
                <div className="p-6 rounded-2xl border bg-white dark:bg-slate-950 shadow-sm space-y-3">
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center justify-between">
                        <span>All 5 Capgemini 2027 Mock Tests</span>
                        <span className="text-xs text-muted-foreground font-normal">200 Total Questions</span>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                        {CAPGEMINI_MOCK_TESTS.map(t => (
                            <Link
                                key={t.id}
                                href={`/dashboard/placement-material/capgemini-mock/${t.id}`}
                                className={cn(
                                    "p-3 rounded-xl border text-center transition-all block",
                                    t.id === currentMock.id
                                        ? "bg-blue-600 text-white border-blue-600 shadow-sm font-bold"
                                        : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 text-slate-700 dark:text-slate-300 font-medium"
                                )}
                            >
                                <div className="text-xs uppercase tracking-wider opacity-80">Test #{t.testNumber}</div>
                                <div className="text-sm font-bold mt-0.5">40 MCQs</div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Standalone Leaderboard Toggle */}
                {showLeaderboardTab && (
                    <div className="pt-2">
                        <CapgeminiLeaderboardView initialTestFilter={currentMock.id} />
                    </div>
                )}
            </div>
        );
    }

    // -------------------------------------------------------------------------
    // VIEW 2: ACTIVE TEST IN-PROGRESS SCREEN
    // -------------------------------------------------------------------------
    if (stage === "active") {
        const currentQ: MockQuestion = currentMock.questions[currentIdx];
        const isAnswered = answers[currentIdx] !== null;
        const isReview = reviewFlags[currentIdx];

        const isTimeUrgent = timeLeft <= 60;
        const isTimeWarn = timeLeft <= 300 && !isTimeUrgent;

        return (
            <div className="max-w-7xl mx-auto space-y-4 pt-1 pb-16">
                {/* Fixed/Sticky Top Bar */}
                <header className="sticky top-2 z-20 rounded-2xl border bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 shadow-md flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-600 text-white font-black grid place-items-center text-lg shadow-sm">
                            C
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                    Capgemini 2027 Mock #{currentMock.testNumber}
                                </span>
                                <span className="hidden sm:inline-block text-xs text-muted-foreground">•</span>
                                <span className="hidden sm:inline-block text-xs text-muted-foreground">Candidate: {studentName || "Student"}</span>
                            </div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                                AI Literacy + Technical Round
                            </h2>
                        </div>
                    </div>

                    {/* Timer Badge */}
                    <div className={cn(
                        "flex items-center gap-2.5 px-4 py-2 rounded-xl border font-mono font-bold text-lg transition-all",
                        isTimeUrgent && "bg-red-500/10 border-red-500 text-red-600 dark:text-red-400 animate-pulse",
                        isTimeWarn && "bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400",
                        !isTimeWarn && !isTimeUrgent && "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    )}>
                        <Clock className="h-5 w-5" />
                        <span>{formatTimer(timeLeft)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setShowSubmitModal(true)}
                            className="rounded-xl font-bold shadow-sm"
                        >
                            Submit Assessment
                        </Button>
                    </div>
                </header>

                {/* Main 2-Column Assessment Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Question Pane (8 cols) */}
                    <div className="lg:col-span-8 space-y-4">
                        <Card className="border shadow-md rounded-2xl bg-white dark:bg-slate-950 p-6 md:p-8 min-h-[520px] flex flex-col justify-between">
                            <div className="space-y-5">
                                {/* Question Header */}
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 dark:border-slate-800">
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                            Question {currentIdx + 1} of {currentMock.questions.length}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-0.5">
                                            Curriculum Reference: PDF Q{currentQ.source}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "text-xs px-2.5 py-1 rounded-full font-semibold border",
                                            currentQ.section === "AI Literacy"
                                                ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                                                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        )}>
                                            {currentQ.section}
                                        </span>
                                        <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                            {currentQ.topic}
                                        </span>
                                    </div>
                                </div>

                                {/* Question Stem */}
                                <div className="py-2">
                                    <h3 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 leading-relaxed">
                                        {currentQ.stem}
                                    </h3>
                                </div>

                                {/* Options List */}
                                <div className="space-y-3 pt-2">
                                    {currentQ.options.map((opt, optIdx) => {
                                        const isSelected = answers[currentIdx] === optIdx;
                                        return (
                                            <button
                                                key={optIdx}
                                                type="button"
                                                onClick={() => selectOption(optIdx)}
                                                className={cn(
                                                    "w-full text-left p-4 rounded-xl border flex items-start gap-4 transition-all cursor-pointer group",
                                                    isSelected
                                                        ? "border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 shadow-sm ring-1 ring-blue-600"
                                                        : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700"
                                                )}
                                            >
                                                <div className={cn(
                                                    "h-7 w-7 rounded-lg font-bold text-xs grid place-items-center shrink-0 transition-colors",
                                                    isSelected
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-blue-600/20 group-hover:text-blue-600"
                                                )}>
                                                    {LETTERS[optIdx]}
                                                </div>
                                                <span className={cn(
                                                    "text-sm md:text-base leading-relaxed pt-0.5",
                                                    isSelected ? "font-semibold text-blue-950 dark:text-blue-100" : "text-slate-800 dark:text-slate-200"
                                                )}>
                                                    {opt}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Bottom Controls */}
                            <div className="pt-8 border-t dark:border-slate-800 mt-6 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={clearResponse}
                                        disabled={!isAnswered}
                                        className="rounded-xl text-xs"
                                    >
                                        Clear Response
                                    </Button>
                                    <Button
                                        variant={isReview ? "secondary" : "outline"}
                                        size="sm"
                                        onClick={toggleReview}
                                        className={cn(
                                            "rounded-xl text-xs font-semibold gap-1.5",
                                            isReview && "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30"
                                        )}
                                    >
                                        <Flag className={cn("h-3.5 w-3.5", isReview && "fill-amber-500 text-amber-500")} />
                                        {isReview ? "Marked for Review" : "Mark for Review"}
                                    </Button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={goToPrev}
                                        disabled={currentIdx === 0}
                                        className="rounded-xl gap-1 text-xs sm:text-sm"
                                    >
                                        <ChevronLeft className="h-4 w-4" /> Previous
                                    </Button>
                                    <Button
                                        onClick={goToNext}
                                        className="rounded-xl gap-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm"
                                    >
                                        {currentIdx === currentMock.questions.length - 1 ? "Finish Test" : "Next"}
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Question Palette & Controls Pane (4 cols) */}
                    <div className="lg:col-span-4 space-y-4 sticky top-24">
                        <Card className="border shadow-md rounded-2xl bg-white dark:bg-slate-950 p-5 space-y-5">
                            {/* Palette Header */}
                            <div>
                                <div className="flex items-center justify-between text-sm font-semibold mb-2">
                                    <span>Question Palette</span>
                                    <span className="text-xs text-muted-foreground font-mono">
                                        {answeredCount} / {currentMock.questions.length} answered
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 transition-all duration-300"
                                        style={{ width: `${(answeredCount / currentMock.questions.length) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Status Counts */}
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <span className="block text-lg font-black text-emerald-600 dark:text-emerald-400">{answeredCount}</span>
                                    <span className="text-[11px] text-muted-foreground font-medium">Answered</span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                    <span className="block text-lg font-black text-amber-600 dark:text-amber-400">{reviewCount}</span>
                                    <span className="text-[11px] text-muted-foreground font-medium">Review</span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                    <span className="block text-lg font-black text-slate-700 dark:text-slate-300">{unansweredCount}</span>
                                    <span className="text-[11px] text-muted-foreground font-medium">Unanswered</span>
                                </div>
                            </div>

                            {/* Numbered Palette Grid (1 to 40) */}
                            <div>
                                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center justify-between">
                                    <span>Questions (1 - 40)</span>
                                    <span className="font-normal text-[10px]">Click to jump</span>
                                </div>
                                <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-5 gap-2 max-h-[300px] overflow-y-auto pr-1">
                                    {currentMock.questions.map((q, idx) => {
                                        const ans = answers[idx] !== null;
                                        const rev = reviewFlags[idx];
                                        const isCurr = idx === currentIdx;

                                        return (
                                            <button
                                                key={q.id}
                                                type="button"
                                                onClick={() => goToQuestion(idx)}
                                                className={cn(
                                                    "aspect-square rounded-xl text-xs font-bold transition-all relative flex items-center justify-center cursor-pointer",
                                                    isCurr && "ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-slate-950 font-black",
                                                    ans && !rev && "bg-emerald-600 text-white shadow-sm",
                                                    rev && !ans && "bg-amber-500 text-white shadow-sm",
                                                    ans && rev && "bg-gradient-to-br from-emerald-600 to-amber-500 text-white shadow-sm",
                                                    !ans && !rev && "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                                                )}
                                            >
                                                {idx + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Palette Legend */}
                            <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground pt-1 border-t dark:border-slate-800">
                                <span className="flex items-center gap-1.5">
                                    <span className="h-3 w-3 rounded-md bg-emerald-600 inline-block" /> Answered
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="h-3 w-3 rounded-md bg-amber-500 inline-block" /> Review
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="h-3 w-3 rounded-md bg-slate-200 dark:bg-slate-700 inline-block" /> Unanswered
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="h-3 w-3 rounded-md border-2 border-blue-600 inline-block" /> Current
                                </span>
                            </div>

                            {/* Quick Action Buttons */}
                            <div className="space-y-2 pt-2 border-t dark:border-slate-800">
                                <Button
                                    variant="outline"
                                    onClick={goToFirstUnanswered}
                                    className="w-full rounded-xl text-xs font-medium"
                                >
                                    Review Unanswered Questions
                                </Button>
                                <Button
                                    onClick={() => setShowSubmitModal(true)}
                                    className="w-full rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white"
                                >
                                    Submit Test
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Submit Confirmation Modal */}
                {showSubmitModal && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4">
                        <div className="max-w-md w-full rounded-3xl border bg-white dark:bg-slate-900 p-6 md:p-8 shadow-2xl space-y-6">
                            <div className="space-y-2">
                                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 grid place-items-center mb-4">
                                    <AlertTriangle className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Submit Your Assessment?
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    You have answered <span className="font-bold text-emerald-600">{answeredCount}</span> out of {currentMock.questions.length} questions.
                                    {unansweredCount > 0 && (
                                        <span className="block mt-1 text-amber-600 dark:text-amber-400 font-medium">
                                            ⚠️ You have {unansweredCount} unanswered question{unansweredCount === 1 ? "" : "s"}.
                                        </span>
                                    )}
                                    {reviewCount > 0 && (
                                        <span className="block mt-0.5 text-slate-500 text-xs">
                                            {reviewCount} question{reviewCount === 1 ? "" : "s"} marked for review.
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-muted-foreground space-y-1">
                                <div>• Time Remaining: <strong className="font-mono text-slate-900 dark:text-white">{formatTimer(timeLeft)}</strong></div>
                                <div>• Answers cannot be altered once submitted.</div>
                                <div>• Results and your leaderboard ranking will be displayed immediately.</div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowSubmitModal(false)}
                                    className="rounded-xl font-semibold"
                                >
                                    Return to Test
                                </Button>
                                <Button
                                    onClick={confirmSubmit}
                                    className="rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white"
                                >
                                    Yes, Submit Now
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // -------------------------------------------------------------------------
    // VIEW 3: RESULTS & SCORE ANALYSIS SCREEN
    // -------------------------------------------------------------------------
    if (stage === "results") {
        let correctCount = 0;
        let wrongCount = 0;
        let skippedCount = 0;
        let aiCorrect = 0;
        let techCorrect = 0;

        currentMock.questions.forEach((q, idx) => {
            const chosen = answers[idx];
            if (chosen === null) {
                skippedCount += 1;
            } else if (chosen === q.answer) {
                correctCount += 1;
                if (q.section === "AI Literacy") aiCorrect += 1;
                else techCorrect += 1;
            } else {
                wrongCount += 1;
            }
        });

        const scorePercent = Math.round((correctCount / currentMock.questions.length) * 100);
        const aiPercent = Math.round((aiCorrect / currentMock.aiCount) * 100);
        const techPercent = Math.round((techCorrect / currentMock.techCount) * 100);

        // Filtered questions for answer review
        const filteredQuestions = currentMock.questions.filter((q, idx) => {
            const chosen = answers[idx];
            const isCorrect = chosen === q.answer;
            if (reviewFilter === "correct") return isCorrect;
            if (reviewFilter === "wrong") return chosen !== null && !isCorrect;
            if (reviewFilter === "skipped") return chosen === null;
            return true;
        });

        return (
            <div className="max-w-5xl mx-auto space-y-8 pt-2 pb-16">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/dashboard/placement-material")}
                    className="-ml-3 text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Placement Prep
                </Button>

                {/* Score Hero Header Card */}
                <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white p-8 md:p-10 shadow-2xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-4 text-center md:text-left flex-1">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                                <Award className="h-3.5 w-3.5" /> Assessment Complete
                            </div>

                            <h1 className="text-3xl md:text-4xl font-black text-white">
                                {isAutoSubmitted ? "Time Expired — Test Submitted" : "Assessment Submitted Successfully"}
                            </h1>
                            <p className="text-slate-300 text-sm md:text-base max-w-xl font-light">
                                Great job, <span className="font-semibold text-white">{studentName || "Student"}</span>! You completed {currentMock.title} in {formatElapsed(elapsedSeconds)}.
                            </p>

                            {/* Rank Callout */}
                            {userRank && (
                                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold text-sm">
                                    <Trophy className="h-5 w-5 text-amber-400" />
                                    <span>Leaderboard Rank: #{userRank} among all students!</span>
                                </div>
                            )}
                        </div>

                        {/* Circular Score Gauge */}
                        <div className="flex flex-col items-center justify-center shrink-0">
                            <div className="relative h-36 w-36 rounded-full border-8 border-slate-800 bg-slate-900/80 flex items-center justify-center shadow-inner">
                                <div
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        background: `conic-gradient(#10b981 ${scorePercent * 3.6}deg, #1e293b 0deg)`,
                                        mask: "radial-gradient(transparent 58%, black 60%)",
                                        WebkitMask: "radial-gradient(transparent 58%, black 60%)"
                                    }}
                                />
                                <div className="text-center z-10">
                                    <span className="block text-3xl font-black text-white">{correctCount}/{currentMock.questions.length}</span>
                                    <span className="text-xs font-bold text-emerald-400">{scorePercent}% Score</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stat Badges Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-800">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                            <span className="block text-2xl font-bold text-emerald-400">{correctCount}</span>
                            <span className="text-xs text-slate-400">Correct Answers</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                            <span className="block text-2xl font-bold text-red-400">{wrongCount}</span>
                            <span className="text-xs text-slate-400">Incorrect Answers</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                            <span className="block text-2xl font-bold text-slate-400">{skippedCount}</span>
                            <span className="text-xs text-slate-400">Unanswered</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                            <span className="block text-2xl font-bold text-blue-400 font-mono">{formatElapsed(elapsedSeconds)}</span>
                            <span className="text-xs text-slate-400">Time Taken</span>
                        </div>
                    </div>
                </div>

                {/* Section-Wise Performance Breakdown */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <Card className="border shadow-sm p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                <h3 className="font-bold text-base">Section 1: AI Literacy</h3>
                            </div>
                            <span className="font-extrabold text-lg text-purple-600 dark:text-purple-400">
                                {aiCorrect} / {currentMock.aiCount}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground font-medium">
                                <span>Accuracy</span>
                                <span>{aiPercent}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-purple-600 transition-all duration-500 rounded-full"
                                    style={{ width: `${aiPercent}%` }}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Covers AI Foundations, Prompt Engineering, RAG &amp; Vector Embeddings, Responsible AI.
                        </p>
                    </Card>

                    <Card className="border shadow-sm p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                <h3 className="font-bold text-base">Section 2: Technical Assessment</h3>
                            </div>
                            <span className="font-extrabold text-lg text-emerald-600 dark:text-emerald-400">
                                {techCorrect} / {currentMock.techCount}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground font-medium">
                                <span>Accuracy</span>
                                <span>{techPercent}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
                                    style={{ width: `${techPercent}%` }}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Covers Programming Logic, DSA Complexity, OOP &amp; DBMS, Cloud &amp; Security Awareness.
                        </p>
                    </Card>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        onClick={() => {
                            const lb = document.getElementById("leaderboard-section");
                            if (lb) lb.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white gap-2"
                    >
                        <Trophy className="h-4 w-4" /> View Leaderboard Standings
                    </Button>
                    <Button
                        variant="outline"
                        onClick={startTest}
                        className="rounded-xl font-semibold gap-2"
                    >
                        <RotateCcw className="h-4 w-4" /> Retake Test #{currentMock.testNumber}
                    </Button>
                    <Link href={`/dashboard/placement-material/capgemini-mock/${nextTestId}`}>
                        <Button
                            variant="secondary"
                            className="rounded-xl font-semibold gap-2"
                        >
                            Next Mock Test #{nextTestNum} <ChevronRight className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        onClick={() => window.print()}
                        className="rounded-xl font-medium gap-2 text-muted-foreground"
                    >
                        <Printer className="h-4 w-4" /> Print Results
                    </Button>
                </div>

                {/* Question Review Section with Answers and Explanations */}
                <Card className="border shadow-md rounded-2xl p-6 md:p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 dark:border-slate-800">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                Detailed Answer Review &amp; Explanations
                            </h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Study each question with correct answers, choices, and comprehensive explanations.
                            </p>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
                            {(["all", "wrong", "skipped", "correct"] as const).map(tab => (
                                <Button
                                    key={tab}
                                    variant={reviewFilter === tab ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setReviewFilter(tab)}
                                    className={cn(
                                        "rounded-full text-xs font-semibold capitalize shrink-0",
                                        reviewFilter === tab && "shadow-sm"
                                    )}
                                >
                                    {tab === "all" ? "All Questions" : tab}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {filteredQuestions.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground">
                            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No questions in this filter.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredQuestions.map((q) => {
                                const origIdx = currentMock.questions.findIndex(x => x.id === q.id);
                                const selected = answers[origIdx];
                                const isCorrect = selected === q.answer;
                                const isSkipped = selected === null;

                                return (
                                    <details
                                        key={q.id}
                                        open
                                        className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-5 space-y-3 transition-colors open:bg-white dark:open:bg-slate-950 open:shadow-sm"
                                    >
                                        <summary className="flex items-start justify-between gap-4 cursor-pointer list-none font-semibold text-sm">
                                            <div className="flex items-start gap-3">
                                                <div className={cn(
                                                    "h-7 w-7 rounded-lg text-xs font-bold grid place-items-center shrink-0 mt-0.5",
                                                    isCorrect && "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
                                                    !isCorrect && !isSkipped && "bg-red-500/20 text-red-600 dark:text-red-400",
                                                    isSkipped && "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                                )}>
                                                    {origIdx + 1}
                                                </div>
                                                <div>
                                                    <span className="text-slate-900 dark:text-slate-100 font-semibold leading-relaxed">
                                                        {q.stem}
                                                    </span>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                        <span>{q.section}</span>
                                                        <span>•</span>
                                                        <span>{q.topic}</span>
                                                        <span>•</span>
                                                        <span>PDF Q{q.source}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="shrink-0">
                                                {isCorrect && (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                                                        <CheckCircle2 className="h-3.5 w-3.5" /> Correct (+1)
                                                    </span>
                                                )}
                                                {!isCorrect && !isSkipped && (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                                                        <XCircle className="h-3.5 w-3.5" /> Incorrect
                                                    </span>
                                                )}
                                                {isSkipped && (
                                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-200 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                                                        <HelpCircle className="h-3.5 w-3.5" /> Unanswered
                                                    </span>
                                                )}
                                            </div>
                                        </summary>

                                        {/* Options Breakdown */}
                                        <div className="pt-3 pl-10 space-y-2 text-sm border-t dark:border-slate-800">
                                            {q.options.map((opt, oIdx) => {
                                                const isRight = oIdx === q.answer;
                                                const wasChosen = oIdx === selected;

                                                return (
                                                    <div
                                                        key={oIdx}
                                                        className={cn(
                                                            "p-3 rounded-xl border text-xs md:text-sm flex items-start gap-3",
                                                            isRight && "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 font-medium",
                                                            wasChosen && !isRight && "border-red-500 bg-red-50/60 dark:bg-red-950/30 text-red-950 dark:text-red-100",
                                                            !isRight && !wasChosen && "border-slate-100 dark:border-slate-800/80 text-muted-foreground"
                                                        )}
                                                    >
                                                        <span className={cn(
                                                            "h-5 w-5 rounded font-bold text-xs grid place-items-center shrink-0 mt-0.5",
                                                            isRight && "bg-emerald-600 text-white",
                                                            wasChosen && !isRight && "bg-red-600 text-white",
                                                            !isRight && !wasChosen && "bg-slate-200 dark:bg-slate-800 text-muted-foreground"
                                                        )}>
                                                            {LETTERS[oIdx]}
                                                        </span>
                                                        <div className="flex-1">
                                                            <span>{opt}</span>
                                                            {isRight && (
                                                                <span className="ml-2 font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                                                                    ✓ Correct Answer
                                                                </span>
                                                            )}
                                                            {wasChosen && !isRight && (
                                                                <span className="ml-2 font-bold text-red-600 dark:text-red-400 text-xs">
                                                                    ✗ Your Answer
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {/* Explanation Box */}
                                            <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-xs text-blue-950 dark:text-blue-200 mt-3 space-y-1">
                                                <div className="font-bold flex items-center gap-1.5 text-blue-700 dark:text-blue-400">
                                                    <Sparkles className="h-3.5 w-3.5" /> Explanation
                                                </div>
                                                <p className="leading-relaxed">{q.explanation}</p>
                                            </div>
                                        </div>
                                    </details>
                                );
                            })}
                        </div>
                    )}
                </Card>

                {/* Embedded Live Leaderboard Section */}
                <div id="leaderboard-section" className="pt-4">
                    <CapgeminiLeaderboardView
                        initialTestFilter={currentMock.id}
                        highlightSubmissionId={submissionId}
                    />
                </div>
            </div>
        );
    }

    return null;
}
