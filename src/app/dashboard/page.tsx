import Link from "next/link";
import {
  Package,
  Eye,
  Heart,
  MessageSquare,
  Plus,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getUserListings } from "@/features/listings/actions/listing-actions";
import { getUserFavorites } from "@/features/listings/actions/favorite-actions";
import { getConversations } from "@/features/messages/actions/message-actions";
import { createClient } from "@/lib/supabase/server";
import type { Listing } from "@/types";
import { DashboardTabs } from "./dashboard-tabs";

function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-400",
    pending: "bg-yellow-500/10 text-yellow-400",
    sold: "bg-blue-500/10 text-blue-400",
    removed: "bg-red-500/10 text-red-400",
  };
  return styles[status] || styles.active;
}

export default async function DashboardPage() {
  const supabase = await createClient();

  let listings: Listing[] = [];
  let favorites: (Record<string, unknown> & { listings: Listing | null })[] = [];
  let totalViews = 0;
  let favoritesReceived = 0;
  let messageCount = 0;
  let profileData: { full_name: string | null; avatar_url: string | null; phone: string | null; location: string | null } | null = null;

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      listings = await getUserListings();
      favorites = await getUserFavorites();
      totalViews = listings.reduce((sum, l) => sum + (l.views_count || 0), 0);

      const conversations = await getConversations();
      messageCount = Array.isArray(conversations) ? conversations.length : 0;

      // Count favorites received on user's listings
      const { count } = await supabase
        .from("favorites")
        .select("id, listings!inner(user_id)", { count: "exact", head: true })
        .eq("listings.user_id", user.id);
      favoritesReceived = count || 0;

      // Get profile for completion
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, phone, location")
        .eq("id", user.id)
        .single();
      profileData = profile;
    }
  }

  // Calculate account completion
  const completionChecks = [
    !!profileData?.full_name,
    !!profileData?.avatar_url,
    !!profileData?.phone,
    !!profileData?.location,
  ];
  const completionPercent = Math.round(
    (completionChecks.filter(Boolean).length / completionChecks.length) * 100
  );

  const stats = [
    { label: "My Listings", value: listings.length, icon: Package },
    { label: "Total Views", value: totalViews, icon: Eye },
    { label: "Favorites Received", value: favoritesReceived, icon: Heart },
    { label: "Messages", value: messageCount, icon: MessageSquare },
  ];

  const activeListings = listings.filter((l) => l.status === "active");
  const recentListings = listings.slice(0, 6);

  const favoriteListings = favorites
    .map((f) => f.listings)
    .filter((l): l is Listing => l !== null);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-soft-white font-playfair">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your listings and account
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="border-white/[0.06] bg-surface hover:border-accent-gold/20 transition-colors"
          >
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-gold/10">
                <stat.icon className="h-5 w-5 text-accent-gold" />
              </div>
              <div>
                <p className="text-2xl font-bold text-soft-white font-mono">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          asChild
          className="bg-accent-gold text-background hover:bg-accent-gold/90"
        >
          <Link href="/post">
            <Plus className="mr-2 h-4 w-4" />
            Post New Listing
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-white/10">
          <Link href="/marketplace">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Browse Marketplace
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-white/10">
          <Link href="/messages">
            <MessageSquare className="mr-2 h-4 w-4" />
            View Messages
          </Link>
        </Button>
      </div>

      {/* Account Completion */}
      {completionPercent < 100 && (
        <Card className="border-white/[0.06] bg-surface">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-medium text-soft-white">
                  Complete Your Profile
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {completionPercent}% complete
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-white/10 text-xs"
              >
                <Link href="/dashboard/settings">Complete Profile</Link>
              </Button>
            </div>
            <div className="h-2 rounded-full bg-elevated overflow-hidden">
              <div
                className="h-full rounded-full bg-accent-gold transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {!profileData?.full_name && (
                <span className="text-xs text-muted-foreground bg-elevated px-2 py-1 rounded">
                  Add your name
                </span>
              )}
              {!profileData?.avatar_url && (
                <span className="text-xs text-muted-foreground bg-elevated px-2 py-1 rounded">
                  Upload avatar
                </span>
              )}
              {!profileData?.phone && (
                <span className="text-xs text-muted-foreground bg-elevated px-2 py-1 rounded">
                  Add phone number
                </span>
              )}
              {!profileData?.location && (
                <span className="text-xs text-muted-foreground bg-elevated px-2 py-1 rounded">
                  Set location
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Mini Section */}
      {listings.length > 0 && (
        <Card className="border-white/[0.06] bg-surface">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-accent-gold" />
              <h3 className="text-sm font-medium text-soft-white">
                Performance
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-lg font-bold text-soft-white font-mono">
                  {activeListings.length}
                </p>
                <p className="text-xs text-muted-foreground">Active Listings</p>
              </div>
              <div>
                <p className="text-lg font-bold text-soft-white font-mono">
                  {totalViews}
                </p>
                <p className="text-xs text-muted-foreground">Total Views</p>
              </div>
              <div>
                <p className="text-lg font-bold text-soft-white font-mono">
                  {favoritesReceived}
                </p>
                <p className="text-xs text-muted-foreground">Favorites</p>
              </div>
              <div>
                <p className="text-lg font-bold text-soft-white font-mono">
                  {listings.length > 0
                    ? Math.round(totalViews / listings.length)
                    : 0}
                </p>
                <p className="text-xs text-muted-foreground">Avg Views/Listing</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* My Listings with Status Badges */}
      {recentListings.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-soft-white">
              My Listings
            </h2>
            <span className="text-xs text-muted-foreground">
              {listings.length} total
            </span>
          </div>
          <div className="space-y-2">
            {recentListings.map((listing) => (
              <Card
                key={listing.id}
                className="border-white/[0.06] bg-surface hover:border-white/[0.12] transition-colors"
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="h-12 w-12 rounded-lg bg-elevated overflow-hidden shrink-0">
                    {listing.images?.[0] ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/listing/${listing.id}`}
                        className="text-sm font-medium text-soft-white truncate hover:text-accent-gold transition-colors"
                      >
                        {listing.title}
                      </Link>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${getStatusBadge(listing.status)}`}
                      >
                        {listing.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-accent-gold font-medium font-mono">
                        ${listing.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {listing.views_count} views
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground hover:text-soft-white h-8"
                    >
                      <Link href={`/listing/${listing.id}`}>View</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tabs: My Listings / My Favorites */}
      <DashboardTabs listings={listings} favorites={favoriteListings} />
    </div>
  );
}
