"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, FileText, Loader2, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";

interface Note {
    id: string;
    title: string;
    subject: string;
    branch: string;
    semester: number;
    file_url: string;
    status: string;
    uploaded_by: string;
    created_at: string;
}

export default function ApprovalsPage() {
    const [pendingNotes, setPendingNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchPendingNotes = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_BASE_URL}/notes/pending`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.status === 403 || res.status === 401) {
                alert("Unauthorized. Admins only.");
                router.push("/dashboard"); // Redirect if not admin
                return;
            }

            const data = await res.json();
            setPendingNotes(data);
        } catch (error) {
            console.error("Failed to fetch pending notes", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingNotes();
    }, []);

    const handleAction = async (noteId: string, action: "approve" | "reject") => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_BASE_URL}/notes/${noteId}/verify?action=${action}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                setPendingNotes((prev) => prev.filter((n) => n.id !== noteId));
            } else {
                const errorData = await res.json().catch(() => ({ detail: "Unknown error" }));
                console.error("Action failed:", res.status, errorData);
                alert(`Action failed: ${errorData.detail || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Network or parsing error:", error);
            alert("Error processing request. Check console for details.");
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Pending Approvals</h2>
                <p className="text-muted-foreground">
                    Review notes uploaded by students.
                </p>
            </div>

            {isLoading ? (
                <div className="flex h-[200px] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
                </div>
            ) : pendingNotes.length === 0 ? (
                <div className="flex h-[200px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-center">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No pending notes to review.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {pendingNotes.map((note) => (
                        <Card key={note.id}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="line-clamp-1 text-base">
                                            {note.title}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-1">
                                            {note.subject}
                                        </CardDescription>
                                    </div>
                                    <Badge variant="outline">Wait</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-3 text-sm text-muted-foreground space-y-2">
                                <div className="flex justify-between">
                                    <span>Branch: {note.branch}</span>
                                    <span>Sem: {note.semester}</span>
                                </div>
                                <div className="text-xs">ID: {note.id}</div>
                            </CardContent>
                            <CardFooter className="flex gap-2">
                                <Button
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                    size="sm"
                                    onClick={() => handleAction(note.id, "approve")}
                                >
                                    <Check className="mr-2 h-4 w-4" /> Approve
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="flex-1"
                                    size="sm"
                                    onClick={() => handleAction(note.id, "reject")}
                                >
                                    <X className="mr-2 h-4 w-4" /> Reject
                                </Button>
                                <Button variant="ghost" size="icon" asChild>
                                    <a href={note.file_url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
