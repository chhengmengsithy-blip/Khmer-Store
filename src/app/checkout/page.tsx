"use client";

import React from "react";
import { FadeIn } from "@/components/animations/motion-wrapper";
import { CheckoutFlow } from "@/features/checkout/components/checkout-flow";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-background">
      <FadeIn>
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-8 text-2xl font-bold text-soft-white text-center">
            Checkout
          </h1>
          <CheckoutFlow />
        </div>
      </FadeIn>
    </main>
  );
}
