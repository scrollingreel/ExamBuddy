import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Brain, ShieldCheck, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <BookOpen className="h-6 w-6" />
            <span>ExamBuddy</span>
          </div>
          <nav className="hidden flex-1 items-center justify-center gap-6 md:flex">
            <Link className="text-sm font-medium hover:underline" href="#features">
              Features
            </Link>
            <Link className="text-sm font-medium hover:underline" href="#pricing">
              Pricing
            </Link>
            <Link className="text-sm font-medium hover:underline" href="/about">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <div className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium">
              🚀 Exam Preparation Made Easy
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Master Your Exams with <span className="text-indigo-600">Unified Notes</span> & AI
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 text-slate-600">
              Access university-specific notes, get instant AI help for assignments, and track important updates. The ultimate companion for BTech students.
            </p>
            <div className="flex gap-4">
              <Link href="/register">
                <Button size="lg" className="h-11 px-8">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="h-11 px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl font-bold">
              Features
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Everything you need to ace your semester exams in one place.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <FeatureCard
              icon={<BookOpen className="h-10 w-10 text-blue-500" />}
              title="Verified Notes"
              description="Access high-quality, admin-approved notes specific to your university and branch."
            />
            <FeatureCard
              icon={<Brain className="h-10 w-10 text-purple-500" />}
              title="AI Tutor"
              description="Stuck on an assignment? Our AI chatbot explains answers step-by-step instantly."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-10 w-10 text-green-500" />}
              title="Exam Updates"
              description="Never miss a circular or exam schedule update again with real-time notifications."
            />
            <FeatureCard
              icon={<Sparkles className="h-10 w-10 text-yellow-500" />}
              title="Premium PYQs"
              description="Unlock previous year question papers and sessional tests with our premium plan."
            />
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by ExamBuddy Team.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="relative overflow-hidden rounded-lg border bg-background p-2">
      <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
        {icon}
        <div className="space-y-2">
          <h3 className="font-bold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
