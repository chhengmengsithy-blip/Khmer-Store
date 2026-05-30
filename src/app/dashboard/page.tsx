import Link from "next/link";
import { Package, MessageSquare, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";

const stats = [
  { label: "My Listings", value: "0", icon: Package },
  { label: "Messages", value: "0", icon: MessageSquare },
  { label: "Favorites", value: "0", icon: Heart },
];

export default function DashboardPage() {
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

      {/* My Listings */}
      <div>
        <h2 className="text-lg font-semibold text-soft-white mb-4">
          My Listings
        </h2>
        <EmptyState
          icon={Package}
          title="You haven't posted any listings yet"
          description="Create your first listing and start selling on Khmer Store"
          actionLabel="Post Your First Listing"
          actionHref="/post"
        />
      </div>
    </div>
  );
}
