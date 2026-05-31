"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";

interface RecentActivityProps {
  orders: {
    id: string;
    status: string;
    created_at: string;
    total: number;
  }[];
}

function getRelativeTime(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function RecentActivity({ orders }: RecentActivityProps) {
  return (
    <Card className="border-white/[0.06] bg-white/[0.02]">
      <CardHeader>
        <CardTitle className="text-soft-white">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity</p>
        ) : (
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-3 top-2 bottom-2 w-px bg-white/[0.06]" />

            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="relative flex items-start gap-4 pl-8">
                  {/* Timeline dot */}
                  <div className="absolute left-1.5 top-1 h-3 w-3 rounded-full border-2 border-accent-gold bg-[#0F1115]" />

                  {/* Event content */}
                  <div className="flex flex-1 items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-accent-gold/70" />
                      <span className="text-sm text-soft-white">
                        New order{" "}
                        <span className="font-mono text-muted-foreground">
                          #{order.id.substring(0, 8)}
                        </span>{" "}
                        for{" "}
                        <span className="font-medium text-accent-gold">
                          ${order.total.toFixed(2)}
                        </span>
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {getRelativeTime(order.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
