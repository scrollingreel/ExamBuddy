"use client";

import { API_BASE_URL } from "@/lib/config";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Download, ThumbsUp, ThumbsDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Note {
    id: string;
    title: string;
    vote_count: number;
    rating: number;
    status: string;
    file_url: string;
}

export default function ProfilePage() {
    const [uploads, setUploads] = useState<Note[]>([]);
    const [downloads, setDownloads] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const [upRes, downRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/auth/me/uploads`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${API_BASE_URL}/auth/me/downloads`, { headers: { Authorization: `Bearer ${token}` } })
                ]);

                if (upRes.ok) setUploads(await upRes.json());
                if (downRes.ok) setDownloads(await downRes.json());
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <Loader2 className="h-8 w-8 animate-spin mx-auto mt-20" />;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">My Profile & Statistics</h1>

            <Tabs defaultValue="uploads" className="w-full">
                <TabsList>
                    <TabsTrigger value="uploads">My Uploads ({uploads.length})</TabsTrigger>
                    <TabsTrigger value="downloads">Download History ({downloads.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="uploads">
                    <Card>
                        <CardHeader>
                            <CardTitle>Uploaded Notes</CardTitle>
                            <CardDescription>Track the performance of your contributions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {uploads.map(note => (
                                    <div key={note.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-medium">{note.title}</p>
                                            <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                                                <span className={`px-2 py-0.5 rounded text-xs ${note.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                    note.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {note.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 text-sm">
                                            <div className="flex items-center gap-1">
                                                <ThumbsUp className="h-4 w-4 text-blue-500" />
                                                <span>{note.vote_count}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 text-yellow-500" />
                                                <span>{note.rating?.toFixed(1) || "0.0"}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {uploads.length === 0 && <p className="text-muted-foreground text-center py-8">No uploads yet.</p>}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="downloads">
                    <Card>
                        <CardHeader>
                            <CardTitle>Download History</CardTitle>
                            <CardDescription>Notes you have accessed recently.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {downloads.map(note => (
                                    <div key={note.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                        <div className="font-medium">{note.title}</div>
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={note.file_url} target="_blank" rel="noopener noreferrer">
                                                <Download className="mr-2 h-4 w-4" /> Download Again
                                            </a>
                                        </Button>
                                    </div>
                                ))}
                                {downloads.length === 0 && <p className="text-muted-foreground text-center py-8">No downloads yet.</p>}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
