"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { ListingActions } from "@/features/admin/components/listing-actions";
import { getAllListings } from "@/features/admin/actions/admin-actions";

interface ListingItem {
  id: string;
  title: string;
  status: string;
  price: number;
  created_at: string;
  seller_name: string;
  category_name: string;
  images?: string[];
}

const statusFilters = ["all", "active", "pending", "sold", "removed"];

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "active":
      return "bg-green-500/10 text-green-400 border-green-500/20";
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

export default function AdminListingsPage() {
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");

  useEffect(() => {
    let mounted = true;
    getAllListings(1, "all").then(({ data }) => {
      if (mounted) {
        setListings(data as ListingItem[]);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredListings = useMemo(() => {
    let result = listings;
    if (activeStatus !== "all") {
      result = result.filter((l) => l.status === activeStatus);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((l) => l.title.toLowerCase().includes(q));
    }
    return result;
  }, [listings, activeStatus, searchQuery]);

  const columns: Column<ListingItem>[] = [
    {
      key: "thumbnail",
      header: "",
      className: "w-12",
      render: (listing) => (
        <div className="h-9 w-9 rounded-lg bg-elevated overflow-hidden flex items-center justify-center">
          {listing.images && listing.images.length > 0 ? (
            <img
              src={listing.images[0]}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs text-muted-foreground">
              {listing.title.charAt(0)}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "title",
      header: "Title",
      sortable: true,
      render: (listing) => (
        <Link
          href={`/listing/${listing.id}`}
          className="text-soft-white hover:text-accent-gold transition-colors font-medium"
        >
          {listing.title}
        </Link>
      ),
    },
    {
      key: "category_name",
      header: "Category",
      className: "hidden md:table-cell",
      render: (listing) => (
        <span className="text-muted-foreground">{listing.category_name}</span>
      ),
    },
    {
      key: "seller_name",
      header: "Seller",
      className: "hidden sm:table-cell",
      render: (listing) => (
        <span className="text-muted-foreground">{listing.seller_name}</span>
      ),
    },
    {
      key: "price",
      header: "Price",
      sortable: true,
      render: (listing) => (
        <span className="text-soft-white font-mono text-xs">
          ${listing.price?.toLocaleString() || "0"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (listing) => (
        <Badge className={getStatusBadgeClass(listing.status)}>
          {listing.status}
        </Badge>
      ),
    },
    {
      key: "created_at",
      header: "Date",
      sortable: true,
      className: "hidden lg:table-cell",
      render: (listing) => (
        <span className="text-muted-foreground text-xs">
          {new Date(listing.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-12 text-right",
      render: (listing) => (
        <ListingActions listingId={listing.id} currentStatus={listing.status} />
      ),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-playfair text-soft-white">Listings</h1>
        <p className="text-muted-foreground text-sm">Loading listings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-playfair text-soft-white">Listings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {listings.length} total listings
        </p>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((status) => (
          <button
            key={status}
            onClick={() => setActiveStatus(status)}
            className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
              activeStatus === status
                ? "bg-accent-gold/10 text-accent-gold"
                : "text-muted-foreground hover:text-soft-white hover:bg-elevated"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filteredListings}
        searchPlaceholder="Search listings by title..."
        onSearch={setSearchQuery}
        selectable
        keyExtractor={(listing) => listing.id}
      />
    </div>
  );
}
