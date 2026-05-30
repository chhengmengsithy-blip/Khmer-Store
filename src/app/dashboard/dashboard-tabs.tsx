"use client";

import { useState } from "react";
import { Package, Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/shared/listing-card";
import { EmptyState } from "@/components/shared/empty-state";
import { deleteListing } from "@/features/listings/actions/listing-actions";
import type { Listing } from "@/types";

interface DashboardTabsProps {
  listings: Listing[];
  favorites: Listing[];
}

export function DashboardTabs({ listings, favorites }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<"listings" | "favorites">(
    "listings"
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    setDeletingId(id);
    await deleteListing(id);
    setDeletingId(null);
  }

  return (
    <div>
      {/* Tab Buttons */}
      <div className="mb-6 flex gap-1 rounded-lg bg-elevated p-1 w-fit">
        <button
          onClick={() => setActiveTab("listings")}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "listings"
              ? "bg-surface text-accent-gold"
              : "text-muted-foreground hover:text-soft-white"
          }`}
        >
          <Package className="h-4 w-4" />
          My Listings ({listings.length})
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "favorites"
              ? "bg-surface text-accent-gold"
              : "text-muted-foreground hover:text-soft-white"
          }`}
        >
          <Heart className="h-4 w-4" />
          My Favorites ({favorites.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "listings" && (
        <>
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <div key={listing.id} className="relative group">
                  <ListingCard listing={listing} />
                  <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(listing.id)}
                      disabled={deletingId === listing.id}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Package}
              title="You haven't posted any listings yet"
              description="Create your first listing and start selling on Khmer Store"
              actionLabel="Post Your First Listing"
              actionHref="/post"
            />
          )}
        </>
      )}

      {activeTab === "favorites" && (
        <>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Heart}
              title="No favorites yet"
              description="Browse the marketplace and favorite listings you like"
              actionLabel="Browse Marketplace"
              actionHref="/marketplace"
            />
          )}
        </>
      )}
    </div>
  );
}
