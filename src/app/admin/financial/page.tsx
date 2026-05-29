"use client";

import React from "react";
import { FinancialDashboard } from "@/features/admin/components/financial-dashboard";

export default function AdminFinancialPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-soft-white">Financial Overview</h1>
        <p className="mt-1 text-muted-foreground">
          Revenue, payouts, and escrow management
        </p>
      </div>

      <FinancialDashboard />
    </div>
  );
}
