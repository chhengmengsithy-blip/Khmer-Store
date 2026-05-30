"use client";

import { useState } from "react";
import { MoreHorizontal, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  updateListingStatus,
  adminDeleteListing,
} from "@/features/admin/actions/admin-actions";

interface ListingActionsProps {
  listingId: string;
  currentStatus: string;
}

export function ListingActions({
  listingId,
  currentStatus,
}: ListingActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleStatusChange(status: string) {
    setLoading(true);
    await updateListingStatus(listingId, status);
    setLoading(false);
  }

  async function handleDelete() {
    setLoading(true);
    await adminDeleteListing(listingId);
    setLoading(false);
    setShowDeleteDialog(false);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={loading}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-elevated border-white/[0.08]">
          {currentStatus !== "active" && (
            <DropdownMenuItem onClick={() => handleStatusChange("active")}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </DropdownMenuItem>
          )}
          {currentStatus !== "removed" && (
            <DropdownMenuItem onClick={() => handleStatusChange("removed")}>
              <XCircle className="h-4 w-4 mr-2" />
              Remove
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-400"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-surface border-white/[0.08]">
          <DialogHeader>
            <DialogTitle className="text-soft-white">
              Delete Listing
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this listing? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowDeleteDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
