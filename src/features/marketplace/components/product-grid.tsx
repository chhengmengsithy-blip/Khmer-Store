"use client";

import React, { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/marketplace/product-card";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/motion-wrapper";

interface ProductGridProps {
  searchQuery: string;
  category: string | null;
  sortBy: string;
  priceMin: string;
  priceMax: string;
  condition: string | null;
  minRating: number | null;
}

const mockProducts = [
  { id: "1", name: "Handwoven Krama Scarf", price: 45, seller: "Silk & Threads", rating: 4.8, image: null, category: "fashion" },
  { id: "2", name: "Kampot Pepper Collection", price: 28, seller: "Spice Artisan", rating: 4.9, image: null, category: "food" },
  { id: "3", name: "Silver Lotus Earrings", price: 120, seller: "Angkor Silver", rating: 4.7, image: null, category: "jewelry" },
  { id: "4", name: "Ceramic Rice Bowl Set", price: 65, seller: "Clay & Fire", rating: 4.6, image: null, category: "home" },
  { id: "5", name: "Palm Sugar Gift Box", price: 32, seller: "Sweet Earth", rating: 4.8, image: null, category: "food" },
  { id: "6", name: "Bamboo Basket Weave", price: 55, seller: "Nature Crafts", rating: 4.5, image: null, category: "home" },
  { id: "7", name: "Traditional Painting Print", price: 85, seller: "Khmer Art Co", rating: 4.9, image: null, category: "art" },
  { id: "8", name: "Organic Turmeric Powder", price: 18, seller: "Golden Harvest", rating: 4.7, image: null, category: "food" },
  { id: "9", name: "Handmade Leather Bag", price: 150, seller: "Leather Studio", rating: 4.6, image: null, category: "fashion" },
  { id: "10", name: "Coconut Oil Cold Press", price: 22, seller: "Island Fresh", rating: 4.8, image: null, category: "food" },
  { id: "11", name: "Apsara Dance Figurine", price: 95, seller: "Sacred Art", rating: 4.9, image: null, category: "art" },
  { id: "12", name: "Siem Reap Coffee Beans", price: 35, seller: "Bean & Brew", rating: 4.7, image: null, category: "food" },
];

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[4/5] w-full rounded-xl" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-32" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductGrid({
  searchQuery,
  category,
  sortBy,
  priceMin,
  priceMax,
  condition,
  minRating,
}: ProductGridProps) {
  // Condition filter is not applicable to mock data
  void condition;
  const [visibleCount, setVisibleCount] = useState(8);
  const [isLoading, setIsLoading] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(query));
    }

    // Category filter
    if (category) {
      result = result.filter((p) => p.category === category);
    }

    // Price range filter
    if (priceMin) {
      const min = parseFloat(priceMin);
      if (!isNaN(min)) {
        result = result.filter((p) => p.price >= min);
      }
    }
    if (priceMax) {
      const max = parseFloat(priceMax);
      if (!isNaN(max)) {
        result = result.filter((p) => p.price <= max);
      }
    }

    // Rating filter
    if (minRating !== null) {
      result = result.filter((p) => p.rating >= minRating);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
      default:
        // Keep original order
        break;
    }

    return result;
  }, [searchQuery, category, sortBy, priceMin, priceMax, minRating]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 4, filteredProducts.length));
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="flex-1">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {visibleProducts.length} of {filteredProducts.length} products
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-medium text-soft-white">No products found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleProducts.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            className="border-white/10 text-soft-white hover:border-accent-gold/30 hover:text-accent-gold"
            onClick={loadMore}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export { ProductGridSkeleton };
