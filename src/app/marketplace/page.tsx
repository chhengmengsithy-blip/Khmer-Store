import Link from "next/link";
import { Search, Package } from "lucide-react";
import { ListingCard } from "@/components/shared/listing-card";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchBar } from "@/components/shared/search-bar";
import { getListings, getCategories } from "@/features/listings/actions/listing-actions";
import type { Category } from "@/types";

interface MarketplacePageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    location?: string;
  }>;
}

export default async function MarketplacePage({
  searchParams,
}: MarketplacePageProps) {
  const params = await searchParams;
  const search = params.q || "";
  const category = params.category || "";
  const sort = params.sort || "";

  const [{ data: listings }, categories] = await Promise.all([
    getListings({ search: search || undefined, category: category || undefined, sort: sort || undefined }),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        {/* Breadcrumbs */}
        <nav className="mb-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-accent-gold">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-soft-white">Marketplace</span>
        </nav>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            defaultQuery={search}
            defaultCategory={category}
            defaultLocation={params.location || ""}
          />
        </div>

        {/* Category Filter Chips */}
        {categories.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <Link
              href="/marketplace"
              className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                !category
                  ? "bg-accent-gold/20 text-accent-gold"
                  : "bg-elevated text-muted-foreground hover:text-soft-white"
              }`}
            >
              All
            </Link>
            {(categories as Category[]).map((cat) => (
              <Link
                key={cat.slug}
                href={`/marketplace?category=${cat.slug}${search ? `&q=${search}` : ""}${sort ? `&sort=${sort}` : ""}`}
                className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  category === cat.slug
                    ? "bg-accent-gold/20 text-accent-gold"
                    : "bg-elevated text-muted-foreground hover:text-soft-white"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Sort Options */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {listings.length} listing{listings.length !== 1 ? "s" : ""} found
          </p>
          <div className="flex gap-2">
            <Link
              href={`/marketplace?${new URLSearchParams({ ...(search && { q: search }), ...(category && { category }), sort: "newest" }).toString()}`}
              className={`text-xs px-2 py-1 rounded ${sort === "newest" || !sort ? "text-accent-gold" : "text-muted-foreground hover:text-soft-white"}`}
            >
              Newest
            </Link>
            <Link
              href={`/marketplace?${new URLSearchParams({ ...(search && { q: search }), ...(category && { category }), sort: "price-asc" }).toString()}`}
              className={`text-xs px-2 py-1 rounded ${sort === "price-asc" ? "text-accent-gold" : "text-muted-foreground hover:text-soft-white"}`}
            >
              Price: Low-High
            </Link>
            <Link
              href={`/marketplace?${new URLSearchParams({ ...(search && { q: search }), ...(category && { category }), sort: "price-desc" }).toString()}`}
              className={`text-xs px-2 py-1 rounded ${sort === "price-desc" ? "text-accent-gold" : "text-muted-foreground hover:text-soft-white"}`}
            >
              Price: High-Low
            </Link>
          </div>
        </div>

        {/* Listings Grid */}
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={search ? Search : Package}
            title={search ? "No listings match your search" : "No listings yet"}
            description={
              search
                ? "Try adjusting your search terms or filters"
                : "Be the first to post a listing on Khmer Store!"
            }
            actionLabel="Post a Listing"
            actionHref="/post"
          />
        )}
      </div>
    </div>
  );
}
