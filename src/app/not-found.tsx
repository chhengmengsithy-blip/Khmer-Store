import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      {/* Floating search icon */}
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-accent-gold/10 animate-float">
        <Search className="h-10 w-10 text-accent-gold" />
      </div>

      {/* Large 404 text */}
      <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-accent-gold/60 font-playfair sm:text-8xl">
        404
      </h1>

      <h2 className="mt-4 text-xl font-semibold text-soft-white sm:text-2xl">
        Page Not Found
      </h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        The page you are looking for does not exist or has been moved. Try
        searching for what you need or head back to the homepage.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          asChild
          className="bg-accent-gold text-background hover:bg-accent-gold/90"
        >
          <Link href="/">Go Home</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-white/10 text-soft-white hover:bg-elevated"
        >
          <Link href="/marketplace">Browse Marketplace</Link>
        </Button>
      </div>
    </div>
  );
}
