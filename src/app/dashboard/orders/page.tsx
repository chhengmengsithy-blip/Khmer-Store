"use client";

import React from "react";
import { FadeIn } from "@/components/animations/motion-wrapper";
import { OrdersTable } from "@/features/dashboard/components/orders-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function OrdersPage() {
  return (
    <FadeIn className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-soft-white">Orders</h2>
        <p className="text-sm text-muted-foreground">
          Manage and track all your orders.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-surface border border-white/[0.06]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <OrdersTable />
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          <OrdersTable />
        </TabsContent>
        <TabsContent value="processing" className="mt-4">
          <OrdersTable />
        </TabsContent>
        <TabsContent value="shipped" className="mt-4">
          <OrdersTable />
        </TabsContent>
        <TabsContent value="delivered" className="mt-4">
          <OrdersTable />
        </TabsContent>
      </Tabs>
    </FadeIn>
  );
}
