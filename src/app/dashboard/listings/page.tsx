"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Package, Plus, Trash2, Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  getUserListings,
  deleteListing,
} from "@/features/listings/actions/listing-actions";
import type { Listing } from "@/types";

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "active":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "pending":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case "sold":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "removed":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default function DashboardListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    getUserListings().then((data) => {
      if (mounted) {
        setListings(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredListings = useMemo(() => {
    if (!searchQuery) return listings;
    const q = searchQuery.toLowerCase();
    return listings.filter((l) => l.title.toLowerCase().includes(q));
  }, [listings, searchQuery]);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const result = await deleteListing(deleteId);
    if (!result.error) {
      setListings((prev) => prev.filter((l) => l.id !== deleteId));
    }
    setDeleting(false);
    setDeleteId(null);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-soft-white font-playfair">
          My Listings
        </h1>
        <p className="text-sm text-muted-foreground">Loading your listings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-soft-white font-playfair">
            My Listings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {listings.length} total listing{listings.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          asChild
          className="bg-accent-gold text-background hover:bg-accent-gold/90"
        >
          <Link href="/post">
            <Plus className="mr-2 h-4 w-4" />
            New Listing
          </Link>
        </Button>
      </div>

      {listings.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search your listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60"
          />
        </div>
      )}

      {filteredListings.length > 0 ? (
        <div className="space-y-2">
          {filteredListings.map((listing) => (
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
                    <Badge
                      variant="outline"
                      className={`shrink-0 text-[10px] capitalize ${getStatusBadgeClass(listing.status)}`}
                    >
                      {listing.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-accent-gold font-medium font-mono">
                      ${listing.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {listing.views_count} views
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(listing.created_at).toLocaleDateString()}
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                    onClick={() => setDeleteId(listing.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">
            No listings match your search.
          </p>
        </div>
      ) : (
        <EmptyState
          icon={Package}
          title="No listings yet"
          description="Create your first listing and start selling on Khmer Store"
          actionLabel="Post Your First Listing"
          actionHref="/post"
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="Delete Listing"
        description="Are you sure you want to delete this listing? This action cannot be undone."
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        onConfirm={handleDelete}
        variant="danger"
      />
    </div>
  );
}
