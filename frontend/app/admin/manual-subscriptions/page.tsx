"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink, CheckCircle, XCircle } from "lucide-react";

interface ManualRequest {
    id: string;
    user_id: string;
    name: string;
    mobile_number: string;
    email: string;
    transaction_id: string;
    screenshot_url: string;
    plan_type: string;
    status: string;
    created_at: string;
}

export default function ManualSubscriptionsPage() {
    const [requests, setRequests] = useState<ManualRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRequests = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_BASE_URL}/subscription/admin/manual`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setRequests(await res.json());
            }
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const updateStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
        if (!confirm(`Are you sure you want to ${status.toLowerCase()} this request?`)) return;

        const token = localStorage.getItem("token");
        const data = new FormData();
        data.append("status", status);

        try {
            const res = await fetch(`${API_BASE_URL}/subscription/admin/manual/${id}/status`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` },
                body: data
            });

            if (res.ok) {
                alert(`Request ${status.toLowerCase()}`);
                fetchRequests();
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            alert("Error updating status");
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Manual Subscriptions</h2>
                <p className="text-muted-foreground">Approve or reject QR payment submissions.</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
                </div>
            ) : requests.length === 0 ? (
                <div className="border border-dashed rounded-lg p-12 text-center flex flex-col items-center">
                    <h3 className="text-lg font-medium">No requests</h3>
                    <p className="text-muted-foreground">There are no manual subscription requests.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {requests.map(req => (
                        <Card key={req.id}>
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">{req.name}</CardTitle>
                                        <CardDescription>{req.email}</CardDescription>
                                    </div>
                                    <Badge variant={req.status === 'APPROVED' ? 'default' : req.status === 'PENDING' ? 'secondary' : 'destructive'}>
                                        {req.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Mobile:</span>
                                    <span>{req.mobile_number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Plan:</span>
                                    <span className="font-semibold">{req.plan_type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">UTR:</span>
                                    <span className="font-mono text-xs">{req.transaction_id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Date:</span>
                                    <span>{new Date(req.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="pt-2">
                                    <a
                                        href={req.screenshot_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline flex items-center text-xs"
                                    >
                                        <ExternalLink className="h-3 w-3 mr-1" />
                                        View Screenshot
                                    </a>
                                </div>
                            </CardContent>
                            <CardFooter className="gap-2 border-t pt-4">
                                {req.status === "PENDING" ? (
                                    <>
                                        <Button
                                            className="w-full bg-green-600 hover:bg-green-700"
                                            onClick={() => updateStatus(req.id, "APPROVED")}
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" /> Approve
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            className="w-full"
                                            onClick={() => updateStatus(req.id, "REJECTED")}
                                        >
                                            <XCircle className="h-4 w-4 mr-2" /> Reject
                                        </Button>
                                    </>
                                ) : (
                                    <Button variant="outline" className="w-full" disabled>
                                        Action Taken
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
