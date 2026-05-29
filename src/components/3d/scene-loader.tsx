import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function SceneLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative flex flex-col items-center gap-4">
        <Skeleton className="h-48 w-48 rounded-full bg-elevated" />
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-gold" />
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-gold delay-150" />
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-gold delay-300" />
        </div>
      </div>
    </div>
  );
}
