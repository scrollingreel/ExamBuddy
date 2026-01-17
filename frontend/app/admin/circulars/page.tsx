"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Megaphone, Plus } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";

interface Circular {
    id: string;
    title: string;
    message: string;
    link: string;
    created_at: string;
}

export default function AdminCircularsPage() {
    const [circulars, setCirculars] = useState<Circular[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: "",
        message: "",
        link: ""
    });

    const fetchCirculars = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/circulars/`);
            if (res.ok) {
                const data = await res.json();
                setCirculars(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCirculars();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_BASE_URL}/circulars/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                fetchCirculars();
                setFormData({ title: "", message: "", link: "" });
            } else {
                const errorData = await res.json().catch(() => ({ detail: "Unknown error" }));
                console.error("Error creating circular:", res.status, errorData);
                alert(`Failed to create circular: ${errorData.detail || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("Error creating circular: Network error");
        }
    };

    const handleDelete = async (id: string) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_BASE_URL}/circulars/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (res.ok) {
                setCirculars(circulars.filter(c => c.id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Circulars & Announcements</h2>
                <p className="text-muted-foreground">Broadcast messages to all students.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Create Announcement</CardTitle>
                        <CardDescription>Post a new circular.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="message">Message (Optional)</Label>
                                <Textarea
                                    id="message"
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="link">Link (Optional)</Label>
                                <Input
                                    id="link"
                                    placeholder="https://"
                                    value={formData.link}
                                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                <Plus className="mr-2 h-4 w-4" /> Post Circular
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Active Circulars</h3>
                    {circulars.map((circular) => (
                        <Card key={circular.id} className="relative">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-base">{circular.title}</CardTitle>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(circular.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardDescription>
                                    {new Date(circular.created_at).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-3 text-sm">
                                <p className="mb-2">{circular.message}</p>
                                {circular.link && (
                                    <a href={circular.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                                        <Megaphone className="h-3 w-3" /> View Link
                                    </a>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                    {circulars.length === 0 && (
                        <p className="text-muted-foreground text-sm">No active circulars.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
