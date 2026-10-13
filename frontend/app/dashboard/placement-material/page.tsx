"use client";

import { useState, useEffect } from "react";
import { Search, Briefcase, Code, Terminal, Clock, FileText, CheckCircle2, Circle, Trophy, Sparkles, Play, Award, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/config";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { CAPGEMINI_MOCK_TESTS } from "@/lib/capgemini-mock-data";

interface Material {
    id: string;
    title: string;
    company: string;
    category: string;
    type: string;
    questions_count: number;
    completed_count: number;
}

export default function PlacementMaterialPage() {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeCompany, setActiveCompany] = useState("All");

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/placement/materials`);
                if (res.ok) {
                    const data = await res.json();
                    setMaterials(data);
                }
            } catch (error) {
                console.error("Error fetching materials", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMaterials();
    }, []);

    const categories = ["All", ...Array.from(new Set(materials.map(m => m.category)))];
    const rawCompanies = Array.from(new Set(materials.map(m => m.company)));
    if (!rawCompanies.includes("Capgemini")) {
        rawCompanies.push("Capgemini");
    }
    const companies = ["All", ...rawCompanies];

    const filteredMaterials = materials.filter(m => {
        const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.company.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === "All" || m.category === activeCategory;
        const matchesCompany = activeCompany === "All" || m.company === activeCompany;
        return matchesSearch && matchesCategory && matchesCompany;
    });

    const getIconForType = (type: string) => {
        if (type.includes("Code") || type.includes("DSA")) return Code;
        if (type.includes("Paper") || type.includes("Test")) return Clock;
        if (type.includes("Design")) return Terminal;
        if (type.includes("Experience")) return FileText;
        return Briefcase;
    };

    const getColorForType = (type: string) => {
        if (type.includes("Code")) return "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400";
        if (type.includes("Paper")) return "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400";
        if (type.includes("Experience")) return "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400";
        return "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400";
    };

    return (
        <div className="flex-1 space-y-6 pt-2 pb-8">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Placement Material</h1>
                        <p className="text-muted-foreground mt-1">Nail your interviews with curated resources.</p>
                    </div>
                </div>

                <div className="relative max-w-2xl">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search for companies, topics, or experiences..."
                        className="pl-10 h-12 shadow-sm rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-base"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <span className="text-sm font-medium text-slate-500 shrink-0 mr-2">Topic:</span>
                    {categories.map(cat => (
                        <Button
                            key={cat}
                            variant={activeCategory === cat ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActiveCategory(cat as string)}
                            className={cn(
                                "rounded-full transition-all shrink-0",
                                activeCategory === cat ? "shadow-md" : "hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                        >
                            {cat as string}
                        </Button>
                    ))}
                </div>
                
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <span className="text-sm font-medium text-slate-500 shrink-0 mr-2">Company:</span>
                    {companies.map(comp => (
                        <Button
                            key={comp}
                            variant={activeCompany === comp ? "secondary" : "outline"}
                            size="sm"
                            onClick={() => setActiveCompany(comp as string)}
                            className="rounded-full transition-all shrink-0"
                        >
                            {comp as string}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Capgemini 2027 Mock Tests Featured Section */}
            {(activeCompany === "All" || activeCompany === "Capgemini" || searchQuery.toLowerCase().includes("cap") || searchQuery.toLowerCase().includes("mock") || searchQuery.toLowerCase().includes("ai")) && (
                <div className="space-y-4 pt-2">
                    <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1.5">
                                        <Sparkles className="h-3.5 w-3.5" /> Featured Assessment
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                                        5 Timed Mock Tests · 200 MCQs
                                    </span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                                    Capgemini 2027: AI Literacy &amp; Technical Assessment
                                </h2>
                                <p className="text-sm text-slate-300 max-w-2xl font-light">
                                    5 full-length, 30-minute scenario-based practice tests covering AI Foundations, Prompt Engineering, RAG &amp; Agents, Responsible AI, Programming Logic, DSA, and Cloud Systems.
                                </p>
                            </div>
                            <Link href="/dashboard/placement-material/capgemini-mock/leaderboard">
                                <Button className="rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-6 shadow-lg shadow-amber-500/20 gap-2 shrink-0">
                                    <Trophy className="h-5 w-5" /> View Student Leaderboard
                                </Button>
                            </Link>
                        </div>

                        {/* 5 Mock Test Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-6 pt-6 border-t border-slate-800">
                            {CAPGEMINI_MOCK_TESTS.map((test) => (
                                <Link
                                    key={test.id}
                                    href={`/dashboard/placement-material/capgemini-mock/${test.id}`}
                                    className="group relative flex flex-col justify-between p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/60 hover:border-blue-400 transition-all hover:-translate-y-1 shadow-sm"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                                                Test #{test.testNumber}
                                            </span>
                                            <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> 30m
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                                                Mock Test {test.testNumber}
                                            </h4>
                                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                                                40 MCQs · 20 AI + 20 Tech
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:text-blue-300">
                                        <span>Start Test</span>
                                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between pt-4">
                <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {activeCompany !== "All" ? `${activeCompany} Resources` : "All Practice Material & Sheets"}
                </h3>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-2">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-44 rounded-2xl" />
                    ))
                ) : filteredMaterials.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>No materials found matching your filters.</p>
                    </div>
                ) : (
                    filteredMaterials.map((material) => {
                        const progress = material.questions_count > 0 ? Math.round((material.completed_count / material.questions_count) * 100) : 0;
                        const isDone = progress === 100 && material.questions_count > 0;
                        const Icon = getIconForType(material.type);

                        return (
                            <Link
                                href={`/dashboard/placement-material/${material.id}`}
                                key={material.id}
                                className="group relative flex flex-col justify-between rounded-2xl border bg-white dark:bg-slate-950 p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 cursor-pointer block"
                            >
                                <div>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={cn("p-2.5 rounded-xl", getColorForType(material.type))}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                                            {material.company}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                                        {material.title}
                                    </h3>
                                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                            {material.type}
                                        </span>
                                        <span>•</span>
                                        <span>{material.category}</span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <div className="flex items-center justify-between text-xs mb-1.5">
                                        <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                                            {isDone ? (
                                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                            ) : (
                                                <Circle className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
                                            )}
                                            {material.questions_count > 0 ? `${material.completed_count} / ${material.questions_count} Qs` : "Link Collection"}
                                        </span>
                                        {material.questions_count > 0 && (
                                            <span className="font-medium text-slate-700 dark:text-slate-300">
                                                {progress}%
                                            </span>
                                        )}
                                    </div>
                                    {material.questions_count > 0 && (
                                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div 
                                                className={cn(
                                                    "h-full rounded-full transition-all duration-500",
                                                    isDone ? "bg-green-500" : "bg-blue-600 dark:bg-blue-500"
                                                )}
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
}
