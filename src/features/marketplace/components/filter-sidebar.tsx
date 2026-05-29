"use client";

import React, { useState } from "react";
import { ChevronDown, Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface FilterState {
  category: string | null;
  priceMin: string;
  priceMax: string;
  condition: string | null;
  verifiedOnly: boolean;
  minRating: number | null;
  sort: string;
}

const categories = [
  { id: "fashion", name: "Fashion & Apparel", count: 234 },
  { id: "jewelry", name: "Jewelry & Accessories", count: 156 },
  { id: "home", name: "Home & Living", count: 189 },
  { id: "food", name: "Food & Spices", count: 92 },
  { id: "art", name: "Art & Crafts", count: 78 },
  { id: "electronics", name: "Electronics", count: 45 },
];

const conditions = ["New", "Like New", "Used"];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

export function FilterSidebar() {
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    priceMin: "",
    priceMax: "",
    condition: null,
    verifiedOnly: false,
    minRating: null,
    sort: "newest",
  });

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    category: true,
    price: true,
    condition: true,
    seller: true,
    rating: true,
    sort: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <aside className="w-full space-y-6 lg:w-64">
      {/* Category */}
      <FilterSection
        title="Category"
        expanded={expandedSections.category}
        onToggle={() => toggleSection("category")}
      >
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  category: prev.category === cat.id ? null : cat.id,
                }))
              }
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                filters.category === cat.id
                  ? "bg-accent-gold/10 text-accent-gold"
                  : "text-muted-foreground hover:bg-white/5 hover:text-soft-white"
              )}
            >
              <span>{cat.name}</span>
              <span className="text-xs">{cat.count}</span>
            </button>
          ))}
        </div>
      </FilterSection>

      <Separator className="bg-white/5" />

      {/* Price Range */}
      <FilterSection
        title="Price Range"
        expanded={expandedSections.price}
        onToggle={() => toggleSection("price")}
      >
        <div className="flex items-center gap-2">
          <Input
            placeholder="Min"
            type="number"
            value={filters.priceMin}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, priceMin: e.target.value }))
            }
            className="h-9 bg-surface border-white/10"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            placeholder="Max"
            type="number"
            value={filters.priceMax}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, priceMax: e.target.value }))
            }
            className="h-9 bg-surface border-white/10"
          />
        </div>
      </FilterSection>

      <Separator className="bg-white/5" />

      {/* Condition */}
      <FilterSection
        title="Condition"
        expanded={expandedSections.condition}
        onToggle={() => toggleSection("condition")}
      >
        <div className="flex flex-wrap gap-2">
          {conditions.map((cond) => (
            <button
              key={cond}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  condition: prev.condition === cond ? null : cond,
                }))
              }
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition-colors",
                filters.condition === cond
                  ? "border-accent-gold bg-accent-gold/10 text-accent-gold"
                  : "border-white/10 text-muted-foreground hover:border-white/20"
              )}
            >
              {cond}
            </button>
          ))}
        </div>
      </FilterSection>

      <Separator className="bg-white/5" />

      {/* Verified Seller */}
      <FilterSection
        title="Seller"
        expanded={expandedSections.seller}
        onToggle={() => toggleSection("seller")}
      >
        <button
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              verifiedOnly: !prev.verifiedOnly,
            }))
          }
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
            filters.verifiedOnly
              ? "bg-accent-gold/10 text-accent-gold"
              : "text-muted-foreground hover:bg-white/5"
          )}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Verified Sellers Only</span>
        </button>
      </FilterSection>

      <Separator className="bg-white/5" />

      {/* Rating */}
      <FilterSection
        title="Minimum Rating"
        expanded={expandedSections.rating}
        onToggle={() => toggleSection("rating")}
      >
        <div className="space-y-1">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  minRating: prev.minRating === rating ? null : rating,
                }))
              }
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                filters.minRating === rating
                  ? "bg-accent-gold/10 text-accent-gold"
                  : "text-muted-foreground hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3",
                      i < rating
                        ? "fill-accent-gold text-accent-gold"
                        : "text-white/20"
                    )}
                  />
                ))}
              </div>
              <span>& up</span>
            </button>
          ))}
        </div>
      </FilterSection>

      <Separator className="bg-white/5" />

      {/* Sort */}
      <FilterSection
        title="Sort By"
        expanded={expandedSections.sort}
        onToggle={() => toggleSection("sort")}
      >
        <div className="space-y-1">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                setFilters((prev) => ({ ...prev, sort: opt.value }))
              }
              className={cn(
                "flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors",
                filters.sort === opt.value
                  ? "bg-accent-gold/10 text-accent-gold"
                  : "text-muted-foreground hover:bg-white/5"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Reset */}
      <Button
        variant="outline"
        className="w-full border-white/10 text-muted-foreground hover:text-soft-white"
        onClick={() =>
          setFilters({
            category: null,
            priceMin: "",
            priceMax: "",
            condition: null,
            verifiedOnly: false,
            minRating: null,
            sort: "newest",
          })
        }
      >
        Reset Filters
      </Button>
    </aside>
  );
}

function FilterSection({
  title,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-1"
      >
        <Label className="text-sm font-medium text-soft-white">{title}</Label>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            expanded && "rotate-180"
          )}
        />
      </button>
      {expanded && <div className="mt-3">{children}</div>}
    </div>
  );
}
