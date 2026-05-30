import Link from "next/link";
import Image from "next/image";
import {
  Package,
  MapPin,
  Clock,
  Phone,
  Share2,
  Eye,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/empty-state";
import { ListingCard } from "@/components/shared/listing-card";
import {
  getListingById,
  getListings,
  incrementViews,
} from "@/features/listings/actions/listing-actions";
import { timeAgo, formatPrice } from "@/lib/utils";
import type { Listing, Profile, Category } from "@/types";
import { FavoriteButton } from "./favorite-button";
import { ReportDialog } from "./report-dialog";

interface ListingDetailPageProps {
  params: Promise<{ id: string }>;
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

export default async function ListingDetailPage({
  params,
}: ListingDetailPageProps) {
  const { id } = await params;
  const { data, error } = await getListingById(id);

  if (!data || error) {
    return (
      <div className="min-h-screen pt-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
          <EmptyState
            icon={Package}
            title="Listing not found"
            description="This listing may have been removed or does not exist."
            actionLabel="Browse Marketplace"
            actionHref="/marketplace"
          />
        </div>
      </div>
    );
  }

  // Increment views
  await incrementViews(id);

  const listing = data as Listing & { profiles: Profile | null; categories: Category | null };

  // Fetch related listings from same category
  let relatedListings: Listing[] = [];
  if (listing.category_id) {
    const categorySlug = listing.categories?.slug;
    if (categorySlug) {
      const { data: related } = await getListings({
        category: categorySlug,
        limit: 4,
      });
      relatedListings = related.filter((l) => l.id !== listing.id).slice(0, 4);
    }
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-accent-gold">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/marketplace" className="hover:text-accent-gold">
            Marketplace
          </Link>
          {listing.categories && (
            <>
              <span className="mx-2">/</span>
              <Link
                href={`/category/${listing.categories.slug}`}
                className="hover:text-accent-gold"
              >
                {listing.categories.name}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-soft-white line-clamp-1 inline">
            {listing.title}
          </span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="overflow-hidden rounded-lg border border-white/[0.08]">
              {listing.images && listing.images.length > 0 ? (
                <div className="grid gap-2">
                  <div className="relative aspect-[16/10] bg-elevated">
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      priority
                    />
                  </div>
                  {listing.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 p-2">
                      {listing.images.slice(1, 5).map((img, i) => (
                        <div
                          key={i}
                          className="relative aspect-square overflow-hidden rounded bg-elevated"
                        >
                          <Image
                            src={img}
                            alt={`${listing.title} ${i + 2}`}
                            fill
                            className="object-cover"
                            sizes="150px"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-accent-gold/10 to-elevated">
                  <Package className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Title and Price */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl font-bold text-soft-white font-playfair">
                  {listing.title}
                </h1>
                <Badge className="shrink-0 bg-elevated text-soft-white">
                  {conditionLabel(listing.condition)}
                </Badge>
              </div>
              <p className="mt-2 text-3xl font-bold text-accent-gold">
                {formatPrice(listing.price, listing.currency)}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {listing.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {listing.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {timeAgo(listing.created_at)}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {listing.views_count} views
                </span>
              </div>
            </div>

            <Separator className="bg-white/[0.08]" />

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-soft-white mb-3">
                Description
              </h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {listing.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Action Buttons */}
            <Card className="border-white/[0.08] bg-surface">
              <CardContent className="p-4 space-y-3">
                {listing.contact_phone && (
                  <Button
                    asChild
                    className="w-full bg-accent-gold text-background hover:bg-accent-gold/90"
                  >
                    <a href={`tel:${listing.contact_phone}`}>
                      <Phone className="mr-2 h-4 w-4" />
                      {listing.contact_phone}
                    </a>
                  </Button>
                )}
                <FavoriteButton listingId={listing.id} />
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="border-white/10" asChild>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(listing.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </a>
                  </Button>
                  <ReportDialog listingId={listing.id} />
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            {listing.profiles && (
              <Card className="border-white/[0.08] bg-surface">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-soft-white mb-3">
                    Seller
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-gold/10">
                      {listing.profiles.avatar_url ? (
                        <Image
                          src={listing.profiles.avatar_url}
                          alt={listing.profiles.full_name || "Seller"}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-accent-gold" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-soft-white">
                        {listing.profiles.full_name || listing.contact_name || "Seller"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Member since {new Date(listing.profiles.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Related Listings */}
        {relatedListings.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-soft-white font-playfair mb-6">
              Related Listings
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedListings.map((related) => (
                <ListingCard key={related.id} listing={related} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
