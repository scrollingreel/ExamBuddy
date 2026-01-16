"use client";

import { API_BASE_URL } from "@/lib/config";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Crown, Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [user, setUser] = useState({
        email: "",
        full_name: "",
        mobile_number: "",
        semester: "",
        cgpa: "",
        target_cgpa: "",
        study_hours: "",
        is_premium: false
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await fetch(`${API_BASE_URL}/auth/me`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser({
                        ...data,
                        full_name: data.full_name || "",
                        mobile_number: data.mobile_number || "",
                        semester: data.semester ? String(data.semester) : "",
                        cgpa: data.cgpa ? String(data.cgpa) : "",
                        target_cgpa: data.target_cgpa ? String(data.target_cgpa) : "",
                        study_hours: data.study_hours ? String(data.study_hours) : "0"
                    });
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setFetching(false);
            }
        };

        fetchProfile();
    }, []);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${API_BASE_URL}/auth/me`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    full_name: user.full_name,
                    mobile_number: user.mobile_number,
                    semester: user.semester ? parseInt(user.semester) : null,
                    cgpa: user.cgpa && !isNaN(parseFloat(user.cgpa)) ? parseFloat(user.cgpa) : null,
                    target_cgpa: user.target_cgpa && !isNaN(parseFloat(user.target_cgpa)) ? parseFloat(user.target_cgpa) : null,
                    study_hours: user.study_hours && !isNaN(parseFloat(user.study_hours)) ? parseFloat(user.study_hours) : 0
                })
            });

            const data = await res.json();
            console.log("Update Response:", res.status, data);

            if (res.ok) {
                alert("Profile Updated Successfully!");
                // refresh profile
                setUser(prev => ({ ...prev, ...data }));
            } else {
                alert("Failed to update profile.");
            }
        } catch (error) {
            console.error(error);
            alert("Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="flex h-40 items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your account settings and profile.
                </p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>
                            Update your personal details.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleUpdateProfile}>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Email</Label>
                                <Input value={user.email} disabled />
                            </div>
                            <div className="grid gap-2">
                                <Label>Full Name</Label>
                                <Input
                                    value={user.full_name}
                                    onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Mobile Number</Label>
                                <Input
                                    value={user.mobile_number}
                                    onChange={(e) => setUser({ ...user, mobile_number: e.target.value })}
                                    placeholder="Enter mobile number"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Semester</Label>
                                <Select
                                    value={user.semester}
                                    onValueChange={(val) => setUser({ ...user, semester: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Semester" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                            <SelectItem key={sem} value={String(sem)}>Semester {sem}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Current CGPA</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="10"
                                        value={user.cgpa}
                                        onChange={(e) => setUser({ ...user, cgpa: e.target.value })}
                                        placeholder="8.5"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Target CGPA</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="10"
                                        value={user.target_cgpa}
                                        onChange={(e) => setUser({ ...user, target_cgpa: e.target.value })}
                                        placeholder="9.0"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Total Study Hours</Label>
                                <Input
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    value={user.study_hours}
                                    onChange={(e) => setUser({ ...user, study_hours: e.target.value })}
                                    placeholder="e.g. 25.5"
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <Card className={user.is_premium ? "border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10" : ""}>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <CardTitle>Subscription Plan</CardTitle>
                            {user.is_premium && <Crown className="h-5 w-5 text-yellow-600" />}
                        </div>
                        <CardDescription>
                            {user.is_premium ? "You are a Premium member!" : "Upgrade to access exclusive features."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex items-center justify-between rounded-lg border p-4 border-indigo-200 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-950/30">
                            <div className="space-y-0.5">
                                <div className="font-medium text-indigo-900 dark:text-indigo-100">Premium Access</div>
                                <div className="text-sm text-indigo-600 dark:text-indigo-300">Unlock all notes and AI features</div>
                            </div>
                            {user.is_premium ? (
                                <div className="text-sm font-bold text-green-600">Active</div>
                            ) : (
                                <Button onClick={() => window.location.href = "/dashboard/subscription"} type="button">
                                    <Crown className="mr-2 h-4 w-4 text-yellow-500" />
                                    Upgrade now
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
