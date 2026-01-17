"use client";

import { useState } from "react";
import { Check, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useScript } from "@/hooks/use-script"; // We'll create this or just inline
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

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleSubscribe = async (plan: "SEMESTER" | "YEARLY") => {
        setLoading(plan);
        const token = localStorage.getItem("token");

        try {
            // 1. Load Script
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                alert("Failed to load Razorpay SDK");
                setLoading(null);
                return;
            }

            // 2. Create Order
            const res = await fetch(`${API_BASE_URL}/subscription/create-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ plan_type: plan })
            });

            if (!res.ok) throw new Error("Failed to create order");
            const data: RazorpayOrder = await res.json();

            // 3. Open Checkout
            const options = {
                key: data.key_id,
                amount: data.amount,
                currency: data.currency,
                name: "ExamBuddy Premium",
                description: `${plan} Plan Subscription`,
                order_id: data.order_id,
                handler: async function (response: any) {
                    // Verify Payment
                    const verifyRes = await fetch(`${API_BASE_URL}/subscription/verify-payment`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            plan_type: plan
                        })
                    });

                    if (verifyRes.ok) {
                        alert("Subscription activated successfully!");
                        window.location.href = "/dashboard";
                    } else {
                        alert("Payment verification failed");
                    }
                },
                prefill: {
                    name: "Student Name",
                    email: "student@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#7c3aed"
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="container py-10 mx-auto">
            <div className="text-center mb-10 space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">Upgrade to Premium</h2>
                <p className="text-muted-foreground text-lg">
                    Unlock unlimited access to all notes, AI tutor, and previous year papers.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <Card className="relative overflow-hidden border-2 hover:border-purple-500 transition-colors">
                    <CardHeader>
                        <CardTitle className="text-2xl">Semester Plan</CardTitle>
                        <CardDescription>Perfect for current exam prep</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-4xl font-bold">₹499<span className="text-lg font-normal text-muted-foreground">/sem</span></div>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2"><Check className="text-green-500 h-4 w-4" /> Full Access to Notes</li>
                            <li className="flex items-center gap-2"><Check className="text-green-500 h-4 w-4" /> AI Professor Access</li>
                            <li className="flex items-center gap-2"><Check className="text-green-500 h-4 w-4" /> Exam Updates</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            onClick={() => handleSubscribe("SEMESTER")}
                            disabled={loading === "SEMESTER"}
                        >
                            {loading === "SEMESTER" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Subscribe Sem
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
                        <div className="text-4xl font-bold">₹99<span className="text-lg font-normal text-muted-foreground">/year</span></div>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2"><Check className="text-green-500 h-4 w-4" /> All Semester Features</li>
                            <li className="flex items-center gap-2"><Check className="text-green-500 h-4 w-4" /> Priority Support</li>
                            <li className="flex items-center gap-2"><Check className="text-green-500 h-4 w-4" /> Offline Downloads</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full bg-purple-600 hover:bg-purple-700"
                            onClick={() => handleSubscribe("YEARLY")}
                            disabled={loading === "YEARLY"}
                        >
                            {loading === "YEARLY" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Subscribe Year
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
