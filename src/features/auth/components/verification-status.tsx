"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Status = "pending_verification" | "approved" | "rejected";

interface VerificationStatusProps {
  status: Status;
  rejectionReason?: string;
}

export function VerificationStatus({
  status,
  rejectionReason,
}: VerificationStatusProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6 text-center"
    >
      {status === "pending_verification" && (
        <>
          <div className="mx-auto w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-2">
            <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
              Pending Review
            </Badge>
            <h2 className="text-2xl font-semibold text-[#F5F5F2]">
              Verification Under Review
            </h2>
            <p className="text-sm text-[#A1A1AA] max-w-sm mx-auto">
              Your documents have been submitted and are being reviewed. This
              typically takes up to 24 hours.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-[#A1A1AA]">
              You will receive a notification once your verification is complete.
              In the meantime, you can browse the marketplace.
            </p>
          </div>
          <Button asChild variant="outline" className="border-white/10 text-[#F5F5F2] hover:bg-white/5">
            <Link href="/marketplace">Browse Marketplace</Link>
          </Button>
        </>
      )}

      {status === "approved" && (
        <>
          <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-2">
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
              Verified
            </Badge>
            <h2 className="text-2xl font-semibold text-[#F5F5F2]">
              You&apos;re Verified!
            </h2>
            <p className="text-sm text-[#A1A1AA] max-w-sm mx-auto">
              Your identity has been verified. You now have full access to the
              Khmer Store marketplace.
            </p>
          </div>
          <Button asChild className="bg-[#C6A769] text-[#0F1115] hover:bg-[#C6A769]/90 font-semibold">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </>
      )}

      {status === "rejected" && (
        <>
          <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-2">
            <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
              Rejected
            </Badge>
            <h2 className="text-2xl font-semibold text-[#F5F5F2]">
              Verification Unsuccessful
            </h2>
            <p className="text-sm text-[#A1A1AA] max-w-sm mx-auto">
              Unfortunately, your verification was not approved. Please review
              the reason below and try again.
            </p>
          </div>
          {rejectionReason && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
              <p className="text-sm text-red-400">{rejectionReason}</p>
            </div>
          )}
          <Button asChild className="bg-[#C6A769] text-[#0F1115] hover:bg-[#C6A769]/90 font-semibold">
            <Link href="/verify">Submit Again</Link>
          </Button>
        </>
      )}
    </motion.div>
  );
}
