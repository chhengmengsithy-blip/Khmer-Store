"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";
import type { DailyRevenue } from "@/features/admin/actions/analytics-actions";

interface StatCardLiveProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
}

export function StatCardLive({
  title,
  value,
  icon: Icon,
  trend,
}: StatCardLiveProps) {
  return (
    <Card className="border-white/[0.06] bg-white/[0.02]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-soft-white">{value}</p>
            {trend && <p className="text-xs text-green-400">{trend}</p>}
          </div>
          <div className="rounded-lg bg-accent-gold/10 p-3">
            <Icon className="h-5 w-5 text-accent-gold" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface RevenueChartProps {
  data: DailyRevenue[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <Card className="border-white/[0.06] bg-white/[0.02]">
      <CardHeader>
        <CardTitle className="text-soft-white">Revenue (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No revenue data</p>
        ) : (
          <div className="flex items-end gap-2 h-48">
            {data.map((item) => {
              const percentage = (item.revenue / maxRevenue) * 100;
              const dayLabel = new Date(item.date + "T00:00:00").toLocaleDateString(
                "en-US",
                { weekday: "short" }
              );
              return (
                <div
                  key={item.date}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <span className="text-xs text-muted-foreground">
                    {item.revenue > 0 ? `$${item.revenue.toFixed(0)}` : ""}
                  </span>
                  <div className="relative w-full flex items-end justify-center h-36">
                    <div
                      style={{ height: `${Math.max(percentage, 2)}%` }}
                      className="w-full max-w-8 rounded-t bg-accent-gold/80 transition-all"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {dayLabel}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface TopProductsListProps {
  products: { title: string; views_count: number; price: number }[];
}

export function TopProductsList({ products }: TopProductsListProps) {
  return (
    <Card className="border-white/[0.06] bg-white/[0.02]">
      <CardHeader>
        <CardTitle className="text-soft-white">Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <p className="text-sm text-muted-foreground">No products yet</p>
        ) : (
          <div className="space-y-3">
            {products.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.01] p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-gold/10 text-xs font-bold text-accent-gold">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-soft-white truncate max-w-[160px]">
                    {product.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-white/[0.06] text-muted-foreground border-white/[0.06]">
                    {product.views_count} views
                  </Badge>
                  <span className="text-sm font-medium text-accent-gold">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface RecentOrdersTableProps {
  orders: { id: string; total: number; status: string; created_at: string }[];
}

function getStatusBadgeClasses(status: string): string {
  switch (status) {
    case "confirmed":
      return "bg-green-500/20 text-green-300 border-green-500/30";
    case "pending":
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    case "cancelled":
      return "bg-red-500/20 text-red-300 border-red-500/30";
    case "delivered":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    default:
      return "bg-white/[0.06] text-muted-foreground border-white/[0.06]";
  }
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <Card className="border-white/[0.06] bg-white/[0.02]">
      <CardHeader>
        <CardTitle className="text-soft-white">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders yet</p>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.01] p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-muted-foreground">
                    #{order.id.substring(0, 8)}
                  </span>
                  <span className="text-sm font-medium text-soft-white">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusBadgeClasses(order.status)}>
                    {order.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
