"use client";

import React, { useState } from "react";
import { Star, ThumbsUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { submitReview } from "@/features/marketplace/actions/review-actions";
import { toast } from "@/hooks/use-toast";

const mockReviews = [
  {
    id: "1",
    user: "Sarah M.",
    avatar: "SM",
    rating: 5,
    comment: "Absolutely beautiful craftsmanship! The quality exceeded my expectations. Shipping was fast and well-packaged.",
    date: "2024-01-15",
    verified: true,
    helpful: 12,
  },
  {
    id: "2",
    user: "David K.",
    avatar: "DK",
    rating: 4,
    comment: "Great product, exactly as described. Minor delay in shipping but the seller communicated well throughout.",
    date: "2024-01-10",
    verified: true,
    helpful: 8,
  },
  {
    id: "3",
    user: "Lin C.",
    avatar: "LC",
    rating: 5,
    comment: "This is my second purchase from this seller. Consistent quality and authentic materials. Highly recommend!",
    date: "2024-01-05",
    verified: true,
    helpful: 15,
  },
  {
    id: "4",
    user: "Michael R.",
    avatar: "MR",
    rating: 3,
    comment: "Good quality but the color was slightly different from the photos. Still a nice piece overall.",
    date: "2023-12-28",
    verified: false,
    helpful: 3,
  },
];

const ratingDistribution = [
  { stars: 5, count: 45 },
  { stars: 4, count: 20 },
  { stars: 3, count: 8 },
  { stars: 2, count: 3 },
  { stars: 1, count: 1 },
];

interface ReviewSectionProps {
  productId?: string;
}

export function ReviewSection({ productId }: ReviewSectionProps) {
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const totalReviews = ratingDistribution.reduce((sum, r) => sum + r.count, 0);
  const avgRating =
    ratingDistribution.reduce((sum, r) => sum + r.stars * r.count, 0) /
    totalReviews;

  const handleSubmitReview = async () => {
    if (newRating < 1) {
      toast({
        title: "Rating required",
        description: "Please select a star rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (!productId) {
      toast({
        title: "Error",
        description: "Product not found.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitReview(productId, newRating, comment);
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Review submitted",
          description: "Thank you for your review!",
        });
        setNewRating(0);
        setComment("");
        setShowWriteReview(false);
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-soft-white">
          Customer Reviews
        </h3>
        <Button
          variant="outline"
          size="sm"
          className="border-accent-gold/30 text-accent-gold hover:bg-accent-gold/10"
          onClick={() => setShowWriteReview(!showWriteReview)}
        >
          Write a Review
        </Button>
      </div>

      {/* Rating Summary */}
      <div className="flex flex-col gap-6 rounded-xl border border-white/[0.06] bg-surface p-6 sm:flex-row">
        {/* Average */}
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="text-4xl font-bold text-accent-gold">
            {avgRating.toFixed(1)}
          </span>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < Math.round(avgRating)
                    ? "fill-accent-gold text-accent-gold"
                    : "text-white/20"
                )}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {totalReviews} reviews
          </span>
        </div>

        {/* Distribution */}
        <div className="flex-1 space-y-2">
          {ratingDistribution.map((row) => (
            <div key={row.stars} className="flex items-center gap-3">
              <span className="w-8 text-right text-xs text-muted-foreground">
                {row.stars}
              </span>
              <Star className="h-3 w-3 fill-accent-gold text-accent-gold" />
              <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent-gold/70"
                  style={{
                    width: `${(row.count / totalReviews) * 100}%`,
                  }}
                />
              </div>
              <span className="w-8 text-xs text-muted-foreground">
                {row.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Form */}
      {showWriteReview && (
        <div className="rounded-xl border border-white/[0.06] bg-surface p-6 space-y-4">
          <h4 className="text-sm font-medium text-soft-white">Your Review</h4>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                onMouseEnter={() => setHoverRating(i + 1)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setNewRating(i + 1)}
                type="button"
              >
                <Star
                  className={cn(
                    "h-6 w-6 transition-colors",
                    i < (hoverRating || newRating)
                      ? "fill-accent-gold text-accent-gold"
                      : "text-white/20"
                  )}
                />
              </button>
            ))}
          </div>
          <textarea
            placeholder="Share your experience with this product..."
            className="w-full min-h-[100px] rounded-lg border border-white/10 bg-elevated px-3 py-2 text-sm text-soft-white placeholder:text-muted-foreground focus:border-accent-gold/30 focus:outline-none"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              className="bg-accent-gold text-background hover:bg-accent-gold/90"
              size="sm"
              onClick={handleSubmitReview}
              disabled={submitting}
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Review
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/10"
              onClick={() => setShowWriteReview(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <Separator className="bg-white/5" />

      {/* Review List */}
      <div className="space-y-4">
        {mockReviews.map((review) => (
          <div
            key={review.id}
            className="rounded-xl border border-white/[0.06] bg-surface p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-accent-gold/10 text-accent-gold text-xs">
                    {review.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-soft-white">
                      {review.user}
                    </span>
                    {review.verified && (
                      <Badge
                        variant="outline"
                        className="border-green-500/30 text-green-400 text-[10px] px-1.5 py-0"
                      >
                        Verified Purchase
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3",
                      i < review.rating
                        ? "fill-accent-gold text-accent-gold"
                        : "text-white/20"
                    )}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {review.comment}
            </p>
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-soft-white transition-colors">
              <ThumbsUp className="h-3 w-3" />
              Helpful ({review.helpful})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
