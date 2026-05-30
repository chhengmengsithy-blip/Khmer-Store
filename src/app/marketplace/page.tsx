"use client";

import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchBar } from "@/components/shared/search-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { categories } from "@/constants/categories";

const locations = [
  "Phnom Penh",
  "Siem Reap",
  "Battambang",
  "Kampong Cham",
  "Sihanoukville",
];

function FilterSidebar() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-soft-white mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label
              key={cat.slug}
              className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-soft-white"
            >
              <input
                type="checkbox"
                className="rounded border-white/20 bg-white/5 text-accent-gold focus:ring-accent-gold/20"
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-soft-white mb-3">
          Price Range
        </h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Max"
            className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-soft-white mb-3">Condition</h3>
        <div className="space-y-2">
          {["All", "New", "Used"].map((condition) => (
            <label
              key={condition}
              className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-soft-white"
            >
              <input
                type="radio"
                name="condition"
                defaultChecked={condition === "All"}
                className="border-white/20 bg-white/5 text-accent-gold focus:ring-accent-gold/20"
              />
              {condition}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-soft-white mb-3">Location</h3>
        <Select>
          <SelectTrigger className="border-white/10 bg-white/5 text-soft-white">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent className="bg-elevated border-white/10">
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";
  const locationParam = searchParams.get("location") || "";

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
            defaultQuery={query}
            defaultCategory={categoryParam}
            defaultLocation={locationParam}
          />
        </div>

        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 rounded-lg border border-white/[0.08] bg-surface p-4">
              <FilterSidebar />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile filter button */}
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <p className="text-sm text-muted-foreground">
                Showing all listings
              </p>
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/10"
                  >
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-80 bg-surface border-white/[0.08]"
                >
                  <SheetHeader>
                    <SheetTitle className="text-soft-white">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Empty State */}
            <EmptyState
              icon={Search}
              title="No listings found"
              description="Try adjusting your filters or be the first to post!"
              actionLabel="Post a Listing"
              actionHref="/post"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
