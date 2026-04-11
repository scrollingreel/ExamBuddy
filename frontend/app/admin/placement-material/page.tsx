"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, RefreshCw, FolderPlus } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";

interface Material {
    id: string;
    title: string;
    company: string;
    category: string;
    type: string;
    questions_count: number;
}

interface Question {
    id: string;
    title: string;
    link: string;
}

export default function AdminPlacementPage() {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [selectedMaterialId, setSelectedMaterialId] = useState<string>("");
    const [questions, setQuestions] = useState<Question[]>([]);
    
    const [matForm, setMatForm] = useState({ title: "", company: "", category: "", type: "Coding Sheet" });
    const [qForm, setQForm] = useState({ title: "", link: "" });

    const fetchMaterials = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/placement/materials`);
            if (res.ok) setMaterials(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchQuestions = async (matId: string) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_BASE_URL}/placement/materials/${matId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setQuestions(data.questions || []);
            }
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    useEffect(() => {
        if (selectedMaterialId) {
            fetchQuestions(selectedMaterialId);
        } else {
            setQuestions([]);
        }
    }, [selectedMaterialId]);

    const handleCreateMaterial = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_BASE_URL}/placement/materials`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(matForm)
            });
            if (res.ok) {
                fetchMaterials();
                setMatForm({ title: "", company: "", category: "", type: "Coding Sheet" });
                alert("Material created!");
            }
        } catch (e) { console.error(e); }
    };

    const handleCreateQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMaterialId) return alert("Select a material first");
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_BASE_URL}/placement/materials/${selectedMaterialId}/questions`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(qForm)
            });
            if (res.ok) {
                fetchQuestions(selectedMaterialId);
                setQForm({ title: "", link: "" });
            }
        } catch (e) { console.error(e); }
    };

    const handleDeleteMaterial = async (id: string, e?: React.MouseEvent) => {
        if(e) e.stopPropagation();
        if (!confirm("Are you sure you want to delete this sheet and all its questions?")) return;
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_BASE_URL}/placement/materials/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                if(selectedMaterialId === id) setSelectedMaterialId("");
                fetchMaterials();
            }
        } catch (e) { console.error(e); }
    };

    const handleDeleteQuestion = async (id: string) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_BASE_URL}/placement/questions/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                fetchQuestions(selectedMaterialId);
            }
        } catch (e) { console.error(e); }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Placement Materials</h2>
                <p className="text-muted-foreground">Manage sheets, questions, and links.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create Sheet / Material</CardTitle>
                            <CardDescription>Add a new collection of questions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateMaterial} className="space-y-4">
                                <div>
                                    <Label>Title</Label>
                                    <Input required value={matForm.title} onChange={e => setMatForm({...matForm, title: e.target.value})} placeholder="e.g. TCS NQT 2024" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Company</Label>
                                        <Input required value={matForm.company} onChange={e => setMatForm({...matForm, company: e.target.value})} placeholder="e.g. TCS, Amazon" />
                                    </div>
                                    <div>
                                        <Label>Category</Label>
                                        <Input required value={matForm.category} onChange={e => setMatForm({...matForm, category: e.target.value})} placeholder="e.g. DSA, Aptitude" />
                                    </div>
                                </div>
                                <div>
                                    <Label>Type</Label>
                                    <select 
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={matForm.type} 
                                        onChange={e => setMatForm({...matForm, type: e.target.value})}
                                    >
                                        <option value="Coding Sheet">Coding Sheet</option>
                                        <option value="Previous Papers">Previous Papers</option>
                                        <option value="Interview Experience">Interview Experience</option>
                                        <option value="Crash Course">Crash Course</option>
                                        <option value="Mock Test">Mock Test</option>
                                        <option value="Tips & Tricks">Tips & Tricks</option>
                                    </select>
                                </div>
                                <Button type="submit" className="w-full"><FolderPlus className="h-4 w-4 mr-2" /> Create Sheet</Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Existing Sheets</CardTitle>
                            <CardDescription>Select a sheet to manage its questions.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {materials.map(m => (
                                <div 
                                    key={m.id} 
                                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${selectedMaterialId === m.id ? 'bg-primary/10 border-primary' : 'hover:bg-slate-50 dark:hover:bg-slate-900'}`}
                                    onClick={() => setSelectedMaterialId(m.id)}
                                >
                                    <div>
                                        <p className="font-semibold text-sm">{m.title}</p>
                                        <p className="text-xs text-muted-foreground">{m.company} • {m.category}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-red-500 h-8 w-8" onClick={(e) => handleDeleteMaterial(m.id, e)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            {materials.length === 0 && <p className="text-sm text-muted-foreground">No sheets found.</p>}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Manage Questions</CardTitle>
                            <CardDescription>
                                {selectedMaterialId ? (
                                    <span>Adding to: <strong className="text-foreground">{materials.find(m => m.id === selectedMaterialId)?.title}</strong></span>
                                ) : "Select a sheet from the left to add questions."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateQuestion} className="space-y-4">
                                <div>
                                    <Label>Question Title</Label>
                                    <Input required disabled={!selectedMaterialId} value={qForm.title} onChange={e => setQForm({...qForm, title: e.target.value})} placeholder="e.g. Reverse Linked List" />
                                </div>
                                <div>
                                    <Label>URL/Link</Label>
                                    <Input required disabled={!selectedMaterialId} type="url" value={qForm.link} onChange={e => setQForm({...qForm, link: e.target.value})} placeholder="https://leetcode.com/..." />
                                </div>
                                <Button type="submit" disabled={!selectedMaterialId} className="w-full">
                                    <Plus className="h-4 w-4 mr-2" /> Add Question
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {selectedMaterialId && (
                        <Card>
                            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Questions ({questions.length})</CardTitle>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => fetchQuestions(selectedMaterialId)}>
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
                                {questions.map((q, i) => (
                                    <div key={q.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2 text-sm">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{i + 1}. {q.title}</p>
                                            <a href={q.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline truncate block">
                                                {q.link}
                                            </a>
                                        </div>
                                        <Button variant="ghost" size="icon" className="shrink-0 text-red-500 h-8 w-8" onClick={() => handleDeleteQuestion(q.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {questions.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No questions added yet.</p>}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
