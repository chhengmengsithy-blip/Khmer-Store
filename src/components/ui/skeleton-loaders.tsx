import { Skeleton } from "@/components/ui/skeleton";

export function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-white/[0.06] bg-surface p-6 space-y-3"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-6 w-24" />
        </div>
      ))}
    </div>
  );
}

export function OrdersTableSkeleton() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-surface overflow-hidden">
      {/* Header row */}
      <div className="flex gap-4 border-b border-white/[0.06] px-4 py-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
      {/* Body rows */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-white/[0.03] px-4 py-3 last:border-0"
        >
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-7 w-7 rounded" />
        </div>
      ))}
    </div>
  );
}

export function ProductsGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-white/[0.06] bg-surface p-4 space-y-3"
        >
          <Skeleton className="aspect-video w-full rounded-lg" />
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MessagesListSkeleton() {
  return (
    <div className="flex h-[calc(100vh-12rem)] rounded-xl border border-white/[0.06] bg-surface overflow-hidden">
      {/* Conversation list */}
      <div className="w-full md:w-80 md:min-w-[320px] border-r border-white/[0.06]">
        <div className="p-4 border-b border-white/[0.06]">
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="space-y-1 p-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Message area placeholder */}
      <div className="hidden md:flex flex-1 items-center justify-center">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    </div>
  );
}

export function MessageBubblesSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-4 h-full justify-center">
      {/* Left-aligned bubble */}
      <div className="flex justify-start">
        <Skeleton className="h-10 w-[60%] rounded-xl" />
      </div>
      {/* Right-aligned bubble */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-[45%] rounded-xl" />
      </div>
      {/* Left-aligned bubble */}
      <div className="flex justify-start">
        <Skeleton className="h-10 w-[70%] rounded-xl" />
      </div>
      {/* Right-aligned bubble */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-[40%] rounded-xl" />
      </div>
    </div>
  );
}

export function SettingsFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-3 w-48" />
      </div>
      <div className="rounded-xl border border-white/[0.06] bg-surface p-6 space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        {/* Form fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>
    </div>
  );
}
