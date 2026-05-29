"use client";

import React from "react";
import {
  Star,
  ShieldCheck,
  Truck,
  Package,
  Heart,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageGallery } from "./image-gallery";
import { ReviewSection } from "./review-section";
import { ProductCard } from "@/components/marketplace/product-card";

const mockProduct = {
  id: "1",
  name: "Handwoven Krama Silk Scarf - Traditional Red Pattern",
  price: 89,
  compareAtPrice: 120,
  description:
    "Authentic handwoven Krama silk scarf featuring traditional Khmer patterns in rich red tones. Each piece is carefully crafted by skilled artisans in Takeo province using techniques passed down through generations. Made from 100% natural silk with eco-friendly dyes.",
  condition: "New",
  category: "Fashion & Apparel",
  stock: 12,
  shipping: "Free shipping on orders over $50",
  seller: {
    name: "Silk & Threads Co.",
    avatar: "ST",
    rating: 4.9,
    totalSales: 1240,
    verified: true,
    memberSince: "2022",
    responseTime: "< 1 hour",
  },
};

const relatedProducts = [
  { id: "r1", name: "Blue Krama Pattern Scarf", price: 75, seller: "Silk & Threads", rating: 4.7, image: null },
  { id: "r2", name: "Golden Thread Shawl", price: 110, seller: "Weave Studio", rating: 4.8, image: null },
  { id: "r3", name: "Cotton Krama Classic", price: 35, seller: "Heritage Cloth", rating: 4.6, image: null },
  { id: "r4", name: "Silk Blend Wrap", price: 95, seller: "Silk & Threads", rating: 4.9, image: null },
];

export function ProductDetail() {
  return (
    <div className="space-y-12">
      {/* Main Product Section */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <ImageGallery productName={mockProduct.name} />

        {/* Product Info */}
        <div className="space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="hover:text-soft-white cursor-pointer">Home</span>
            <span>/</span>
            <span className="hover:text-soft-white cursor-pointer">
              {mockProduct.category}
            </span>
            <span>/</span>
            <span className="text-soft-white">{mockProduct.name.slice(0, 20)}...</span>
          </div>

          {/* Title & Price */}
          <div>
            <h1 className="text-2xl font-bold text-soft-white">
              {mockProduct.name}
            </h1>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-3xl font-bold text-accent-gold">
                ${mockProduct.price.toLocaleString()}
              </span>
              {mockProduct.compareAtPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ${mockProduct.compareAtPrice.toLocaleString()}
                </span>
              )}
              {mockProduct.compareAtPrice && (
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                  {Math.round(
                    ((mockProduct.compareAtPrice - mockProduct.price) /
                      mockProduct.compareAtPrice) *
                      100
                  )}
                  % OFF
                </Badge>
              )}
            </div>
          </div>

          {/* Condition & Stock */}
          <div className="flex items-center gap-4">
            <Badge
              variant="outline"
              className="border-accent-gold/30 text-accent-gold"
            >
              {mockProduct.condition}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {mockProduct.stock} in stock
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {mockProduct.description}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <Button className="flex-1 bg-accent-gold text-background hover:bg-accent-gold/90 h-12 text-base font-semibold">
              Add to Cart
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-accent-gold/30 text-accent-gold hover:bg-accent-gold/10 h-12 text-base font-semibold"
            >
              Buy Now
            </Button>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent-gold gap-2">
              <Heart className="h-4 w-4" />
              Add to Wishlist
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-soft-white gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>

          <Separator className="bg-white/5" />

          {/* Shipping */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="h-4 w-4 text-accent-gold" />
              <span className="text-muted-foreground">
                {mockProduct.shipping}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Package className="h-4 w-4 text-accent-gold" />
              <span className="text-muted-foreground">
                Estimated delivery: 3-5 business days
              </span>
            </div>
          </div>

          <Separator className="bg-white/5" />

          {/* Seller Card */}
          <div className="rounded-xl border border-white/[0.06] bg-surface p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-accent-gold/10 text-accent-gold font-semibold">
                  {mockProduct.seller.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-soft-white">
                    {mockProduct.seller.name}
                  </span>
                  {mockProduct.seller.verified && (
                    <ShieldCheck className="h-4 w-4 text-accent-gold" />
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-accent-gold text-accent-gold" />
                    {mockProduct.seller.rating}
                  </div>
                  <span>{mockProduct.seller.totalSales} sales</span>
                  <span>Responds {mockProduct.seller.responseTime}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 text-muted-foreground hover:text-soft-white"
              >
                Visit Store
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewSection />

      {/* Related Products */}
      <div>
        <h3 className="mb-6 text-lg font-semibold text-soft-white">
          You May Also Like
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
