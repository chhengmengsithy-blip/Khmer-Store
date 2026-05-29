"use client";

import React from "react";
import { FadeIn } from "@/components/animations/motion-wrapper";
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";
import { OrdersTable } from "@/features/dashboard/components/orders-table";
import { NotificationsPanel } from "@/features/dashboard/components/notifications-panel";

export default function DashboardPage() {
  return (
    <FadeIn className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-soft-white">Overview</h2>
        <p className="text-sm text-muted-foreground">
          Welcome back! Here is a summary of your account.
        </p>
      </div>

      <DashboardStats />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-soft-white">
            Recent Orders
          </h3>
          <OrdersTable />
        </div>
        <div>
          <NotificationsPanel />
        </div>
      </div>
    </FadeIn>
  );
}
