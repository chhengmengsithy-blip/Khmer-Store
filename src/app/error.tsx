"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F1115] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center"
      >
        {/* Warning icon */}
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#181A20]">
          <AlertTriangle className="h-8 w-8 text-[#C6A769]" />
        </div>

        {/* Heading */}
        <h1 className="font-playfair text-3xl font-bold text-[#F5F5F2]">
          Something went wrong
        </h1>

        {/* Description */}
        <p className="mt-3 max-w-md text-[#A1A1AA]">
          We encountered an unexpected error. Please try again or return to the
          home page if the problem persists.
        </p>

        {/* Action buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={reset}>Try Again</Button>
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
