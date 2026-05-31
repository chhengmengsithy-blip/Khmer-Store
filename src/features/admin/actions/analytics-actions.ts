"use server";

import { createClient } from "@/lib/supabase/server";

export interface AdminAnalytics {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  activeListings: number;
  recentSignups: number;
  topProducts: {
    id: string;
    title: string;
    views_count: number;
    price: number;
  }[];
  recentOrders: {
    id: string;
    total: number;
    status: string;
    created_at: string;
    buyer_name?: string;
  }[];
}

export async function getAdminAnalytics(): Promise<AdminAnalytics> {
  const supabase = await createClient();

  // Query total users count
  const { count: totalUsers } = await supabase
    .from("users_extended")
    .select("*", { count: "exact", head: true });

  // Query total orders count
  const { count: totalOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  // Query total revenue (sum of orders with status confirmed/delivered)
  const { data: revenueData } = await supabase
    .from("orders")
    .select("total")
    .in("status", ["confirmed", "delivered"]);
  const totalRevenue =
    revenueData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;

  // Active listings
  const { count: activeListings } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  // Recent signups (last 7 days)
  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ).toISOString();
  const { count: recentSignups } = await supabase
    .from("users_extended")
    .select("*", { count: "exact", head: true })
    .gte("created_at", sevenDaysAgo);

  // Top products by views
  const { data: topProducts } = await supabase
    .from("products")
    .select("id, title, views_count, price")
    .order("views_count", { ascending: false })
    .limit(5);

  // Recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, total, status, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  return {
    totalUsers: totalUsers || 0,
    totalOrders: totalOrders || 0,
    totalRevenue,
    activeListings: activeListings || 0,
    recentSignups: recentSignups || 0,
    topProducts: topProducts || [],
    recentOrders: recentOrders || [],
  };
}

export interface DailyRevenue {
  date: string;
  revenue: number;
}

export async function getRevenueByDay(days = 7): Promise<DailyRevenue[]> {
  const supabase = await createClient();
  const startDate = new Date(
    Date.now() - days * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data: orders } = await supabase
    .from("orders")
    .select("total, created_at")
    .gte("created_at", startDate)
    .in("status", ["confirmed", "delivered"]);

  // Group by day
  const dailyMap: Record<string, number> = {};
  for (let i = 0; i < days; i++) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = date.toISOString().split("T")[0];
    dailyMap[key] = 0;
  }

  orders?.forEach((order) => {
    const key = new Date(order.created_at).toISOString().split("T")[0];
    if (dailyMap[key] !== undefined) {
      dailyMap[key] += order.total || 0;
    }
  });

  return Object.entries(dailyMap)
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
