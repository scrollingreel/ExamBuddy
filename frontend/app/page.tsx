"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, ShieldCheck, Sparkles, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 font-sans">
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.05 }}
              className="bg-indigo-600 rounded-lg p-1 text-white"
            >
              <BookOpen className="h-5 w-5" />
            </motion.div>
            <span>ExamBuddy</span>
          </div>
          <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
            <Link className="text-sm font-medium hover:text-indigo-600 transition-colors relative group" href="#features">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link className="text-sm font-medium hover:text-indigo-600 transition-colors relative group" href="/pricing">
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link className="text-sm font-medium hover:text-indigo-600 transition-colors relative group" href="/about">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="hover:text-indigo-600 text-slate-600 dark:text-slate-300">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 transition-transform hover:scale-105 active:scale-95">Get Started</Button>
            </Link>
          </div>
        </div>
      </motion.header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 md:pt-24 lg:pt-32 pb-12 md:pb-24 lg:pb-32">
          {/* Background Gradients */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-slate-950 [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:[background:radial-gradient(125%_125%_at_50%_10%,#020617_40%,#312e81_100%)] opacity-70"></div>

          <div className="container mx-auto flex max-w-[64rem] flex-col items-center gap-4 text-center px-4">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 backdrop-blur-sm"
            >
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              <span>Exam Preparation Made Easy</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight"
            >
              Master Your Exams with <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 inline-block drop-shadow-sm">Unified Notes</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 text-slate-600 dark:text-slate-300"
            >
              Access university-specific notes and track important updates. The ultimate companion for BTech students.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mt-4"
            >
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 group transition-all hover:scale-105 active:scale-95">
                  Start Learning Now 
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="h-12 px-8 text-lg bg-white/50 backdrop-blur-sm dark:bg-slate-900/50 transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
                  Explore Features
                </Button>
              </Link>
            </motion.div>

            {/* Stats/Trust */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground grayscale opacity-70 flex-wrap"
            >
              <div className="flex items-center gap-2 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                <CheckCircle className="h-4 w-4 text-green-500" /> 10k+ Students
              </div>
              <div className="flex items-center gap-2 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                <CheckCircle className="h-4 w-4 text-green-500" /> 500+ Notes
              </div>
              <div className="flex items-center gap-2 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                <CheckCircle className="h-4 w-4 text-green-500" /> Verified Content
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="container mx-auto space-y-12 px-4 md:px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center"
            >
              <h2 className="font-heading text-3xl leading-[1.1] sm:text-4xl md:text-5xl font-bold tracking-tight">
                Everything Your Semester Needs
              </h2>
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                Stop searching through WhatsApp groups. Get verified materials in one place.
              </p>
            </motion.div>
            <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 lg:grid-cols-3 md:max-w-[70rem]">
              <FeatureCard
                icon={<BookOpen className="h-8 w-8 text-blue-500" />}
                title="Verified Notes"
                description="Access high-quality, admin-approved notes specific to your university and branch."
                delay={0.1}
              />
              <FeatureCard
                icon={<ShieldCheck className="h-8 w-8 text-green-500" />}
                title="Exam Updates"
                description="Never miss a circular or exam schedule update again with real-time notifications."
                delay={0.2}
              />
              <FeatureCard
                icon={<Sparkles className="h-8 w-8 text-amber-500" />}
                title="Premium PYQs"
                description="Unlock previous year question papers and sessional tests with our premium plan."
                delay={0.3}
              />
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-indigo-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
             className="container mx-auto relative z-10 text-center space-y-6 px-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Ace Your Exams?</h2>
            <p className="text-indigo-200 max-w-2xl mx-auto text-lg">Join thousands of students who are changing the way they study. Get started for free today.</p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="mt-4 text-indigo-900 font-bold hover:bg-indigo-50 transition-transform hover:scale-105 active:scale-95 shadow-xl">
                Create Free Account
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>
      <footer className="border-t py-8 bg-white dark:bg-slate-950">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-xl">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <span>ExamBuddy</span>
          </div>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with ❤️ for University Students.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:underline hover:text-indigo-600 transition-colors">Privacy</Link>
            <Link href="#" className="hover:underline hover:text-indigo-600 transition-colors">Terms</Link>
            <Link href="#" className="hover:underline hover:text-indigo-600 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay = 0 }: { icon: React.ReactNode; title: string; description: string; delay?: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="relative overflow-hidden rounded-xl border bg-background p-2 transition-shadow hover:shadow-xl dark:hover:shadow-indigo-500/10"
    >
      <div className="flex h-[200px] flex-col justify-between rounded-lg p-6 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg w-fit shadow-sm ring-1 ring-slate-100 dark:ring-slate-800">
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
