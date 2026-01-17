"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function PricingPage() {
    const [prices, setPrices] = useState({ semester: 499, yearly: 999 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/admin/public-config`);
                if (res.ok) {
                    const data = await res.json();
                    setPrices({
                        semester: data.semester_price || 499,
                        yearly: data.yearly_price || 999
                    });
                }
            } catch (error) {
                console.error("Failed to load prices", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPrices();
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                    <Link href="/" className="font-bold text-xl flex items-center gap-2">
                        <span>ExamBuddy</span>
                    </Link>
                    <nav className="hidden md:flex gap-6">
                        <Link href="/" className="text-sm font-medium hover:text-primary">Home</Link>
                        <Link href="/about" className="text-sm font-medium hover:text-primary">About</Link>
                    </nav>
                    <div className="flex gap-4">
                        <Link href="/login"><Button variant="ghost" size="sm">Login</Button></Link>
                        <Link href="/register"><Button size="sm">Get Started</Button></Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 py-12 md:py-24">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="inline-block rounded-lg bg-indigo-100 px-3 py-1 text-sm text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                            Transparent Pricing
                        </div>
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                            Choose Your Plan
                        </h1>
                        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Unlock premium notes, previous year papers, and unlimited AI assistance.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
                        </div>
                    ) : (
                        <div className="grid gap-8 pt-12 md:grid-cols-2 lg:gap-12 max-w-4xl mx-auto">
                            {/* Semester Plan */}
                            <Card className="flex flex-col border-slate-200 shadow-sm dark:border-slate-800 relative overflow-hidden">
                                <CardHeader>
                                    <CardTitle className="text-2xl">Semester Pass</CardTitle>
                                    <div className="text-4xl font-bold pt-2">
                                        ₹{prices.semester}<span className="text-lg font-normal text-muted-foreground">/sem</span>
                                    </div>
                                    <CardDescription>Perfect for focusing on current exams.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-4">
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Access to all Premium Notes</li>
                                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Download Previous Year Papers</li>
                                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Unlimited AI Tutor Queries</li>
                                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Valid for 6 months</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" asChild>
                                        <Link href="/dashboard/subscription">Get Started</Link>
                                    </Button>
                                </CardFooter>
                            </Card>

                            {/* Yearly Plan */}
                            <Card className="flex flex-col border-indigo-200 shadow-md dark:border-indigo-900 border-2 relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                                    POPULAR
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-2xl">Yearly Pass</CardTitle>
                                    <div className="text-4xl font-bold pt-2">
                                        ₹{prices.yearly}<span className="text-lg font-normal text-muted-foreground">/year</span>
                                    </div>
                                    <CardDescription>Best value for long-term success.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-4">
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-indigo-600" /> Everything in Semester Pass</li>
                                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-indigo-600" /> Priority Support</li>
                                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-indigo-600" /> Early Access to New Features</li>
                                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-indigo-600" /> Valid for 12 months</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700" asChild>
                                        <Link href="/dashboard/subscription">Get Yearly Access</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    )}
                </div>
            </main>

            <footer className="border-t py-6 bg-white dark:bg-slate-950">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-12 md:flex-row">
                    <p className="text-center text-sm text-muted-foreground">
                        © 2025 ExamBuddy. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
