"use client";

import { useState, useEffect } from "react";
import { Search, Briefcase, Code, Terminal, Clock, FileText, CheckCircle2, Circle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/config";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

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
    const companies = ["All", ...Array.from(new Set(materials.map(m => m.company)))];

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

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
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
