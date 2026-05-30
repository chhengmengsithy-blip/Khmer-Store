import Link from "next/link";
import Image from "next/image";
import { MapPin, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { timeAgo, formatPrice } from "@/lib/utils";
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
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group block overflow-hidden rounded-lg border border-white/[0.08] bg-surface transition-all duration-200 hover:border-accent-gold/30 hover:scale-[1.02] hover:shadow-lg hover:shadow-accent-gold/5"
    >
      <div className="relative aspect-[4/3] bg-elevated">
        {listing.images && listing.images.length > 0 ? (
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-gold/10 to-elevated">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
        <Badge className="absolute right-2 top-2 bg-elevated/80 text-xs text-soft-white backdrop-blur-sm">
          {conditionLabel(listing.condition)}
        </Badge>
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-soft-white group-hover:text-accent-gold transition-colors">
          {listing.title}
        </h3>
        <p className="mt-1 text-base font-semibold text-accent-gold">
          {formatPrice(listing.price, listing.currency)}
        </p>
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
