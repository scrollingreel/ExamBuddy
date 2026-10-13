"use client";

import { CapgeminiLeaderboardView } from "@/components/capgemini/leaderboard-view";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CapgeminiMockLeaderboardPage() {
    const router = useRouter();

    return (
        <div className="max-w-6xl mx-auto space-y-6 pt-2 pb-16">
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/dashboard/placement-material")}
                    className="-ml-3 text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Placement Prep
                </Button>

                <Link href="/dashboard/placement-material/capgemini-mock/mock-1">
                    <Button size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white">
                        <BookOpen className="mr-2 h-4 w-4" /> Take Mock Test 1
                    </Button>
                </Link>
            </div>

            <CapgeminiLeaderboardView initialTestFilter="all" />
        </div>
    );
}
