"use client";

import React from "react";
import { FadeIn } from "@/components/animations/motion-wrapper";
import { WalletUI } from "@/features/dashboard/components/wallet-ui";

export default function WalletPage() {
  return (
    <FadeIn className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-soft-white">Wallet</h2>
        <p className="text-sm text-muted-foreground">
          Manage your balance, view transactions, and withdraw funds.
        </p>
      </div>

      <WalletUI />
    </FadeIn>
  );
}
