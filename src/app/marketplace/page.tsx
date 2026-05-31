"use client";

import React, { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  FilterSidebar,
  FilterState,
  defaultFilterState,
} from "@/features/marketplace/components/filter-sidebar";
import { ProductGrid } from "@/features/marketplace/components/product-grid";
import { SearchOverlay } from "@/features/marketplace/components/search-overlay";
import { FadeIn } from "@/components/animations/motion-wrapper";
import { useDebounce } from "@/hooks/use-debounce";

export default function MarketplacePage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(defaultFilterState);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <main className="min-h-screen bg-background">
      <FadeIn>
        {/* Search Header */}
        <div className="border-b border-white/[0.06] bg-surface/50">
          <div className="container mx-auto px-4 py-4">
            {/* Breadcrumbs */}
            <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="hover:text-soft-white cursor-pointer">Home</span>
              <span>/</span>
              <span className="text-soft-white">Marketplace</span>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3">
              <div
                className="relative flex-1 cursor-pointer"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <div className="flex h-10 w-full items-center rounded-lg border border-white/10 bg-elevated pl-10 pr-4 text-sm text-muted-foreground">
                  {searchQuery || "Search products, sellers, categories..."}
                  <span className="ml-auto hidden text-xs text-muted-foreground sm:block">
                    Cmd+K
                  </span>
                </div>
              </div>

              {/* Mobile Filter Toggle */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-white/10 lg:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 bg-background border-white/[0.06] p-6">
                  <FilterSidebar filters={filters} onFiltersChange={setFilters} />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Desktop Filter Sidebar */}
            <div className="hidden lg:block">
              <FilterSidebar filters={filters} onFiltersChange={setFilters} />
            </div>

            {/* Product Grid */}
            <ProductGrid
              searchQuery={debouncedSearch}
              category={filters.category}
              sortBy={filters.sort}
              priceMin={filters.priceMin}
              priceMax={filters.priceMax}
              condition={filters.condition}
              minRating={filters.minRating}
            />
          </div>
        </div>
      </FadeIn>

      {/* Search Overlay */}
      <SearchOverlay
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSearch={handleSearch}
      />
    </main>
  );
}
