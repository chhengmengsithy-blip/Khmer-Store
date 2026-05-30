"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Package, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { timeAgo, formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Listing } from "@/types";

function conditionLabel(condition: string): string {
  switch (condition) {
    case "new":
      return "New";
    case "like_new":
      return "Like New";
    case "used":
      return "Used";
    default:
      return condition;
  }
}

interface ListingCardProps {
  listing: Listing;
  sellerAvatar?: string | null;
  isFavorited?: boolean;
  onFavoriteToggle?: (listingId: string) => void;
}

export function ListingCard({
  listing,
  sellerAvatar,
  isFavorited = false,
  onFavoriteToggle,
}: ListingCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [favorited, setFavorited] = useState(isFavorited);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorited(!favorited);
    onFavoriteToggle?.(listing.id);
  };

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group block overflow-hidden rounded-lg border border-white/[0.06] bg-surface transition-all duration-300 hover:border-accent-gold/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent-gold/5"
    >
      <div className="relative aspect-[4/3] bg-elevated overflow-hidden">
        {listing.images && listing.images.length > 0 ? (
          <>
            {!imageLoaded && (
              <Skeleton className="absolute inset-0 rounded-none" />
            )}
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              className={cn(
                "object-cover transition-transform duration-300 group-hover:scale-105",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              onLoad={() => setImageLoaded(true)}
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-gold/10 to-elevated">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
        )}

        {/* Gradient overlay for price badge */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Price badge */}
        <span className="absolute bottom-2 left-2 text-sm font-semibold text-white drop-shadow-md">
          {formatPrice(listing.price, listing.currency)}
        </span>

        {/* Seller avatar */}
        {sellerAvatar && (
          <div className="absolute bottom-2 right-2 h-7 w-7 overflow-hidden rounded-full border-2 border-white/30 shadow-md">
            <Image
              src={sellerAvatar}
              alt="Seller"
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-all hover:bg-black/60"
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-all",
              favorited
                ? "fill-red-500 text-red-500 scale-110"
                : "text-white/80 hover:text-white"
            )}
          />
        </button>

        {/* Condition badge */}
        <Badge className="absolute left-2 top-2 bg-elevated/80 text-xs text-soft-white backdrop-blur-sm">
          {conditionLabel(listing.condition)}
        </Badge>
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-soft-white group-hover:text-accent-gold transition-colors">
          {listing.title}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          {listing.location && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {listing.location}
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {timeAgo(listing.created_at)}
          </span>
        </div>
      </div>
    </Link>
  );
}
