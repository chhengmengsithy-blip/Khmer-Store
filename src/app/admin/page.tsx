"use client";

import React from "react";
import { AdminStats } from "@/features/admin/components/admin-stats";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-soft-white">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Platform overview and management
        </p>
      </div>

      <AdminStats />
    </div>
  );
}
