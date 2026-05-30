"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, ChevronDown, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { categories as allCategories, type CategoryItem } from "@/constants/categories";

interface MarketplaceFiltersProps {
  activeCategory: string;
  className?: string;
}

function FilterContent({ activeCategory }: { activeCategory: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState(searchParams.get("price_min") || "");
  const [priceMax, setPriceMax] = useState(searchParams.get("price_max") || "");

  const conditions = [
    { value: "new", label: "New" },
    { value: "like_new", label: "Like New" },
    { value: "used", label: "Used" },
  ];

  const activeCondition = searchParams.get("condition") || "";

  const toggleCategoryExpand = (catId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

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

  const handleCategoryClick = (slug: string) => {
    router.push(buildUrl({ category: slug === activeCategory ? "" : slug }));
  };

  const handleConditionClick = (value: string) => {
    router.push(buildUrl({ condition: value === activeCondition ? "" : value }));
  };

  const handlePriceFilter = () => {
    router.push(buildUrl({ price_min: priceMin, price_max: priceMax }));
  };

  const handleClearFilters = () => {
    const q = searchParams.get("q") || "";
    router.push(q ? `/marketplace?q=${q}` : "/marketplace");
  };

  const hasFilters = activeCategory || activeCondition || priceMin || priceMax;

  return (
    <div className="space-y-6">
      {/* Clear Filters */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="w-full justify-start text-muted-foreground hover:text-soft-white"
        >
          <X className="mr-2 h-3.5 w-3.5" />
          Clear all filters
        </Button>
      )}

      {/* Categories */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-soft-white">Categories</h3>
        <div className="space-y-0.5">
          {allCategories.map((cat: CategoryItem) => (
            <div key={cat.id}>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={cn(
                    "flex-1 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors",
                    activeCategory === cat.slug
                      ? "bg-accent-gold/10 text-accent-gold font-medium"
                      : "text-muted-foreground hover:text-soft-white hover:bg-elevated"
                  )}
                >
                  {cat.name}
                </button>
                {cat.subcategories.length > 0 && (
                  <button
                    type="button"
                    onClick={() => toggleCategoryExpand(cat.id)}
                    className="p-1 text-muted-foreground hover:text-soft-white"
                  >
                    {expandedCategories.includes(cat.id) ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" />
                    )}
                  </button>
                )}
              </div>
              {expandedCategories.includes(cat.id) &&
                cat.subcategories.length > 0 && (
                  <div className="ml-4 mt-0.5 space-y-0.5">
                    {cat.subcategories.map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => handleCategoryClick(sub.slug)}
                        className={cn(
                          "block w-full rounded-md px-2.5 py-1 text-left text-xs transition-colors",
                          activeCategory === sub.slug
                            ? "bg-accent-gold/10 text-accent-gold font-medium"
                            : "text-muted-foreground hover:text-soft-white hover:bg-elevated"
                        )}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-soft-white">Price Range</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="0"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="h-8 border-white/10 bg-white/5 text-sm text-soft-white placeholder:text-muted-foreground/60"
          />
          <span className="text-muted-foreground text-xs">-</span>
          <Input
            type="number"
            min="0"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="h-8 border-white/10 bg-white/5 text-sm text-soft-white placeholder:text-muted-foreground/60"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePriceFilter}
          className="mt-2 w-full border-white/10 text-xs"
        >
          Apply Price
        </Button>
      </div>

      {/* Condition */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-soft-white">Condition</h3>
        <div className="space-y-1.5">
          {conditions.map((cond) => (
            <button
              key={cond.value}
              type="button"
              onClick={() => handleConditionClick(cond.value)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                activeCondition === cond.value
                  ? "bg-accent-gold/10 text-accent-gold font-medium"
                  : "text-muted-foreground hover:text-soft-white hover:bg-elevated"
              )}
            >
              <div
                className={cn(
                  "h-3.5 w-3.5 rounded border transition-colors",
                  activeCondition === cond.value
                    ? "border-accent-gold bg-accent-gold"
                    : "border-white/20"
                )}
              />
              {cond.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MarketplaceFilters({
  activeCategory,
  className,
}: MarketplaceFiltersProps) {
  return (
    <aside className={cn("hidden lg:block", className)}>
      <div className="sticky top-24 rounded-lg border border-white/[0.06] bg-surface p-4">
        <FilterContent activeCategory={activeCategory} />
      </div>
    </aside>
  );
}

export function MobileFilters({ activeCategory }: { activeCategory: string }) {
  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 text-muted-foreground"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh] bg-surface border-white/[0.08]">
          <SheetHeader>
            <SheetTitle className="text-soft-white">Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-4 overflow-y-auto pr-2">
            <FilterContent activeCategory={activeCategory} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
