"use client";

import React from "react";
import { FadeIn } from "@/components/animations/motion-wrapper";
import { SellerProductForm } from "@/features/dashboard/components/seller-product-form";

export default function NewProductPage() {
  return (
    <FadeIn className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-soft-white">Add New Product</h2>
        <p className="text-sm text-muted-foreground">
          Create a new product listing for your store.
        </p>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-surface p-6">
        <SellerProductForm />
      </div>
    </FadeIn>
  );
}
