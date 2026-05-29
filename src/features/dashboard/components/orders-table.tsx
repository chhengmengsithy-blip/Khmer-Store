"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  product: string;
  buyer: string;
  date: string;
  amount: number;
  status: string;
}

const mockOrders: Order[] = [
  { id: "#KS-001", product: "Handwoven Krama Scarf", buyer: "Sarah M.", date: "2024-01-15", amount: 89, status: "Delivered" },
  { id: "#KS-002", product: "Kampot Pepper Set", buyer: "David K.", date: "2024-01-14", amount: 28, status: "Shipped" },
  { id: "#KS-003", product: "Silver Lotus Earrings", buyer: "Lin C.", date: "2024-01-13", amount: 120, status: "Processing" },
  { id: "#KS-004", product: "Ceramic Bowl Set", buyer: "Michael R.", date: "2024-01-12", amount: 65, status: "Pending" },
  { id: "#KS-005", product: "Palm Sugar Box", buyer: "Anna T.", date: "2024-01-11", amount: 32, status: "Delivered" },
  { id: "#KS-006", product: "Traditional Painting", buyer: "James L.", date: "2024-01-10", amount: 85, status: "Disputed" },
];

const statusColors: Record<string, string> = {
  Pending: "border-yellow-500/30 text-yellow-400 bg-yellow-500/5",
  Processing: "border-blue-500/30 text-blue-400 bg-blue-500/5",
  Shipped: "border-purple-500/30 text-purple-400 bg-purple-500/5",
  Delivered: "border-green-500/30 text-green-400 bg-green-500/5",
  Disputed: "border-red-500/30 text-red-400 bg-red-500/5",
};

export function OrdersTable() {
  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-xl border border-white/[0.06] md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06] bg-surface">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Order ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02]"
              >
                <td className="px-4 py-3 text-sm font-mono text-accent-gold">
                  {order.id}
                </td>
                <td className="px-4 py-3 text-sm text-soft-white">
                  {order.product}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {order.buyer}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {new Date(order.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-soft-white">
                  ${order.amount.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={cn("text-xs", statusColors[order.status])}
                  >
                    {order.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-soft-white"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {mockOrders.map((order) => (
          <div
            key={order.id}
            className="rounded-xl border border-white/[0.06] bg-surface p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono text-accent-gold">
                {order.id}
              </span>
              <Badge
                variant="outline"
                className={cn("text-xs", statusColors[order.status])}
              >
                {order.status}
              </Badge>
            </div>
            <p className="text-sm text-soft-white">{order.product}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{order.buyer}</span>
              <span className="font-medium text-soft-white">
                ${order.amount.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
