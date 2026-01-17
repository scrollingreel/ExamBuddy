import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Brain, ShieldCheck, Sparkles, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="bg-indigo-600 rounded-lg p-1 text-white">
              <BookOpen className="h-5 w-5" />
            </div>
            <span>ExamBuddy</span>
          </div>
          <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
            <Link className="text-sm font-medium hover:text-indigo-600 transition-colors" href="#features">
              Features
            </Link>
            <Link className="text-sm font-medium hover:text-indigo-600 transition-colors" href="/pricing">
              Pricing
            </Link>
            <Link className="text-sm font-medium hover:text-indigo-600 transition-colors" href="/about">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="hover:text-indigo-600 text-slate-600 dark:text-slate-300">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 md:pt-24 lg:pt-32 pb-12 md:pb-24 lg:pb-32">
          {/* Background Gradients */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-slate-950 [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:[background:radial-gradient(125%_125%_at_50%_10%,#020617_40%,#312e81_100%)] opacity-70"></div>

          <div className="container mx-auto flex max-w-[64rem] flex-col items-center gap-4 text-center px-4">
            <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 backdrop-blur-sm">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              <span>Exam Preparation Made Easy</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Master Your Exams with <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Unified Notes & AI</span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 text-slate-600 dark:text-slate-300">
              Access university-specific notes, get instant AI help for assignments, and track important updates. The ultimate companion for BTech students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20">
                  Start Learning Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="h-12 px-8 text-lg bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
                  Explore Features
                </Button>
              </Link>
            </div>

            {/* Stats/Trust */}
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground grayscale opacity-70">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> 10k+ Students
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> 500+ Notes
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> Verified Content
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="container mx-auto space-y-12 px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
              <h2 className="font-heading text-3xl leading-[1.1] sm:text-4xl md:text-5xl font-bold tracking-tight">
                Everything Your Semester Needs
              </h2>
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                Stop searching through WhatsApp groups. Get verified materials in one place.
              </p>
            </div>
            <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 lg:grid-cols-4 md:max-w-[70rem]">
              <FeatureCard
                icon={<BookOpen className="h-8 w-8 text-blue-500" />}
                title="Verified Notes"
                description="Access high-quality, admin-approved notes specific to your university and branch."
              />
              <FeatureCard
                icon={<Brain className="h-8 w-8 text-purple-500" />}
                title="AI Tutor"
                description="Stuck on an assignment? Our AI chatbot explains answers step-by-step instantly."
              />
              <FeatureCard
                icon={<ShieldCheck className="h-8 w-8 text-green-500" />}
                title="Exam Updates"
                description="Never miss a circular or exam schedule update again with real-time notifications."
              />
              <FeatureCard
                icon={<Sparkles className="h-8 w-8 text-amber-500" />}
                title="Premium PYQs"
                description="Unlock previous year question papers and sessional tests with our premium plan."
              />
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-indigo-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="container mx-auto relative z-10 text-center space-y-6 px-4">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Ace Your Exams?</h2>
            <p className="text-indigo-200 max-w-2xl mx-auto text-lg">Join thousands of students who are changing the way they study. Get started for free today.</p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="mt-4 text-indigo-900 font-bold hover:bg-indigo-50">
                Create Free Account
              </Button>
            </Link>
          </div>
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
            <Link href="#" className="hover:underline">Privacy</Link>
            <Link href="#" className="hover:underline">Terms</Link>
            <Link href="#" className="hover:underline">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border bg-background p-2 transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
      <div className="flex h-[200px] flex-col justify-between rounded-lg p-6 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg w-fit shadow-sm ring-1 ring-slate-100 dark:ring-slate-800">
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
