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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Edit, FileText, ExternalLink, Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface Note {
    id: string;
    title: string;
    subject: string;
    branch: string;
    semester: number;
    file_url: string;
    status: string;
    is_premium: boolean;
    uploaded_by: string;
    created_at: string;
    category: string;
    year?: number;
}

export default function AdminNotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Edit/Create State
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        subject: "",
        branch: "",
        semester: "",
        is_premium: false,
        category: "NOTE",
        year: "",
    });
    const [file, setFile] = useState<File | null>(null);

    const router = useRouter();

    const fetchNotes = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://127.0.0.1:8000/notes/admin/all", {
                headers: { "Authorization": `Bearer ${token}` }
            });
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

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this note?")) return;

        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://127.0.0.1:8000/notes/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setNotes(notes.filter(n => n.id !== id));
            } else {
                alert("Failed to delete note");
            }
        } catch (error) {
            alert("Error deleting note");
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const data = new FormData();
        data.append("title", formData.title);
        data.append("subject", formData.subject);
        data.append("branch", formData.branch);
        data.append("semester", formData.semester);
        data.append("is_premium", formData.is_premium.toString());
        data.append("category", formData.category);
        if (formData.year) data.append("year", formData.year);
        if (file) data.append("file", file);

        try {
            const res = await fetch("http://127.0.0.1:8000/notes/upload", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: data
            });
            if (res.ok) {
                setIsUploadOpen(false);
                fetchNotes(); // Refresh list
                setFormData({ title: "", subject: "", branch: "", semester: "", is_premium: false, category: "NOTE", year: "" });
                setFile(null);
            } else {
                alert("Upload failed");
            }
        } catch (error) {
            alert("Error uploading note");
        }
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedNote) return;

        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://127.0.0.1:8000/notes/${selectedNote.id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: formData.title,
                    status: selectedNote.status, // Keep existing status or allow edit
                    is_premium: formData.is_premium
                })
            });
            if (res.ok) {
                setIsEditOpen(false);
                fetchNotes();
            } else {
                alert("Update failed");
            }
        } catch (error) {
            alert("Error updating note");
        }
    };

    const filteredNotes = notes.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Manage Notes</h2>
                    <p className="text-muted-foreground">View, upload, and manage all platform notes.</p>
                </div>
                <Button onClick={() => setIsUploadOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Upload Note
                </Button>
            </div>

            <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            {isLoading ? (
                <div className="flex h-[200px] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredNotes.map((note) => (
                        <Card key={note.id}>
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="line-clamp-1">{note.title}</CardTitle>
                                        <CardDescription>{note.subject}</CardDescription>
                                    </div>
                                    <Badge variant={note.status === 'APPROVED' ? 'default' : note.status === 'PENDING' ? 'secondary' : 'destructive'}>
                                        {note.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span>Branch: {note.branch}</span>
                                    <span>Sem: {note.semester}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground text-xs">ID: {note.id.slice(0, 8)}...</span>
                                    {note.is_premium && <Badge variant="outline" className="border-yellow-500 text-yellow-600">Premium</Badge>}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between gap-2">
                                <Button variant="ghost" size="sm" asChild>
                                    <a href={note.file_url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                </Button>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => {
                                        setSelectedNote(note);
                                        setFormData({
                                            title: note.title,
                                            subject: note.subject,
                                            branch: note.branch,
                                            semester: note.semester.toString(),
                                            is_premium: note.is_premium,
                                            category: note.category || "NOTE",
                                            year: note.year ? note.year.toString() : ""
                                        });
                                        setIsEditOpen(true);
                                    }}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(note.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Upload Dialog */}
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload New Note</DialogTitle>
                        <DialogDescription>
                            Admin uploads are automatically approved.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="branch">Branch</Label>
                                <Input id="branch" value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })} required />
                            </div>
                            <div>
                                <Label htmlFor="semester">Semester</Label>
                                <Input id="semester" type="number" value={formData.semester} onChange={e => setFormData({ ...formData, semester: e.target.value })} required />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} required />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_premium"
                                checked={formData.is_premium}
                                onChange={e => setFormData({ ...formData, is_premium: e.target.checked })}
                                className="h-4 w-4"
                            />
                            <Label htmlFor="is_premium">Premium Content?</Label>
                        </div>
                        <div>
                            <Label htmlFor="category">Category</Label>
                            <select
                                id="category"
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="NOTE">Note</option>
                                <option value="SESSIONAL_PAPER">Sessional Paper</option>
                                <option value="UNIVERSITY_PAPER">University Paper</option>
                            </select>
                        </div>
                        {formData.category === "UNIVERSITY_PAPER" && (
                            <div>
                                <Label htmlFor="year">Year</Label>
                                <Input
                                    id="year"
                                    type="number"
                                    placeholder="e.g. 2023"
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                />
                            </div>
                        )}
                        <div>
                            <Label htmlFor="file">File</Label>
                            <Input id="file" type="file" onChange={e => setFile(e.target.files?.[0] || null)} required />
                        </div>
                        <DialogFooter>
                            <Button type="submit">Upload Note</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Note</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4">
                        <div>
                            <Label htmlFor="edit-title">Title</Label>
                            <Input id="edit-title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="edit-premium"
                                checked={formData.is_premium}
                                onChange={e => setFormData({ ...formData, is_premium: e.target.checked })}
                                className="h-4 w-4"
                            />
                            <Label htmlFor="edit-premium">Premium Content?</Label>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
