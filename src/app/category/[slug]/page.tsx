import Link from "next/link";
import { Package } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { ListingCard } from "@/components/shared/listing-card";
import { getListings } from "@/features/listings/actions/listing-actions";
import { createClient } from "@/lib/supabase/server";
import { categories as clientCategories } from "@/constants/categories";
import type { Category } from "@/types";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  // Try to get category from Supabase first, fall back to client-side categories
  let categoryName = "";
  let categoryDescription = "";

  const supabase = await createClient();
  if (supabase) {
    const { data: dbCategory } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();
    if (dbCategory) {
      const cat = dbCategory as Category;
      categoryName = cat.name;
      categoryDescription = cat.description || "";
    }
  }

  // Fall back to client-side categories
  if (!categoryName) {
    const localCat = clientCategories.find((c) => c.slug === slug);
    if (localCat) {
      categoryName = localCat.name;
      categoryDescription = localCat.description;
    }
  }

  if (!categoryName) {
    return (
      <div className="min-h-screen pt-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
          <EmptyState
            icon={Package}
            title="Category not found"
            description="The category you are looking for does not exist."
            actionLabel="Browse Marketplace"
            actionHref="/marketplace"
          />
        </div>
      </div>
    );
  }

  const { data: listings } = await getListings({ category: slug });

  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-accent-gold">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/marketplace" className="hover:text-accent-gold">
            Marketplace
          </Link>
          <span className="mx-2">/</span>
          <span className="text-soft-white">{categoryName}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-soft-white font-playfair">
            {categoryName}
          </h1>
          {categoryDescription && (
            <p className="mt-1 text-sm text-muted-foreground">
              {categoryDescription}
            </p>
          )}
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
            icon={Package}
            title={`No listings in ${categoryName} yet`}
            description="Be the first to post a listing in this category"
            actionLabel="Post a Listing"
            actionHref="/post"
          />
        )}
      </div>
    </div>
  );
}
