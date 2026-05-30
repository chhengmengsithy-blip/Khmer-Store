import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  secondaryActionLabel,
  secondaryActionHref,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-gold/10 animate-float">
        <Icon className="h-10 w-10 text-accent-gold" />
      </div>
      <h3 className="mt-6 text-lg font-semibold text-soft-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      <div className="mt-6 flex items-center gap-3">
        {actionLabel && actionHref && (
          <Button
            asChild
            className="bg-accent-gold text-background hover:bg-accent-gold/90"
          >
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        )}
        {secondaryActionLabel && secondaryActionHref && (
          <Button
            asChild
            variant="outline"
            className="border-white/10 text-soft-white hover:bg-elevated"
          >
            <Link href={secondaryActionHref}>{secondaryActionLabel}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
