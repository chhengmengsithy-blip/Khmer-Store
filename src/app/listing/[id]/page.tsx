import { Package } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

interface ListingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingDetailPage({
  params,
}: ListingDetailPageProps) {
  await params;

  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
        <EmptyState
          icon={Package}
          title="Listing not found"
          description="This listing may have been removed or does not exist yet."
          actionLabel="Browse Marketplace"
          actionHref="/marketplace"
        />
      </div>
    </div>
  );
}
