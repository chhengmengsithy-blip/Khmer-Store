"use client";

import React from "react";
import { ProductDetail } from "@/features/marketplace/components/product-detail";
import { FadeIn } from "@/components/animations/motion-wrapper";

export default function ProductDetailPage() {
  return (
    <main className="min-h-screen bg-background">
      <FadeIn>
        <div className="container mx-auto px-4 py-8">
          <ProductDetail />
        </div>
      </FadeIn>
    </main>
  );
}
