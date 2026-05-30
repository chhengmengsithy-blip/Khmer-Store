import Link from "next/link";
import Image from "next/image";
import {
  Package,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Share2,
  Eye,
  User,
  Shield,
  Calendar,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/empty-state";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ListingCard } from "@/components/shared/listing-card";
import { ImageGallery } from "@/features/listings/components/image-gallery";
import {
  getListingById,
  getListings,
  incrementViews,
} from "@/features/listings/actions/listing-actions";
import { timeAgo, formatPrice } from "@/lib/utils";
import type { Listing, Profile, Category } from "@/types";
import { FavoriteButton } from "./favorite-button";
import { ReportDialog } from "./report-dialog";
import { ShareButton } from "./share-button";

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

function conditionColor(condition: string): string {
  switch (condition) {
    case "new":
      return "bg-green-500/10 text-green-400 border-green-500/20";
    case "like_new":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "used":
      return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    default:
      return "bg-elevated text-soft-white";
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
        limit: 5,
      });
      relatedListings = related.filter((l) => l.id !== listing.id).slice(0, 4);
    }
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        {/* Breadcrumbs */}
        <Breadcrumbs className="mb-6" />

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content - Left 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <ImageGallery images={listing.images || []} alt={listing.title} />

            {/* Title, Price, Condition */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl font-bold text-soft-white">
                  {listing.title}
                </h1>
                <Badge
                  className={`shrink-0 border ${conditionColor(listing.condition)}`}
                  variant="outline"
                >
                  {conditionLabel(listing.condition)}
                </Badge>
              </div>
              <p className="mt-3 text-3xl font-bold text-accent-gold">
                {formatPrice(listing.price, listing.currency)}
              </p>

              {/* Meta info row */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {listing.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {listing.location}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {timeAgo(listing.created_at)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  {listing.views_count} views
                </span>
              </div>
            </div>

            <Separator className="bg-white/[0.06]" />

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-soft-white mb-3">
                Description
              </h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {listing.description || "No description provided."}
              </p>
            </div>

            <Separator className="bg-white/[0.06]" />

            {/* Specifications */}
            <div>
              <h2 className="text-lg font-semibold text-soft-white mb-4">
                Specifications
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-white/[0.06] bg-elevated/50 p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Tag className="h-3.5 w-3.5" />
                    Condition
                  </div>
                  <p className="text-sm font-medium text-soft-white">
                    {conditionLabel(listing.condition)}
                  </p>
                </div>
                {listing.categories && (
                  <div className="rounded-lg border border-white/[0.06] bg-elevated/50 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Package className="h-3.5 w-3.5" />
                      Category
                    </div>
                    <p className="text-sm font-medium text-soft-white">
                      {listing.categories.name}
                    </p>
                  </div>
                )}
                <div className="rounded-lg border border-white/[0.06] bg-elevated/50 p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Posted
                  </div>
                  <p className="text-sm font-medium text-soft-white">
                    {new Date(listing.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Right 1/3 */}
          <div className="space-y-4">
            {/* Price Card */}
            <Card className="border-white/[0.08] bg-surface sticky top-24">
              <CardContent className="p-5 space-y-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent-gold">
                    {formatPrice(listing.price, listing.currency)}
                  </p>
                </div>

                {listing.contact_phone && (
                  <Button
                    asChild
                    className="w-full bg-accent-gold text-background hover:bg-accent-gold/90 font-medium"
                  >
                    <a href={`tel:${listing.contact_phone}`}>
                      <Phone className="mr-2 h-4 w-4" />
                      Contact Seller
                    </a>
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="w-full border-white/10 text-soft-white hover:bg-elevated"
                  asChild
                >
                  <Link href="/messages">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message Seller
                  </Link>
                </Button>

                {listing.contact_phone && (
                  <div className="rounded-md border border-white/[0.06] bg-elevated/50 p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Phone Number</p>
                    <p className="text-sm font-mono text-soft-white">
                      {listing.contact_phone}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <FavoriteButton listingId={listing.id} />
                  <ShareButton title={listing.title} />
                  <ReportDialog listingId={listing.id} />
                </div>
              </CardContent>
            </Card>

            {/* Seller Card */}
            {listing.profiles && (
              <Card className="border-white/[0.08] bg-surface">
                <CardContent className="p-5">
                  <h3 className="text-sm font-semibold text-soft-white mb-4">
                    Seller Information
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-gold/10 border border-accent-gold/20">
                      {listing.profiles.avatar_url ? (
                        <Image
                          src={listing.profiles.avatar_url}
                          alt={listing.profiles.full_name || "Seller"}
                          width={48}
                          height={48}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-accent-gold" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-soft-white">
                        {listing.profiles.full_name || listing.contact_name || "Seller"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Member since{" "}
                        {new Date(listing.profiles.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full border-white/10 text-xs"
                    asChild
                  >
                    <Link href={`/profile/${listing.profiles.id}`}>
                      View Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Safety Tips */}
            <Card className="border-white/[0.08] bg-surface">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-accent-gold" />
                  <h3 className="text-sm font-semibold text-soft-white">
                    Safety Tips
                  </h3>
                </div>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1 w-1 rounded-full bg-muted-foreground flex-shrink-0" />
                    Meet in a public, well-lit place
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1 w-1 rounded-full bg-muted-foreground flex-shrink-0" />
                    Check the item thoroughly before paying
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1 w-1 rounded-full bg-muted-foreground flex-shrink-0" />
                    Never send money in advance
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1 w-1 rounded-full bg-muted-foreground flex-shrink-0" />
                    Report suspicious listings
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Listings */}
        {relatedListings.length > 0 && (
          <div className="mt-12">
            <Separator className="bg-white/[0.06] mb-8" />
            <h2 className="text-xl font-bold text-soft-white mb-6">
              Similar Listings
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
