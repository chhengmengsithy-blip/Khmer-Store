"use client";

import React from "react";
import { TrendingUp, TrendingDown, ShoppingBag, DollarSign, Clock, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCard {
  label: string;
  value: string;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
}

const stats: StatCard[] = [
  {
    label: "Total Orders",
    value: "156",
    change: 12.5,
    icon: ShoppingBag,
  },
  {
    label: "Total Earned",
    value: "$12,450",
    change: 8.2,
    icon: DollarSign,
  },
  {
    label: "Pending Items",
    value: "7",
    change: -3.1,
    icon: Clock,
  },
  {
    label: "Wallet Balance",
    value: "$2,340",
    change: 15.0,
    icon: Wallet,
  },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-white/[0.06] bg-surface p-5 space-y-3 transition-all duration-300 hover:border-accent-gold/20 hover:shadow-md hover:shadow-accent-gold/5"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-gold/10">
              <stat.icon className="h-4 w-4 text-accent-gold" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-soft-white">{stat.value}</p>
            <div className="mt-1 flex items-center gap-1">
              {stat.change >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-400" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-400" />
              )}
              <span
                className={cn(
                  "text-xs",
                  stat.change >= 0 ? "text-green-400" : "text-red-400"
                )}
              >
                {Math.abs(stat.change)}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
