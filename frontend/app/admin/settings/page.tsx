"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { API_BASE_URL } from "@/lib/config";

import { Loader2, Save, Users } from "lucide-react";

interface Setting {
    key: string;
    value: string;
    description?: string;
}

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<Record<string, string>>({
        semester_price: "499",
        yearly_price: "999"
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [liveUsers, setLiveUsers] = useState<number | null>(null);

    useEffect(() => {
        fetchSettings();
        fetchLiveUsers();
    }, []);

    const fetchLiveUsers = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_BASE_URL}/admin/stats/live`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setLiveUsers(data.live_users);
            }
        } catch (error) {
            console.error("Failed to load live users", error);
        }
    };

    const fetchSettings = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_BASE_URL}/admin/settings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data: Setting[] = await res.json();
                const newSettings = { ...settings };
                data.forEach(s => {
                    newSettings[s.key] = s.value;
                });
                setSettings(newSettings);
            }
        } catch (error) {
            console.error("Failed to load settings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        const token = localStorage.getItem("token");
        try {
            // Save Semester Price
            await fetch(`${API_BASE_URL}/admin/settings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    key: "semester_price",
                    value: settings.semester_price,
                    description: "Price for Semester Plan (INR)"
                })
            });

            // Save Yearly Price
            await fetch(`${API_BASE_URL}/admin/settings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    key: "yearly_price",
                    value: settings.yearly_price,
                    description: "Price for Yearly Plan (INR)"
                })
            });

            alert("Settings saved successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <DashboardHeader
                heading="System Settings"
                text="Manage global configuration and pricing."
            />

            <Card>
                <CardHeader>
                    <CardTitle>Subscription Pricing</CardTitle>

                    <CardDescription>Set the prices for Semester and Yearly plans.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Live Users Widget inside or outside? Maybe outside is better, but inside is fine for now as requested "in the admin setting" */}
                    <div className="flex items-center space-x-4 rounded-md border p-4">
                        <Users className="h-6 w-6 text-blue-500" />
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">Live Users (Active in last 5 min)</p>
                            <p className="text-sm text-muted-foreground">
                                {liveUsers !== null ? `${liveUsers} user(s) online` : "Loading..."}
                            </p>
                        </div>
                    </div>
                    {loading ? (
                        <div className="flex justify-center p-4">
                            <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="sem-price">Semester Plan Price (₹)</Label>
                                <Input
                                    id="sem-price"
                                    type="number"
                                    value={settings.semester_price}
                                    onChange={(e) => setSettings({ ...settings, semester_price: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="year-price">Yearly Plan Price (₹)</Label>
                                <Input
                                    id="year-price"
                                    type="number"
                                    value={settings.yearly_price}
                                    onChange={(e) => setSettings({ ...settings, yearly_price: e.target.value })}
                                />
                            </div>
                            <Button onClick={handleSave} disabled={saving}>
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
