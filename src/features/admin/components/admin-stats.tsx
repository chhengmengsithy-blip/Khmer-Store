"use client";

import React from "react";
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  DollarSign,
  ShieldAlert,
  Package,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
}

function StatCard({ title, value, change, changeType, icon: Icon }: StatCardProps) {
  return (
    <Card className="border-white/[0.06] bg-white/[0.02]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-soft-white">{value}</p>
            <p
              className={
                changeType === "positive"
                  ? "text-xs text-green-400"
                  : changeType === "negative"
                    ? "text-xs text-red-400"
                    : "text-xs text-muted-foreground"
              }
            >
              {change}
            </p>
          </div>
          <div className="rounded-lg bg-accent-gold/10 p-3">
            <Icon className="h-5 w-5 text-accent-gold" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card className="border-white/[0.06] bg-white/[0.02]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-11 w-11 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

interface AdminStatsData {
  totalUsers?: number;
  totalOrders?: number;
  revenue?: number;
  activeListings?: number;
  recentSignups?: number;
}

interface AdminStatsProps {
  data?: AdminStatsData;
  loading?: boolean;
}

const mockStatsData: StatCardProps[] = [
  {
    title: "Total Users",
    value: "12,847",
    change: "+342 this week",
    changeType: "positive",
    icon: Users,
  },
  {
    title: "Pending Verifications",
    value: "28",
    change: "5 urgent (>48h)",
    changeType: "negative",
    icon: ShieldCheck,
  },
  {
    title: "Active Disputes",
    value: "7",
    change: "-2 from yesterday",
    changeType: "positive",
    icon: AlertTriangle,
  },
  {
    title: "Revenue Today",
    value: "$4,289",
    change: "+12% vs avg",
    changeType: "positive",
    icon: DollarSign,
  },
  {
    title: "Fraud Alerts",
    value: "3",
    change: "1 high priority",
    changeType: "negative",
    icon: ShieldAlert,
  },
  {
    title: "Active Listings",
    value: "8,432",
    change: "+89 today",
    changeType: "positive",
    icon: Package,
  },
];

function buildStatsFromData(data: AdminStatsData): StatCardProps[] {
  return [
    {
      title: "Total Users",
      value: (data.totalUsers ?? 0).toLocaleString(),
      change: data.recentSignups ? `+${data.recentSignups} this week` : "No new signups",
      changeType: data.recentSignups ? "positive" : "neutral",
      icon: Users,
    },
    {
      title: "Pending Verifications",
      value: "28",
      change: "5 urgent (>48h)",
      changeType: "negative",
      icon: ShieldCheck,
    },
    {
      title: "Active Disputes",
      value: "7",
      change: "-2 from yesterday",
      changeType: "positive",
      icon: AlertTriangle,
    },
    {
      title: "Total Revenue",
      value: `$${(data.revenue ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: `${data.totalOrders ?? 0} total orders`,
      changeType: "positive",
      icon: DollarSign,
    },
    {
      title: "Fraud Alerts",
      value: "3",
      change: "1 high priority",
      changeType: "negative",
      icon: ShieldAlert,
    },
    {
      title: "Active Listings",
      value: (data.activeListings ?? 0).toLocaleString(),
      change: "Published products",
      changeType: "positive",
      icon: Package,
    },
  ];
}

export function AdminStats({ data, loading }: AdminStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const statsToShow = data ? buildStatsFromData(data) : mockStatsData;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {statsToShow.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
