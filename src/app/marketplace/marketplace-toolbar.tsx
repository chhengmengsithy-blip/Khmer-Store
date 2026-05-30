"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Grid3X3, List, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { MobileFilters } from "./marketplace-filters";

interface MarketplaceToolbarProps {
  totalResults: number;
  activeSort: string;
  view: string;
  activeCategory: string;
}

export function MarketplaceToolbar({
  totalResults,
  activeSort,
  view,
  activeCategory,
}: MarketplaceToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const buildUrl = (params: Record<string, string>) => {
    const current = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });
    return `/marketplace?${current.toString()}`;
  };

  const handleSortChange = (value: string) => {
    router.push(buildUrl({ sort: value }));
  };

  const handleViewChange = (newView: string) => {
    router.push(buildUrl({ view: newView }));
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {/* Mobile filter trigger */}
        <MobileFilters activeCategory={activeCategory} />

        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-soft-white">{totalResults}</span>{" "}
          listing{totalResults !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Sort dropdown */}
        <Select value={activeSort || "newest"} onValueChange={handleSortChange}>
          <SelectTrigger className="h-8 w-[140px] border-white/10 bg-white/5 text-xs text-soft-white">
            <ArrowUpDown className="mr-1.5 h-3 w-3" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-elevated border-white/10">
            <SelectItem value="newest">Latest</SelectItem>
            <SelectItem value="price-asc">Price: Low-High</SelectItem>
            <SelectItem value="price-desc">Price: High-Low</SelectItem>
            <SelectItem value="views">Most Viewed</SelectItem>
          </SelectContent>
        </Select>

        {/* View toggle */}
        <div className="hidden sm:flex items-center rounded-md border border-white/10 p-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewChange("grid")}
            className={cn(
              "h-7 w-7 p-0",
              view !== "list"
                ? "bg-elevated text-soft-white"
                : "text-muted-foreground"
            )}
          >
            <Grid3X3 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewChange("list")}
            className={cn(
              "h-7 w-7 p-0",
              view === "list"
                ? "bg-elevated text-soft-white"
                : "text-muted-foreground"
            )}
          >
            <List className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
