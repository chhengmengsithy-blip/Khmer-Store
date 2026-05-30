import { Search, Package } from "lucide-react";
import { ListingCard } from "@/components/shared/listing-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getListings } from "@/features/listings/actions/listing-actions";
import { MarketplaceFilters } from "./marketplace-filters";
import { MarketplaceToolbar } from "./marketplace-toolbar";
import { MarketplacePagination } from "./marketplace-pagination";

interface MarketplacePageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    location?: string;
    page?: string;
    view?: string;
    condition?: string;
    price_min?: string;
    price_max?: string;
  }>;
}

const ITEMS_PER_PAGE = 12;

export default async function MarketplacePage({
  searchParams,
}: MarketplacePageProps) {
  const params = await searchParams;
  const search = params.q || "";
  const category = params.category || "";
  const sort = params.sort || "";
  const view = params.view || "grid";
  const page = Math.max(1, parseInt(params.page || "1", 10));

  const { data: allListings } = await getListings({
    search: search || undefined,
    category: category || undefined,
    sort: sort || undefined,
  });

  // Client-side pagination
  const totalPages = Math.max(1, Math.ceil(allListings.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const listings = allListings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        {/* Breadcrumbs */}
        <Breadcrumbs className="mb-4" />

        {/* Layout: Sidebar + Main */}
        <div className="flex gap-6">
          {/* Sidebar Filters (desktop) */}
          <MarketplaceFilters activeCategory={category} className="w-60 flex-shrink-0" />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar: results count + sort + view toggle */}
            <div className="mb-4">
              <MarketplaceToolbar
                totalResults={allListings.length}
                activeSort={sort}
                view={view}
                activeCategory={category}
              />
            </div>

            {/* Listings */}
            {listings.length > 0 ? (
              <>
                <div
                  className={
                    view === "list"
                      ? "space-y-3"
                      : "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
                  }
                >
                  {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>

                {/* Pagination */}
                <MarketplacePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              </>
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
      </div>
    </div>
  );
}
