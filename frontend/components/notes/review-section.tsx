"use client";

import { API_BASE_URL } from "@/lib/config";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface Review {
    id: string;
    user_name: string;
    rating: number;
    comment: string;
    created_at: string;
}

interface ReviewSectionProps {
    noteId: string;
    noteTitle: string;
    initialRating: number;
    initialRatingCount: number;
}

export function ReviewSection({ noteId, noteTitle, initialRating, initialRatingCount }: ReviewSectionProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState({ rating: initialRating, count: initialRatingCount });

    // Review Form
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchReviews = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/notes/${noteId}/reviews`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/notes/${noteId}/review`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ rating, comment })
            });

            if (res.ok) {
                const newReview = await res.json();
                setReviews([newReview, ...reviews]);
                setComment("");
                // Quick update stats (approximate or refetch needed for precision, API returns updated note stats usually but here we simulate)
                // For now just increment count, complex average math skipped client side
                setStats(prev => ({ ...prev, count: prev.count + 1 }));
            } else {
                const err = await res.json();
                alert(err.detail || "Failed to submit review");
            }
        } catch (error) {
            console.error("Submit review error", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchReviews();
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 px-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-xs">{stats.count > 0 ? `${stats.rating.toFixed(1)} (${stats.count})` : "Review"}</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Reviews for {noteTitle}</DialogTitle>
                    <DialogDescription>
                        See what others are saying about this note.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-2 space-y-6 py-4">
                    {/* Add Review Form */}
                    <div className="space-y-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                        <h4 className="font-medium text-sm">Write a Review</h4>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={cn("hover:scale-110 transition-transform", rating >= star ? "text-yellow-400 fill-yellow-400" : "text-slate-300")}
                                >
                                    <Star className={cn("h-6 w-6", rating >= star && "fill-current")} />
                                </button>
                            ))}
                        </div>
                        <form onSubmit={handleSubmitReview} className="space-y-2">
                            <Textarea
                                placeholder="Helpful? Accurate? (Optional)"
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                className="resize-none"
                            />
                            <Button type="submit" size="sm" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? "Posting..." : "Post Review"}
                            </Button>
                        </form>
                    </div>

                    {/* Review List */}
                    <div className="space-y-4">
                        {isLoading ? (
                            <p className="text-center text-sm text-slate-500">Loading reviews...</p>
                        ) : reviews.length === 0 ? (
                            <p className="text-center text-sm text-slate-500">No reviews yet. Be the first!</p>
                        ) : (
                            reviews.map(review => (
                                <div key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-semibold text-sm">{review.user_name}</span>
                                        <span className="text-xs text-slate-500">{new Date(review.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1 mb-2">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={cn("h-3 w-3", i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200")}
                                            />
                                        ))}
                                    </div>
                                    {review.comment && <p className="text-sm text-slate-700 dark:text-slate-300">{review.comment}</p>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
