"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Question {
    id: string;
    title: string;
    link: string;
    is_completed: boolean;
}

interface MaterialDetail {
    id: string;
    title: string;
    company: string;
    category: string;
    type: string;
    questions_count: number;
    completed_count: number;
    questions: Question[];
}

export default function PlacementMaterialDetailPage() {
    const params = useParams();
    const router = useRouter();
    const materialId = params.id as string;
    
    const [material, setMaterial] = useState<MaterialDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const fetchMaterial = async () => {
        const token = localStorage.getItem("token");
        try {
            const headers: Record<string, string> = {};
            if (token && token !== "null" && token !== "undefined") {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const res = await fetch(`${API_BASE_URL}/placement/materials/${materialId}`, {
                headers
            });
            if (res.ok) {
                setMaterial(await res.json());
            } else {
                const text = await res.text();
                console.error("Failed to fetch material:", res.status, text);
                setErrorMsg(`Server Error: ${res.status}. ${text}`);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (materialId) fetchMaterial();
    }, [materialId]);

    const toggleQuestion = async (qId: string) => {
        const token = localStorage.getItem("token");
        try {
            // Optimistic update
            setMaterial(prev => {
                if (!prev) return prev;
                const newQuestions = prev.questions.map(q => {
                    if (q.id === qId) {
                        const newIsCompleted = !q.is_completed;
                        return { ...q, is_completed: newIsCompleted };
                    }
                    return q;
                });
                const completed_count = newQuestions.filter(q => q.is_completed).length;
                return { ...prev, questions: newQuestions, completed_count };
            });

            await fetch(`${API_BASE_URL}/placement/questions/${qId}/toggle-progress`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6 pt-2 pb-8 max-w-4xl mx-auto">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-32" />
                <div className="space-y-3 mt-6">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            </div>
        );
    }

    if (errorMsg) {
        return (
            <div className="space-y-6 pt-2 pb-8 max-w-4xl mx-auto">
                <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/placement-material")} className="-ml-3 text-muted-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Materials
                </Button>
                <div className="p-6 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-900">
                    <h3 className="font-semibold mb-2">Error Loading Resource</h3>
                    <p className="text-sm font-mono break-all">{errorMsg}</p>
                </div>
            </div>
        );
    }

    if (!material) return null;

    const progress = material.questions_count > 0 ? Math.round((material.completed_count / material.questions_count) * 100) : 0;

    return (
        <div className="space-y-6 pt-2 pb-8 max-w-4xl mx-auto">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/placement-material")} className="-ml-3 text-muted-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Materials
            </Button>
            
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-medium">
                        {material.company}
                    </span>
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-2.5 py-0.5 rounded-full font-medium">
                        {material.category}
                    </span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {material.title}
                </h1>
                
                {material.questions_count > 0 && (
                    <div className="mt-4 p-4 rounded-xl border bg-white dark:bg-slate-950 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium">Your Progress</p>
                            <p className="text-xs text-muted-foreground">{material.completed_count} of {material.questions_count} completed</p>
                        </div>
                        <div className="flex items-center gap-4 flex-1 md:max-w-md w-full">
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                            </div>
                            <span className="text-sm font-medium w-9 text-right">{progress}%</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-3 mt-8">
                <h3 className="text-lg font-semibold mb-4">Questions & Links</h3>
                {material.questions.length === 0 ? (
                    <p className="text-muted-foreground text-sm py-4 text-center border rounded-xl bg-slate-50/50 dark:bg-slate-900/50">No questions have been added to this sheet yet.</p>
                ) : (
                    material.questions.map((q, i) => (
                        <div 
                            key={q.id} 
                            className={`flex sm:items-center flex-col sm:flex-row gap-4 p-4 rounded-xl border transition-colors ${q.is_completed ? 'bg-green-50/50 border-green-200 dark:bg-green-950/20 dark:border-green-900/30' : 'bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/50'}`}
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <Checkbox 
                                    id={`q-${q.id}`} 
                                    checked={q.is_completed} 
                                    onCheckedChange={() => toggleQuestion(q.id)}
                                    className={q.is_completed ? "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500" : ""}
                                />
                                <div className="grid gap-1.5 min-w-0 flex-1">
                                    <label 
                                        htmlFor={`q-${q.id}`} 
                                        className={`text-sm font-medium leading-tight cursor-pointer ${q.is_completed ? 'text-muted-foreground line-through decoration-slate-300 dark:decoration-slate-600' : ''}`}
                                    >
                                        {i + 1}. {q.title}
                                    </label>
                                    <a href={q.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:underline flex items-center gap-1 w-fit">
                                        {q.link.length > 60 ? q.link.substring(0, 60) + "..." : q.link} <ExternalLink className="h-3 w-3 inline" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
