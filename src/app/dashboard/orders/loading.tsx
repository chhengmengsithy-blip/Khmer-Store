import { OrdersTableSkeleton } from "@/components/ui/skeleton-loaders";

export default function OrdersLoading() {
  return (
    <div className="space-y-6">
      <OrdersTableSkeleton />
    </div>
  );
}
