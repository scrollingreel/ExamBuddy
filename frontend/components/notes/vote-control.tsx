"use client";

import { API_BASE_URL } from "@/lib/config";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoteControlProps {
    noteId: string;
    initialVoteCount: number;
    initialUserVote: number; // 1, -1, or 0
}

export function VoteControl({ noteId, initialVoteCount, initialUserVote }: VoteControlProps) {
    const [voteCount, setVoteCount] = useState(initialVoteCount);
    const [userVote, setUserVote] = useState(initialUserVote);
    const [isLoading, setIsLoading] = useState(false);

    const handleVote = async (type: 1 | -1) => {
        if (isLoading) return;
        setIsLoading(true);

        // Optimistic update
        const previousVote = userVote;
        const previousCount = voteCount;

        let newVote: number = type;
        let newCount = voteCount;

        if (userVote === type) {
            // Toggle off
            newVote = 0;
            newCount -= type;
        } else {
            // Change vote
            newCount += type - userVote;
        }

        setUserVote(newVote);
        setVoteCount(newCount);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/notes/${noteId}/vote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ vote_type: type })
            });

            if (!res.ok) {
                // Revert
                setUserVote(previousVote);
                setVoteCount(previousCount);
            } else {
                const data = await res.json();
                // Ensure sync with server
                setVoteCount(data.vote_count);
                setUserVote(data.user_vote);
            }
        } catch (error) {
            console.error("Vote failed", error);
            // Revert
            setUserVote(previousVote);
            setVoteCount(previousCount);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8 hover:bg-slate-200 dark:hover:bg-slate-700", userVote === 1 && "text-orange-500")}
                onClick={() => handleVote(1)}
                disabled={isLoading}
            >
                <ArrowBigUp className={cn("h-6 w-6", userVote === 1 && "fill-current")} />
            </Button>
            <span className="text-sm font-bold min-w-[20px] text-center">{voteCount}</span>
            <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8 hover:bg-slate-200 dark:hover:bg-slate-700", userVote === -1 && "text-blue-500")}
                onClick={() => handleVote(-1)}
                disabled={isLoading}
            >
                <ArrowBigDown className={cn("h-6 w-6", userVote === -1 && "fill-current")} />
            </Button>
        </div>
    );
}
