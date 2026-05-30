import Link from "next/link";
import { Package, Eye, Heart, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { ListingCard } from "@/components/shared/listing-card";
import { getUserListings } from "@/features/listings/actions/listing-actions";
import { getUserFavorites } from "@/features/listings/actions/favorite-actions";
import { createClient } from "@/lib/supabase/server";
import type { Listing } from "@/types";
import { DashboardTabs } from "./dashboard-tabs";

export default async function DashboardPage() {
  const supabase = await createClient();

  let listings: Listing[] = [];
  let favorites: (Record<string, unknown> & { listings: Listing | null })[] = [];
  let totalViews = 0;
  let favoritesReceived = 0;

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      listings = await getUserListings();
      favorites = await getUserFavorites();
      totalViews = listings.reduce((sum, l) => sum + (l.views_count || 0), 0);

      // Count favorites received on user's listings
      const { count } = await supabase
        .from("favorites")
        .select("id, listings!inner(user_id)", { count: "exact", head: true })
        .eq("listings.user_id", user.id);
      favoritesReceived = count || 0;
    }
  }

  const stats = [
    { label: "My Listings", value: listings.length.toString(), icon: Package },
    { label: "Total Views", value: totalViews.toString(), icon: Eye },
    { label: "Favorites Received", value: favoritesReceived.toString(), icon: Heart },
  ];

  const favoriteListings = favorites
    .map((f) => f.listings)
    .filter((l): l is Listing => l !== null);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-soft-white font-playfair">
        My Dashboard
      </h1>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-white/[0.08] bg-surface">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-gold/10">
                <stat.icon className="h-5 w-5 text-accent-gold" />
              </div>
              <div>
                <p className="text-2xl font-bold text-soft-white">
                  {stat.value}
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
          <Link href="/post">Post New Listing</Link>
        </Button>
        <Button asChild variant="outline" className="border-white/10">
          <Link href="/marketplace">Browse Marketplace</Link>
        </Button>
      </div>

      {/* Tabs: My Listings / My Favorites */}
      <DashboardTabs listings={listings} favorites={favoriteListings} />
    </div>
  );
}
