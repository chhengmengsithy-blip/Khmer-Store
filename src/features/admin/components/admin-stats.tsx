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

const statsData: StatCardProps[] = [
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

export function AdminStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {statsData.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
