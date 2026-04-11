"use client";

import { useState } from "react";
import { Search, Briefcase, Code, Terminal, Clock, FileText, CheckCircle2, Circle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Dummy data for placement materials
const materials = [
    {
        id: 1,
        title: "TCS NQT 2024 Actual Papers",
        company: "TCS",
        category: "Aptitude",
        type: "Previous Papers",
        questions: 100,
        completed: 15,
        icon: Briefcase,
        color: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    },
    {
        id: 2,
        title: "Top 50 Amazon SDE 1 Questions",
        company: "Amazon",
        category: "DSA",
        type: "Coding Sheet",
        questions: 50,
        completed: 50,
        icon: Code,
        color: "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
    },
    {
        id: 3,
        title: "Google Interview Experience 2024",
        company: "Google",
        category: "Interview Experience",
        type: "Document",
        questions: 1,
        completed: 0,
        icon: FileText,
        color: "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
    },
    {
        id: 4,
        title: "System Design for Freshers",
        company: "General",
        category: "System Design",
        type: "Crash Course",
        questions: 20,
        completed: 5,
        icon: Terminal,
        color: "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
    },
    {
        id: 5,
        title: "Infosys Pseudo Code Questions",
        company: "Infosys",
        category: "Aptitude",
        type: "Mock Test",
        questions: 30,
        completed: 0,
        icon: Clock,
        color: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400",
    },
    {
        id: 6,
        title: "Accenture Communication Round",
        company: "Accenture",
        category: "HR",
        type: "Tips & Tricks",
        questions: 15,
        completed: 10,
        icon: Search,
        color: "bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400",
    }
];

const categories = ["All", "DSA", "System Design", "Aptitude", "HR", "Interview Experience"];
const companies = ["All", "TCS", "Amazon", "Google", "Infosys", "Accenture"];

export default function PlacementMaterialPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeCompany, setActiveCompany] = useState("All");

    const filteredMaterials = materials.filter(m => {
        const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.company.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === "All" || m.category === activeCategory;
        const matchesCompany = activeCompany === "All" || m.company === activeCompany;
        return matchesSearch && matchesCategory && matchesCompany;
    });

    return (
        <div className="flex-1 space-y-6 pt-2 pb-8">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Placement Material</h1>
                        <p className="text-muted-foreground mt-1">Nail your interviews with curated resources.</p>
                    </div>
                </div>

                {/* Search Bar */}
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

            {/* Quick Filters */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <span className="text-sm font-medium text-slate-500 shrink-0 mr-2">Topic:</span>
                    {categories.map(cat => (
                        <Button
                            key={cat}
                            variant={activeCategory === cat ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                                "rounded-full transition-all shrink-0",
                                activeCategory === cat ? "shadow-md" : "hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                        >
                            {cat}
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
                            onClick={() => setActiveCompany(comp)}
                            className="rounded-full transition-all shrink-0"
                        >
                            {comp}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
                {filteredMaterials.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>No materials found matching your filters.</p>
                    </div>
                ) : (
                    filteredMaterials.map((material) => {
                        const progress = material.questions > 0 ? Math.round((material.completed / material.questions) * 100) : 0;
                        const isDone = progress === 100;

                        return (
                            <div
                                key={material.id}
                                className="group relative flex flex-col justify-between rounded-2xl border bg-white dark:bg-slate-950 p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 cursor-pointer"
                            >
                                <div>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={cn("p-2.5 rounded-xl", material.color)}>
                                            <material.icon className="h-5 w-5" />
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
                                            {material.questions > 1 ? `${material.completed} / ${material.questions} Qs` : isDone ? "Completed" : "Not Started"}
                                        </span>
                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                            {progress}%
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                            className={cn(
                                                "h-full rounded-full transition-all duration-500",
                                                isDone ? "bg-green-500" : "bg-blue-600 dark:bg-blue-500"
                                            )}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
