"use client";

import { API_BASE_URL } from "@/lib/config";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Book, Download, FileText, Loader2, Plus, Search, Eye } from "lucide-react";
import { NoteViewer } from "@/components/notes/note-viewer";

interface Note {
    id: string;
    title: string;
    subject: string;
    branch: string;
    semester: number;
    file_url: string;
    is_premium: boolean;
    uploaded_by: string;
    status: string;
    created_at: string;
    category: string;
}

export default function SessionalPapersPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Viewer State
    const [viewingNote, setViewingNote] = useState<Note | null>(null);

    // Upload Form State
    const [uploadLoading, setUploadLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        branch: "CSE",
        semester: 1,
        subject: "",
    });
    const [file, setFile] = useState<File | null>(null);
    const [selectedSemester, setSelectedSemester] = useState<number | "ALL">("ALL");

    // Fetch User Profile first
    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                // Fetch Profile
                const profileRes = await fetch(`${API_BASE_URL}/auth/me`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (profileRes.ok) {
                    const profile = await profileRes.json();
                    if (profile.semester) {
                        setSelectedSemester(profile.semester);
                        fetchNotes(profile.semester);
                        return;
                    }
                }
            } catch (e) {
                console.error("Profile fetch error", e);
            }
            fetchNotes(); // Fallback load all
        };
        init();
    }, []);

    const fetchNotes = async (semester?: number | "ALL") => {
        setIsLoading(true);
        try {
            let url = `${API_BASE_URL}/notes/?category=SESSIONAL_PAPER`;
            const semToFetch = semester !== undefined ? semester : selectedSemester;

            if (semToFetch !== "ALL") {
                url += `&semester=${semToFetch}`;
            }

            const token = localStorage.getItem("token");
            const headers: HeadersInit = {};
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const res = await fetch(url, { headers });
            if (res.ok) {
                const data = await res.json();
                setNotes(data);
            }
        } catch (error) {
            console.error("Failed to fetch notes", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setUploadLoading(true);
        const data = new FormData();
        data.append("title", formData.title);
        data.append("branch", formData.branch);
        data.append("semester", formData.semester.toString());
        data.append("subject", formData.subject);
        data.append("category", "SESSIONAL_PAPER"); // Hardcoded category
        data.append("file", file);

        // Get token
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${API_BASE_URL}/notes/upload`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: data,
            });

            if (res.ok) {
                setIsDialogOpen(false);
                fetchNotes(); // Refresh list
                setFormData({ title: "", branch: "CSE", semester: 1, subject: "" });
                setFile(null);
            } else {
                alert("Failed to upload note");
            }
        } catch (error) {
            console.error(error);
            alert("Error uploading note");
        } finally {
            setUploadLoading(false);
        }
    };

    const filteredNotes = notes.filter(
        (note) =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Sessional Papers</h2>
                    <p className="text-muted-foreground">
                        Browse and prepare with sessional exam papers.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Upload Paper
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <form onSubmit={handleUpload}>
                                <DialogHeader>
                                    <DialogTitle>Upload Sessional Paper</DialogTitle>
                                    <DialogDescription>
                                        Share verified sessional papers.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="e.g. Sessional 1 - 2024"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="branch">Branch</Label>
                                            <select
                                                id="branch"
                                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
                                                value={formData.branch}
                                                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                            >
                                                <option value="CSE">CSE</option>
                                                <option value="IT">IT</option>
                                                <option value="ECE">ECE</option>
                                                <option value="ME">ME</option>
                                            </select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="semester">Semester</Label>
                                            <Input
                                                id="semester"
                                                type="number"
                                                min={1}
                                                max={8}
                                                value={formData.semester}
                                                onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="subject">Subject</Label>
                                        <Input
                                            id="subject"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            placeholder="e.g. Data Structures"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="file">File (PDF/Image)</Label>
                                        <Input
                                            id="file"
                                            type="file"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                            required
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={uploadLoading}>
                                        {uploadLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Upload
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full md:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by title..."
                        className="pl-8 sm:w-[300px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-[200px]">
                    <select
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
                        value={selectedSemester}
                        onChange={(e) => {
                            const val = e.target.value === "ALL" ? "ALL" : parseInt(e.target.value);
                            setSelectedSemester(val);
                            fetchNotes(val);
                        }}
                    >
                        <option value="ALL">All Semesters</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                            <option key={s} value={s}>Semester {s}</option>
                        ))}
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="flex h-[200px] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
                </div>
            ) : filteredNotes.length === 0 ? (
                <div className="flex h-[200px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-center">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No papers found.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredNotes.map((note) => (
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
                                    <div className="rounded-full bg-slate-100 p-2 dark:bg-slate-800">
                                        <Book className="h-4 w-4 text-slate-500" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-3">
                                <div className="flex gap-2 text-xs text-muted-foreground">
                                    <span className="rounded-md bg-slate-100 px-2 py-1 font-medium dark:bg-slate-800">
                                        {note.branch}
                                    </span>
                                    <span className="rounded-md bg-slate-100 px-2 py-1 font-medium dark:bg-slate-800">
                                        Sem {note.semester}
                                    </span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                {note.file_url === "LOCKED" ? (
                                    <Button variant="secondary" className="w-full bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-100" asChild>
                                        <a href="/dashboard/subscription">
                                            <Book className="mr-2 h-4 w-4" /> Unlock Premium
                                        </a>
                                    </Button>
                                ) : note.is_premium ? (
                                    <Button
                                        variant="secondary"
                                        className="w-full"
                                        onClick={() => setViewingNote(note)}
                                    >
                                        <Eye className="mr-2 h-4 w-4" /> View Paper
                                    </Button>
                                ) : (
                                    <Button variant="secondary" className="w-full" size="sm" asChild>
                                        <a href={note.file_url} target="_blank" rel="noopener noreferrer">
                                            <Download className="mr-2 h-4 w-4" /> Download
                                        </a>
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Note Viewer Modal */}
            {viewingNote && (
                <NoteViewer
                    isOpen={!!viewingNote}
                    onClose={() => setViewingNote(null)}
                    title={viewingNote.title}
                    fileUrl={viewingNote.file_url}
                />
            )}
        </div>
    );
}
