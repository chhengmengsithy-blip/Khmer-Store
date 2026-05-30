"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { toggleFavorite } from "@/features/listings/actions/favorite-actions";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  listingId: string;
}

export function FavoriteButton({ listingId }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);
  const { toast } = useToast();

  async function handleToggle() {
    setLoading(true);
    setAnimating(true);
    const result = await toggleFavorite(listingId);
    if (!result.error) {
      setFavorited(result.favorited);
      toast({
        title: result.favorited ? "Added to favorites" : "Removed from favorites",
        description: result.favorited
          ? "This listing has been saved to your favorites."
          : "This listing has been removed from your favorites.",
      });
    }
    setLoading(false);
    setTimeout(() => setAnimating(false), 300);
  }

  return (
    <Button
      onClick={handleToggle}
      disabled={loading}
      variant="outline"
      size="sm"
      className={cn(
        "flex-1 border-white/10 transition-all duration-200",
        favorited && "text-red-400 border-red-400/30 bg-red-400/5"
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-transform duration-300",
          favorited && "fill-red-400",
          animating && "scale-125"
        )}
      />
    </Button>
  );
}
