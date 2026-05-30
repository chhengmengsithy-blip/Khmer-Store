"use client";

import React, { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateOrderStatus } from "@/features/dashboard/actions/order-actions";
import type { Order, OrderStatus } from "@/types";

interface OrdersTableProps {
  orders?: Order[];
  isSeller?: boolean;
}

const statusColors: Record<string, string> = {
  pending: "border-yellow-500/30 text-yellow-400 bg-yellow-500/5",
  confirmed: "border-blue-500/30 text-blue-400 bg-blue-500/5",
  processing: "border-blue-500/30 text-blue-400 bg-blue-500/5",
  shipped: "border-purple-500/30 text-purple-400 bg-purple-500/5",
  delivered: "border-green-500/30 text-green-400 bg-green-500/5",
  cancelled: "border-red-500/30 text-red-400 bg-red-500/5",
  refunded: "border-red-500/30 text-red-400 bg-red-500/5",
};

function getItemsFromNotes(notes: string | null): string {
  if (!notes) return "N/A";
  try {
    const parsed = JSON.parse(notes);
    if (parsed.items && Array.isArray(parsed.items)) {
      return parsed.items
        .map(
          (item: { product_name: string; quantity: number }) =>
            `${item.product_name} x${item.quantity}`
        )
        .join(", ");
    }
    return "N/A";
  } catch {
    return notes.slice(0, 50);
  }
}

function StatusSelector({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<OrderStatus>(currentStatus);

  const nextStatuses: Record<string, OrderStatus[]> = {
    pending: ["processing", "cancelled"],
    confirmed: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["delivered"],
  };

  const available = nextStatuses[status] || [];

  if (available.length === 0) {
    return null;
  }

  const handleStatusChange = (newStatus: OrderStatus) => {
    setError(null);
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.error) {
        setError(result.error);
      } else {
        setStatus(newStatus);
      }
    });
  };

  return (
    <div className="flex items-center gap-1">
      {isPending && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
      {error && (
        <span className="text-xs text-red-400" title={error}>
          !
        </span>
      )}
      <select
        disabled={isPending}
        className="rounded border border-white/10 bg-elevated px-2 py-1 text-xs text-soft-white"
        value=""
        onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
      >
        <option value="" disabled>
          Update
        </option>
        {available.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

function OrderRow({
  order,
  isSeller,
}: {
  order: Order;
  isSeller: boolean;
}) {
  const items = getItemsFromNotes(order.notes);
  const date = new Date(order.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <tr className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02]">
      <td className="px-4 py-3 text-sm font-mono text-accent-gold">
        {order.id.slice(0, 8)}
      </td>
      <td className="px-4 py-3 text-sm text-soft-white max-w-[200px] truncate">
        {items}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{date}</td>
      <td className="px-4 py-3 text-sm font-medium text-soft-white">
        ${order.total.toFixed(2)}
      </td>
      <td className="px-4 py-3">
        <Badge
          variant="outline"
          className={cn("text-xs", statusColors[order.status])}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {isSeller && (
            <StatusSelector orderId={order.id} currentStatus={order.status} />
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-soft-white"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

function OrderCard({
  order,
  isSeller,
}: {
  order: Order;
  isSeller: boolean;
}) {
  const items = getItemsFromNotes(order.notes);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-surface p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-mono text-accent-gold">
          {order.id.slice(0, 8)}
        </span>
        <Badge
          variant="outline"
          className={cn("text-xs", statusColors[order.status])}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </div>
      <p className="text-sm text-soft-white truncate">{items}</p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {new Date(order.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
        <span className="font-medium text-soft-white">
          ${order.total.toFixed(2)}
        </span>
      </div>
      {isSeller && (
        <div className="pt-1">
          <StatusSelector orderId={order.id} currentStatus={order.status} />
        </div>
      )}
    </div>
  );
}

export function OrdersTable({ orders = [], isSeller = false }: OrdersTableProps) {
  const filterOrders = (status?: string) => {
    if (!status || status === "all") return orders;
    return orders.filter((o) => o.status === status);
  };

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-surface p-8 text-center">
        <p className="text-muted-foreground">No orders found.</p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="bg-surface border border-white/[0.06]">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="processing">Processing</TabsTrigger>
        <TabsTrigger value="shipped">Shipped</TabsTrigger>
        <TabsTrigger value="delivered">Delivered</TabsTrigger>
      </TabsList>

      {["all", "pending", "processing", "shipped", "delivered"].map((tab) => (
        <TabsContent key={tab} value={tab} className="mt-4">
          <OrderList
            orders={filterOrders(tab)}
            isSeller={isSeller}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function OrderList({
  orders,
  isSeller,
}: {
  orders: Order[];
  isSeller: boolean;
}) {
  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-surface p-6 text-center">
        <p className="text-sm text-muted-foreground">
          No orders in this category.
        </p>
      </div>
    );
  }

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
                Items
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
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} isSeller={isSeller} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} isSeller={isSeller} />
        ))}
      </div>
    </div>
  );
}
