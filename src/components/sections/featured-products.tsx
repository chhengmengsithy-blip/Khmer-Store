"use client";

import React from "react";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { ProductCard } from "@/components/marketplace/product-card";

const mockProducts = [
  {
    id: "1",
    name: "Artisan Gold Necklace",
    price: 2450,
    seller: "Maison Luxe",
    rating: 4.9,
    image: null,
  },
  {
    id: "2",
    name: "Hand-painted Silk Scarf",
    price: 890,
    seller: "Atelier Phnom",
    rating: 4.8,
    image: null,
  },
  {
    id: "3",
    name: "Vintage Khmer Bracelet",
    price: 1250,
    seller: "Heritage Craft",
    rating: 5.0,
    image: null,
  },
  {
    id: "4",
    name: "Crystal Timepiece",
    price: 3200,
    seller: "Temps Moderne",
    rating: 4.7,
    image: null,
  },
  {
    id: "5",
    name: "Sapphire Pendant",
    price: 1890,
    seller: "Gem Palace",
    rating: 4.9,
    image: null,
  },
  {
    id: "6",
    name: "Silk Embroidered Clutch",
    price: 680,
    seller: "Velvet Studio",
    rating: 4.6,
    image: null,
  },
];

export function FeaturedProducts() {
  return (
    <section className="py-24 bg-surface/50">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <h2 className="font-playfair text-3xl font-bold text-soft-white">
            Featured Pieces
          </h2>
          <p className="mt-2 text-muted-foreground">
            Handpicked selections from verified sellers
          </p>
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockProducts.map((product, index) => (
            <ScrollReveal key={product.id} delay={index * 0.08}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
