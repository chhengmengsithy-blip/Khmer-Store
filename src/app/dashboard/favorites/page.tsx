"use client";

import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/marketplace/product-card";
import { getUserFavorites } from "@/features/marketplace/actions/favorite-actions";

interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  seller: string;
  rating: number;
  image: string | null;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const data = await getUserFavorites();
        setFavorites(data);
      } catch {
        // Silently handle error - will show empty state
      } finally {
        setLoading(false);
      }
    }
    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-soft-white">Favorites</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your saved products
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/5] rounded-xl bg-surface animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-soft-white">Favorites</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your saved products
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-surface p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-gold/10 mb-4">
            <Heart className="h-8 w-8 text-accent-gold" />
          </div>
          <h2 className="text-lg font-semibold text-soft-white">
            No favorites yet
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            Browse the marketplace and click the heart icon on products you love
            to save them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              initialFavorited={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
