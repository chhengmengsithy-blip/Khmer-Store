import { ProductGridSkeleton } from "@/features/marketplace/components/product-grid";

export default function MarketplaceLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductGridSkeleton />
    </div>
  );
}
