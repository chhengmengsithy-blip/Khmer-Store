import React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-gold/10">
        <Icon className="h-7 w-7 text-accent-gold" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-soft-white">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-accent-gold px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-accent-gold/90"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
