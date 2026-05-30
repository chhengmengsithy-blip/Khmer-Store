import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function ListingCardSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-white/[0.06] bg-surface",
        className
      )}
    >
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-5 w-1/3" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-3 w-1/5" />
        </div>
      </div>
    </div>
  );
}

export function StatsCardSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-white/[0.06] bg-surface p-6",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 border-b border-white/[0.06] px-4 py-3",
        className
      )}
    >
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-10 w-10 rounded" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/5" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-8 w-8 rounded" />
    </div>
  );
}

export function ProfileSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export function ChatSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex gap-3">
        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-16 w-56 rounded-lg" />
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <div className="space-y-1.5 items-end">
          <Skeleton className="h-4 w-16 ml-auto" />
          <Skeleton className="h-12 w-44 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-40 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
