"use client";

import React, { useEffect, useState } from "react";
import { Users, ShoppingCart, DollarSign, Package } from "lucide-react";
import { AdminStats } from "@/features/admin/components/admin-stats";
import {
  getAdminAnalytics,
  getRevenueByDay,
} from "@/features/admin/actions/analytics-actions";
import type {
  AdminAnalytics,
  DailyRevenue,
} from "@/features/admin/actions/analytics-actions";
import {
  StatCardLive,
  RevenueChart,
  TopProductsList,
  RecentOrdersTable,
} from "@/features/admin/components/analytics-charts";
import { RecentActivity } from "@/features/admin/components/recent-activity";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [revenueData, setRevenueData] = useState<DailyRevenue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [analyticsResult, revenueResult] = await Promise.all([
          getAdminAnalytics(),
          getRevenueByDay(7),
        ]);
        setAnalytics(analyticsResult);
        setRevenueData(revenueResult);
      } catch {
        // Gracefully handle errors - show empty state
        setAnalytics({
          totalUsers: 0,
          totalOrders: 0,
          totalRevenue: 0,
          activeListings: 0,
          recentSignups: 0,
          topProducts: [],
          recentOrders: [],
        });
        setRevenueData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-soft-white">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Platform overview and management
        </p>
      </div>

      {/* Live Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[104px] rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCardLive
            title="Total Users"
            value={analytics?.totalUsers ?? 0}
            icon={Users}
            trend={
              analytics?.recentSignups
                ? `+${analytics.recentSignups} this week`
                : undefined
            }
          />
          <StatCardLive
            title="Total Orders"
            value={analytics?.totalOrders ?? 0}
            icon={ShoppingCart}
          />
          <StatCardLive
            title="Revenue"
            value={`$${(analytics?.totalRevenue ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={DollarSign}
          />
          <StatCardLive
            title="Active Listings"
            value={analytics?.activeListings ?? 0}
            icon={Package}
          />
        </div>
      )}

      {/* Revenue Chart */}
      {loading ? (
        <Skeleton className="h-[280px] rounded-xl" />
      ) : (
        <RevenueChart data={revenueData} />
      )}

      {/* Top Products and Recent Orders side by side */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-[300px] rounded-xl" />
          <Skeleton className="h-[300px] rounded-xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TopProductsList products={analytics?.topProducts ?? []} />
          <RecentOrdersTable orders={analytics?.recentOrders ?? []} />
        </div>
      )}

      {/* Recent Activity */}
      {loading ? (
        <Skeleton className="h-[200px] rounded-xl" />
      ) : (
        <RecentActivity orders={analytics?.recentOrders ?? []} />
      )}

      {/* Legacy Stats Section */}
      <div className="pt-4 border-t border-white/[0.06]">
        <h2 className="text-lg font-semibold text-soft-white mb-4">
          Detailed Stats
        </h2>
        <AdminStats
          data={
            analytics
              ? {
                  totalUsers: analytics.totalUsers,
                  totalOrders: analytics.totalOrders,
                  revenue: analytics.totalRevenue,
                  activeListings: analytics.activeListings,
                  recentSignups: analytics.recentSignups,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
