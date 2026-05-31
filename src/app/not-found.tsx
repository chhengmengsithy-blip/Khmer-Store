import Link from "next/link";
import { MapPin, Compass, Store, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F1115] px-4">
      <div
        className="flex flex-col items-center text-center animate-fade-in"
      >
        {/* Decorative icons */}
        <div className="mb-8 flex items-center gap-4">
          <MapPin className="h-6 w-6 text-[#A1A1AA]" />
          <Compass className="h-10 w-10 text-[#C6A769]" />
          <MapPin className="h-6 w-6 text-[#A1A1AA]" />
        </div>

        {/* 404 number */}
        <h1 className="font-playfair text-8xl font-bold text-[#C6A769]">404</h1>

        {/* Heading */}
        <h2 className="mt-4 font-playfair text-2xl font-semibold text-[#F5F5F2]">
          Lost in the Marketplace
        </h2>

        {/* Description */}
        <p className="mt-3 max-w-md text-[#A1A1AA]">
          It seems you have wandered off the path. The page you are looking for
          does not exist or has been moved to a new location.
        </p>

        {/* Marketplace icons decoration */}
        <div className="mt-8 flex items-center gap-6">
          <Store className="h-5 w-5 text-[#A1A1AA]/50" />
          <ShoppingBag className="h-5 w-5 text-[#A1A1AA]/50" />
          <Store className="h-5 w-5 text-[#A1A1AA]/50" />
        </div>

        {/* Navigation buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/marketplace">Browse Marketplace</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
