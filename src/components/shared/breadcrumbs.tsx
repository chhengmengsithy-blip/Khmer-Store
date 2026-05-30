"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbsProps {
  className?: string;
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 transition-colors hover:text-soft-white"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
        </li>
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;
          const label = segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

          return (
            <li key={href} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
              {isLast ? (
                <span className="text-soft-white font-medium">{label}</span>
              ) : (
                <Link
                  href={href}
                  className="transition-colors hover:text-soft-white"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
