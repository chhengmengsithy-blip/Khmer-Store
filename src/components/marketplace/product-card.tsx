"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Star, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleFavorite } from "@/features/marketplace/actions/favorite-actions";

interface Product {
  id: string;
  name: string;
  price: number;
  seller: string;
  rating: number;
  image: string | null;
}

interface ProductCardProps {
  product: Product;
  initialFavorited?: boolean;
}

const premiumEasing: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function ProductCard({ product, initialFavorited = false }: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const handleToggleFavorite = async () => {
    // Optimistic toggle
    setIsFavorited((prev) => !prev);
    setFavoriteLoading(true);

    try {
      const result = await toggleFavorite(product.id);
      if (result.error) {
        // Revert optimistic update on error
        setIsFavorited((prev) => !prev);
      } else {
        setIsFavorited(result.isFavorited);
      }
    } catch {
      // Revert optimistic update on error
      setIsFavorited((prev) => !prev);
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <motion.div
      role="article"
      className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-surface transition-colors hover:border-accent-gold/20 hover:shadow-lg hover:shadow-accent-gold/5"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: premiumEasing }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-elevated">
        <div className="flex h-full items-center justify-center">
          <div className="h-20 w-20 rounded-full bg-accent-gold/10" />
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button
            className="mb-4 bg-accent-gold text-background hover:bg-accent-gold/90 gap-2"
            size="sm"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add to Cart
          </Button>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          disabled={favoriteLoading}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-colors hover:bg-black/60"
          aria-label="Add to favorites"
        >
          {favoriteLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-white/70" />
          ) : (
            <motion.div
              animate={isFavorited ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-colors",
                  isFavorited
                    ? "fill-accent-gold text-accent-gold"
                    : "text-white/70"
                )}
              />
            </motion.div>
          )}
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground">{product.seller}</p>
        <h3 className="mt-1 text-sm font-medium text-soft-white line-clamp-1">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-accent-gold">
            ${product.price.toLocaleString()}
          </span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-accent-gold text-accent-gold" />
            <span className="text-xs text-muted-foreground">
              {product.rating}
            </span>
            <span className="sr-only">Rating: {product.rating} out of 5</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
