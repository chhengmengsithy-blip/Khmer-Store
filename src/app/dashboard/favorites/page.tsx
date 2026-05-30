"use client";

import { useState, useEffect } from "react";
import { Heart, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ListingCard } from "@/components/shared/listing-card";
import { getUserFavorites } from "@/features/listings/actions/favorite-actions";
import type { Listing } from "@/types";

interface FavoriteWithListing {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
  listings: Listing | null;
}

export default function DashboardFavoritesPage() {
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function fetchFavorites() {
    setLoading(true);
    setError(null);
    getUserFavorites()
      .then((data) => {
        const listings = (data as FavoriteWithListing[])
          .map((f) => f.listings)
          .filter((l): l is Listing => l !== null);
        setFavorites(listings);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load your favorites. Please try again.");
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-soft-white font-playfair">
          My Favorites
        </h1>
        <p className="text-sm text-muted-foreground">Loading your favorites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-soft-white font-playfair">
          My Favorites
        </h1>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-10 w-10 text-red-400 mb-4" />
          <p className="text-sm text-red-400 mb-4">{error}</p>
          <Button
            onClick={fetchFavorites}
            className="bg-accent-gold text-background hover:bg-accent-gold/90"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-soft-white font-playfair">
          My Favorites
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {favorites.length} favorited listing{favorites.length !== 1 ? "s" : ""}
        </p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          description="Browse the marketplace and favorite listings you like"
          actionLabel="Browse Marketplace"
          actionHref="/marketplace"
        />
      )}
    </div>
  );
}
