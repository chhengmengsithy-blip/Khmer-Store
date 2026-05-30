import { Users, Package, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAdminStats, getRecentListings } from "@/features/admin/actions/admin-actions";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();
  const recentListings = await getRecentListings();

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
    },
    {
      label: "Total Listings",
      value: stats.totalListings,
      icon: Package,
    },
    {
      label: "Active Listings",
      value: stats.activeListings,
      icon: CheckCircle,
    },
    {
      label: "Pending Reports",
      value: stats.pendingReports,
      icon: AlertTriangle,
    },
  ];

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
        {statCards.map((stat) => (
          <Card
            key={stat.label}
            className="border-white/[0.08] bg-surface"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-soft-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-accent-gold/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-accent-gold" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Listings */}
      <Card className="border-white/[0.08] bg-surface">
        <CardHeader>
          <CardTitle className="text-soft-white">Recent Listings</CardTitle>
        </CardHeader>
        <CardContent>
          {recentListings.length === 0 ? (
            <p className="text-muted-foreground text-sm">No listings yet.</p>
          ) : (
            <div className="space-y-3">
              {recentListings.map((listing) => (
                <div
                  key={listing.id}
                  className="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-soft-white truncate">
                      {listing.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      by {listing.seller_name}
                    </p>
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
    </div>
  );
}
