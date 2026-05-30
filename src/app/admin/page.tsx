"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Package,
  CheckCircle,
  AlertTriangle,
  Plus,
  Flag,
  Download,
  Activity,
  Database,
  HardDrive,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/shared/stats-card";
import { getAdminStats, getRecentListings } from "@/features/admin/actions/admin-actions";

interface Stats {
  totalUsers: number;
  totalListings: number;
  activeListings: number;
  pendingReports: number;
}

interface RecentListing {
  id: string;
  title: string;
  status: string;
  created_at: string;
  seller_name: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalListings: 0,
    activeListings: 0,
    pendingReports: 0,
  });
  const [recentListings, setRecentListings] = useState<RecentListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([getAdminStats(), getRecentListings()]).then(
      ([statsData, listingsData]) => {
        if (mounted) {
          setStats(statsData);
          setRecentListings(listingsData as RecentListing[]);
          setLoading(false);
        }
      }
    );
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-playfair text-soft-white">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of your marketplace
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={Users}
          value={stats.totalUsers}
          label="Total Users"
          trend={{ direction: "up", percentage: 12 }}
        />
        <StatsCard
          icon={Package}
          value={stats.totalListings}
          label="Total Listings"
          trend={{ direction: "up", percentage: 8 }}
        />
        <StatsCard
          icon={CheckCircle}
          value={stats.activeListings}
          label="Active Listings"
          trend={{ direction: "up", percentage: 5 }}
        />
        <StatsCard
          icon={AlertTriangle}
          value={stats.pendingReports}
          label="Pending Reports"
          trend={
            stats.pendingReports > 0
              ? { direction: "up", percentage: 3 }
              : undefined
          }
        />
      </div>

      {/* Revenue Chart Placeholder + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue placeholder */}
        <Card className="lg:col-span-2 border-white/[0.06] bg-surface relative overflow-hidden">
          <CardHeader>
            <CardTitle className="text-soft-white text-base">
              Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/5 to-transparent rounded-lg" />
              <div className="text-center relative z-10">
                <Activity className="h-8 w-8 text-accent-gold/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Coming Soon</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Revenue analytics will be available here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-white/[0.06] bg-surface">
          <CardHeader>
            <CardTitle className="text-soft-white text-base">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/categories" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-soft-white hover:bg-elevated"
              >
                <Plus className="h-4 w-4 mr-3 text-accent-gold" />
                Add Category
              </Button>
            </Link>
            <Link href="/admin/reports" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-soft-white hover:bg-elevated"
              >
                <Flag className="h-4 w-4 mr-3 text-accent-gold" />
                View Reports
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-soft-white hover:bg-elevated"
              disabled
            >
              <Download className="h-4 w-4 mr-3 text-accent-gold" />
              Export Data
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed + System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-white/[0.06] bg-surface">
          <CardHeader>
            <CardTitle className="text-soft-white text-base">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground text-sm">Loading...</p>
            ) : recentListings.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No recent activity
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="h-8 w-8 rounded-lg bg-accent-gold/10 flex items-center justify-center shrink-0">
                        <Package className="h-4 w-4 text-accent-gold" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-soft-white truncate">
                          {listing.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          by {listing.seller_name} &middot;{" "}
                          {new Date(listing.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={
                        listing.status === "active"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : listing.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                            : "bg-muted text-muted-foreground"
                      }
                    >
                      {listing.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="border-white/[0.06] bg-surface">
          <CardHeader>
            <CardTitle className="text-soft-white text-base">
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-soft-white">Database</span>
              </div>
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                Connected
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-soft-white">Storage</span>
              </div>
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-soft-white">API</span>
              </div>
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                Healthy
              </Badge>
            </div>
            <div className="pt-3 mt-3 border-t border-white/[0.06]">
              <p className="text-xs text-muted-foreground">
                App Version: <span className="text-soft-white">V4.0.0</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
