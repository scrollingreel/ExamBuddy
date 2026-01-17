import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Users, Globe, Award } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                    <Link href="/" className="font-bold text-xl flex items-center gap-2">
                        <span>ExamBuddy</span>
                    </Link>
                    <nav className="hidden md:flex gap-6">
                        <Link href="/" className="text-sm font-medium hover:text-primary">Home</Link>
                        <Link href="/pricing" className="text-sm font-medium hover:text-primary">Pricing</Link>
                    </nav>
                    <div className="flex gap-4">
                        <Link href="/login"><Button variant="ghost" size="sm">Login</Button></Link>
                        <Link href="/register"><Button size="sm">Get Started</Button></Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-slate-950 border-b">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                                Empowering Students to Excel
                            </h1>
                            <p className="max-w-[700px] text-muted-foreground md:text-xl">
                                ExamBuddy is more than just a notes app. It's a comprehensive platform designed to bridge the gap between resources and results for university students.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50 dark:bg-slate-900">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-2">
                                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                    <BookOpen className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold">Our Mission</h3>
                                <p className="text-muted-foreground">
                                    To provide democratized access to high-quality education resources, ensuring every student has the tools they need to succeed regardless of their background.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                    <Users className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold">Community Driven</h3>
                                <p className="text-muted-foreground">
                                    Built by students, for students. We believe in the power of community collaboration, sharing notes, and peer support to lift everyone up.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                                    <Award className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold">Academic Excellence</h3>
                                <p className="text-muted-foreground">
                                    We verify all content with university toppers and faculty to ensure that you are studying the right material for your exams.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="w-full py-12 md:py-24 lg:py-32 bg-indigo-600 text-white">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                                Join 10,000+ Students Today
                            </h2>
                            <p className="max-w-[600px] text-indigo-100 md:text-xl">
                                Start your journey towards better grades and less stress.
                            </p>
                            <Link href="/register">
                                <Button size="lg" variant="secondary" className="px-8">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
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
