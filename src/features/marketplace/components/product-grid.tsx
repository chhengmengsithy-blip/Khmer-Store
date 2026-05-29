"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/marketplace/product-card";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/motion-wrapper";

const mockProducts = [
  { id: "1", name: "Handwoven Krama Scarf", price: 45, seller: "Silk & Threads", rating: 4.8, image: null },
  { id: "2", name: "Kampot Pepper Collection", price: 28, seller: "Spice Artisan", rating: 4.9, image: null },
  { id: "3", name: "Silver Lotus Earrings", price: 120, seller: "Angkor Silver", rating: 4.7, image: null },
  { id: "4", name: "Ceramic Rice Bowl Set", price: 65, seller: "Clay & Fire", rating: 4.6, image: null },
  { id: "5", name: "Palm Sugar Gift Box", price: 32, seller: "Sweet Earth", rating: 4.8, image: null },
  { id: "6", name: "Bamboo Basket Weave", price: 55, seller: "Nature Crafts", rating: 4.5, image: null },
  { id: "7", name: "Traditional Painting Print", price: 85, seller: "Khmer Art Co", rating: 4.9, image: null },
  { id: "8", name: "Organic Turmeric Powder", price: 18, seller: "Golden Harvest", rating: 4.7, image: null },
  { id: "9", name: "Handmade Leather Bag", price: 150, seller: "Leather Studio", rating: 4.6, image: null },
  { id: "10", name: "Coconut Oil Cold Press", price: 22, seller: "Island Fresh", rating: 4.8, image: null },
  { id: "11", name: "Apsara Dance Figurine", price: 95, seller: "Sacred Art", rating: 4.9, image: null },
  { id: "12", name: "Siem Reap Coffee Beans", price: 35, seller: "Bean & Brew", rating: 4.7, image: null },
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

export function ProductGrid() {
  const [visibleCount, setVisibleCount] = useState(8);
  const [isLoading, setIsLoading] = useState(false);

  const visibleProducts = mockProducts.slice(0, visibleCount);
  const hasMore = visibleCount < mockProducts.length;

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 4, mockProducts.length));
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="flex-1">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {visibleProducts.length} of {mockProducts.length} products
        </p>
      </div>

      <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleProducts.map((product) => (
          <StaggerItem key={product.id}>
            <ProductCard product={product} />
          </StaggerItem>
        ))}
      </StaggerContainer>

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
