import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllListings } from "@/features/admin/actions/admin-actions";
import { ListingActions } from "@/features/admin/components/listing-actions";

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

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const currentStatus = params.status || "all";
  const page = parseInt(params.page || "1", 10);
  const { data: listings, count } = await getAllListings(page, currentStatus);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-playfair text-soft-white">Listings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {count} total listings
        </p>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((status) => (
          <Link
            key={status}
            href={`/admin/listings${status === "all" ? "" : `?status=${status}`}`}
            className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
              currentStatus === status
                ? "bg-accent-gold/10 text-accent-gold"
                : "text-muted-foreground hover:text-soft-white hover:bg-elevated"
            }`}
          >
            {status}
          </Link>
        ))}
      </div>

      <Card className="border-white/[0.08] bg-surface">
        <CardHeader>
          <CardTitle className="text-soft-white text-base">
            All Listings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {listings.length === 0 ? (
            <p className="text-muted-foreground text-sm">No listings found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">
                      Title
                    </th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium hidden sm:table-cell">
                      Seller
                    </th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium hidden md:table-cell">
                      Category
                    </th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">
                      Status
                    </th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium hidden lg:table-cell">
                      Date
                    </th>
                    <th className="text-right py-3 px-2 text-muted-foreground font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing) => (
                    <tr
                      key={listing.id}
                      className="border-b border-white/[0.05] last:border-0"
                    >
                      <td className="py-3 px-2">
                        <Link
                          href={`/listing/${listing.id}`}
                          className="text-soft-white hover:text-accent-gold transition-colors"
                        >
                          {listing.title}
                        </Link>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground hidden sm:table-cell">
                        {listing.seller_name}
                      </td>
                      <td className="py-3 px-2 text-muted-foreground hidden md:table-cell">
                        {listing.category_name}
                      </td>
                      <td className="py-3 px-2">
                        <Badge className={getStatusBadgeClass(listing.status)}>
                          {listing.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground hidden lg:table-cell">
                        {new Date(listing.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <ListingActions
                          listingId={listing.id}
                          currentStatus={listing.status}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
