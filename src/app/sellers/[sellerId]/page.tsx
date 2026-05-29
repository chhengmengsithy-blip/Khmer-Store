"use client";

import React from "react";
import { FadeIn } from "@/components/animations/motion-wrapper";
import { SellerProfileCard } from "@/features/seller/components/seller-profile-card";
import { SellerProductsGrid } from "@/features/seller/components/seller-products-grid";
import { Separator } from "@/components/ui/separator";

export default function SellerProfilePage() {
  return (
    <main className="min-h-screen bg-background">
      <FadeIn>
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="hover:text-soft-white cursor-pointer">Home</span>
            <span>/</span>
            <span className="hover:text-soft-white cursor-pointer">Sellers</span>
            <span>/</span>
            <span className="text-soft-white">Silk & Threads Co.</span>
          </div>

          <SellerProfileCard />
          <Separator className="bg-white/5" />
          <div>
            <h3 className="mb-6 text-lg font-semibold text-soft-white">
              Products
            </h3>
            <SellerProductsGrid />
          </div>
        </div>
      </FadeIn>
    </main>
  );
}
