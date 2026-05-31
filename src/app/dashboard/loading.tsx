import { DashboardStatsSkeleton } from "@/components/ui/skeleton-loaders";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <DashboardStatsSkeleton />
    </div>
  );
}
