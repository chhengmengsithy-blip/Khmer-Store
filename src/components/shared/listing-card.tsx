import Link from "next/link";
import { MapPin, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Listing } from "@/types";

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function formatPrice(price: number | null, currency: string): string {
  if (price === null) return "Contact for price";
  if (price === 0) return "Free";
  return currency === "KHR"
    ? `${price.toLocaleString()} KHR`
    : `$${price.toLocaleString()}`;
}

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
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group block overflow-hidden rounded-lg border border-white/[0.08] bg-surface transition-colors hover:border-accent-gold/30"
    >
      <div className="relative aspect-[4/3] bg-elevated">
        {listing.images && listing.images.length > 0 ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
        <Badge className="absolute right-2 top-2 bg-elevated/80 text-xs text-soft-white backdrop-blur-sm">
          {conditionLabel(listing.condition)}
        </Badge>
      </div>
      <div className="p-3">
        <h3 className="line-clamp-1 text-sm font-medium text-soft-white group-hover:text-accent-gold transition-colors">
          {listing.title}
        </h3>
        <p className="mt-1 text-base font-semibold text-accent-gold">
          {formatPrice(listing.price, listing.currency)}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {listing.location}
          </span>
          <span className="text-xs text-muted-foreground">
            {timeAgo(listing.created_at)}
          </span>
        </div>
      </div>
    </Link>
  );
}
