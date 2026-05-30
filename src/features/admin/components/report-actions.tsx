"use client";

import { useState } from "react";
import { MoreHorizontal, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateReportStatus } from "@/features/admin/actions/admin-actions";

interface ReportActionsProps {
  reportId: string;
  listingId: string | null;
  currentStatus: string;
}

export function ReportActions({
  reportId,
  listingId,
  currentStatus,
}: ReportActionsProps) {
  const [loading, setLoading] = useState(false);

  async function handleStatusChange(status: "resolved" | "dismissed") {
    setLoading(true);
    await updateReportStatus(reportId, status);
    setLoading(false);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={loading}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-elevated border-white/[0.08]">
        {currentStatus === "pending" && (
          <>
            <DropdownMenuItem onClick={() => handleStatusChange("resolved")}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Resolve
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange("dismissed")}>
              <XCircle className="h-4 w-4 mr-2" />
              Dismiss
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        {listingId && (
          <DropdownMenuItem asChild>
            <Link href={`/listing/${listingId}`}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View Listing
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
