"use client";

import { useState, useEffect } from "react";
import { Check, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useScript } from "@/hooks/use-script";
import { API_BASE_URL } from "@/lib/config";

interface RazorpayOrder {
    order_id: string;
    amount: number;
    currency: string;
    key_id: string;
    plan: string;
}

export default function SubscriptionPage() {
    const [loading, setLoading] = useState<string | null>(null);
    const [isPricesLoading, setIsPricesLoading] = useState(true);
    const [prices, setPrices] = useState({ semester: 0, yearly: 0 });

    // Manual Subscription State
    const [isManualOpen, setIsManualOpen] = useState(false);
    const [manualPlan, setManualPlan] = useState<"SEMESTER" | "YEARLY">("SEMESTER");
    const [manualForm, setManualForm] = useState({
        name: "",
        mobile_number: "",
        email: "",
        transaction_id: ""
    });
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [manualLoading, setManualLoading] = useState(false);

    useEffect(() => {
        const fetchPrices = async () => {
            // Check cache
            const cached = localStorage.getItem("subscription_prices");
            if (cached) {
                try {
                    const { data, timestamp } = JSON.parse(cached);
                    // Cache valid for 1 hour
                    if (Date.now() - timestamp < 3600000) {
                        setPrices(data);
                        setIsPricesLoading(false);
                        return;
                    }
                } catch (e) {
                    localStorage.removeItem("subscription_prices");
                }
            }

            try {
                const res = await fetch(`${API_BASE_URL}/admin/public-config`);
                if (res.ok) {
                    const data = await res.json();
                    const newPrices = {
                        semester: data.semester_price || 499,
                        yearly: data.yearly_price || 999
                    };
                    setPrices(newPrices);
                    localStorage.setItem("subscription_prices", JSON.stringify({
                        data: newPrices,
                        timestamp: Date.now()
                    }));
                } else {
                    // Fallback defaults if fetch fails but no error thrown
                    setPrices({ semester: 499, yearly: 999 });
                }
            } catch (error) {
                console.error("Failed to load prices", error);
                setPrices({ semester: 499, yearly: 999 });
            } finally {
                setIsPricesLoading(false);
            }
        };
        fetchPrices();
    }, []);


    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!screenshot) return alert("Please upload a screenshot");

        setManualLoading(true);
        const token = localStorage.getItem("token");

        const data = new FormData();
        data.append("name", manualForm.name);
        data.append("mobile_number", manualForm.mobile_number);
        data.append("email", manualForm.email);
        data.append("transaction_id", manualForm.transaction_id);
        data.append("plan_type", manualPlan);
        data.append("file", screenshot);

        try {
            const res = await fetch(`${API_BASE_URL}/subscription/manual-subscribe`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: data
            });

            if (res.ok) {
                alert("Subscription request submitted! Admins will review it soon.");
                setIsManualOpen(false);
                setManualForm({ name: "", mobile_number: "", email: "", transaction_id: "" });
                setScreenshot(null);
            } else {
                alert("Failed to submit request.");
            }
        } catch (error) {
            alert("Error submitting manual request");
        } finally {
            setManualLoading(false);
        }
    };

    return (
        <div className="container py-10 mx-auto">
            <div className="text-center mb-10 space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">Upgrade to Premium</h2>
                <p className="text-muted-foreground text-lg">
                    Unlock unlimited access to all notes, AI tutor, and previous year papers.
                </p>
                <p className="text-primary font-semibold text-lg mt-2">
                    This feature will be available soon
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <Card className="relative overflow-hidden border-2 hover:border-purple-500 transition-colors">
                    <CardHeader>
                        <CardTitle className="text-2xl">Semester Plan</CardTitle>
                        <CardDescription>Perfect for current exam prep</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isPricesLoading ? (
                            <div className="h-10 w-32 bg-slate-200 animate-pulse rounded" />
                        ) : (
                            <div className="text-4xl font-bold">₹{prices.semester}<span className="text-lg font-normal text-muted-foreground">/sem</span></div>
                        )}
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2"><Check className="text-green-500 h-4 w-4" /> Full Access to Notes</li>
                            <li className="flex items-center gap-2"><Check className="text-green-500 h-4 w-4" /> AI Professor Access</li>
                            <li className="flex items-center gap-2"><Check className="text-green-500 h-4 w-4" /> Exam Updates</li>
                        </ul>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button
                            className="w-full"
                            onClick={() => { setManualPlan("SEMESTER"); setIsManualOpen(true); }}
                        >
                            Pay Manually (QR)
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="relative overflow-hidden border-2 border-purple-500 shadow-lg scale-105">
                    <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                        POPULAR
                    </div>
                    <CardHeader>
                        <CardTitle className="text-2xl">Yearly Plan</CardTitle>
                        <CardDescription>Best value for serious students</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isPricesLoading ? (
                            <div className="h-10 w-32 bg-slate-200 animate-pulse rounded" />
                        ) : (
                            <div className="text-4xl font-bold">₹{prices.yearly}<span className="text-lg font-normal text-muted-foreground">/year</span></div>
                        )}
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2"><Check className="text-green-500 h-4 w-4" /> All Semester Features</li>
                            <li className="flex items-center gap-2"><Check className="text-green-500 h-4 w-4" /> Priority Support</li>
                            <li className="flex items-center gap-2"><Check className="text-green-500 h-4 w-4" /> Offline Downloads</li>
                        </ul>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button
                            className="w-full bg-purple-600 hover:bg-purple-700"
                            onClick={() => { setManualPlan("YEARLY"); setIsManualOpen(true); }}
                        >
                            Pay Manually (QR)
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {/* Manual Payment Dialog */}
            <Dialog open={isManualOpen} onOpenChange={setIsManualOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Manual Payment Integration</DialogTitle>
                        <DialogDescription>
                            Scan the QR below to pay ₹{manualPlan === "YEARLY" ? prices.yearly : prices.semester} and upload the transaction details.
                        </DialogDescription>
                    </DialogHeader>

                    {/* QR Code and UPI ID section temporarily removed
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="bg-slate-100 p-4 rounded-lg flex items-center justify-center">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=dummy@upi&pn=ExamBuddy&cu=INR" alt="QR Code" className="w-40 h-40" />
                        </div>
                        <p className="text-sm text-slate-500 font-mono">UPI: dummy@upi</p>
                    </div>
                    */}

                    <form onSubmit={handleManualSubmit} className="space-y-4 mt-4">
                        <div className="grid gap-2">
                            <Label>Full Name</Label>
                            <Input value={manualForm.name} onChange={e => setManualForm({ ...manualForm, name: e.target.value })} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Mobile Number</Label>
                                <Input value={manualForm.mobile_number} onChange={e => setManualForm({ ...manualForm, mobile_number: e.target.value })} required />
                            </div>
                            <div className="grid gap-2">
                                <Label>Registered Email</Label>
                                <Input type="email" value={manualForm.email} onChange={e => setManualForm({ ...manualForm, email: e.target.value })} required />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Transaction ID (UTR)</Label>
                            <Input value={manualForm.transaction_id} onChange={e => setManualForm({ ...manualForm, transaction_id: e.target.value })} placeholder="e.g. 123456789012" required />
                        </div>
                        <div className="grid gap-2">
                            <Label>Payment Screenshot</Label>
                            <Input type="file" onChange={e => setScreenshot(e.target.files?.[0] || null)} required accept="image/*" />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={manualLoading} className="w-full">
                                {manualLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Request
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
