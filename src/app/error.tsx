"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
        <AlertTriangle className="h-10 w-10 text-red-400" />
      </div>

      <h1 className="text-2xl font-bold text-soft-white sm:text-3xl">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        An unexpected error occurred. Please try again or return to the homepage.
      </p>
      {error.message && (
        <p className="mt-3 max-w-md rounded-md border border-white/[0.06] bg-surface px-4 py-2 text-xs text-muted-foreground">
          {error.message}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={reset}
          className="bg-accent-gold text-background hover:bg-accent-gold/90"
        >
          Try Again
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-white/10 text-soft-white hover:bg-elevated"
        >
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
