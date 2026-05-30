"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleFavorite } from "@/features/listings/actions/favorite-actions";

interface FavoriteButtonProps {
  listingId: string;
}

export function FavoriteButton({ listingId }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    const result = await toggleFavorite(listingId);
    if (!result.error) {
      setFavorited(result.favorited);
    }
    setLoading(false);
  }

  return (
    <Button
      onClick={handleToggle}
      disabled={loading}
      variant="outline"
      className={`w-full border-white/10 ${favorited ? "text-red-400 border-red-400/30" : ""}`}
    >
      <Heart
        className={`mr-2 h-4 w-4 ${favorited ? "fill-red-400" : ""}`}
      />
      {favorited ? "Favorited" : "Favorite"}
    </Button>
  );
}
