"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { ListingCard } from "@/components/shared/listing-card";
import { getUserFavorites } from "@/features/listings/actions/favorite-actions";
import type { Listing } from "@/types";

export default function DashboardFavoritesPage() {
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getUserFavorites().then((data) => {
      if (mounted) {
        const listings = data
          .map((f: Record<string, unknown>) => f.listings as Listing | null)
          .filter((l): l is Listing => l !== null);
        setFavorites(listings);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
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
