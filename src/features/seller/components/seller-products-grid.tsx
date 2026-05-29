"use client";

import React, { useState } from "react";
import { ProductCard } from "@/components/marketplace/product-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/motion-wrapper";

const sellerProducts = [
  { id: "sp1", name: "Handwoven Krama Silk Scarf", price: 89, seller: "Silk & Threads", rating: 4.9, image: null },
  { id: "sp2", name: "Blue Krama Pattern Scarf", price: 75, seller: "Silk & Threads", rating: 4.7, image: null },
  { id: "sp3", name: "Golden Thread Shawl", price: 110, seller: "Silk & Threads", rating: 4.8, image: null },
  { id: "sp4", name: "Silk Table Runner", price: 55, seller: "Silk & Threads", rating: 4.6, image: null },
  { id: "sp5", name: "Traditional Wedding Cloth", price: 250, seller: "Silk & Threads", rating: 5.0, image: null },
  { id: "sp6", name: "Cotton Krama Set (3-pack)", price: 45, seller: "Silk & Threads", rating: 4.8, image: null },
];

export function SellerProductsGrid() {
  const [sort, setSort] = useState("newest");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {sellerProducts.length} products
        </p>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[180px] border-white/10 bg-surface">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-elevated border-white/10">
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sellerProducts.map((product) => (
          <StaggerItem key={product.id}>
            <ProductCard product={product} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
