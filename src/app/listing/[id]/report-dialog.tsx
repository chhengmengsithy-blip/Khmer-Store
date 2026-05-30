"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createReport } from "@/features/listings/actions/report-actions";

const reasons = [
  "Spam or misleading",
  "Inappropriate content",
  "Scam or fraud",
  "Prohibited item",
  "Other",
];

interface ReportDialogProps {
  listingId: string;
}

export function ReportDialog({ listingId }: ReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    if (!reason) return;
    setLoading(true);
    await createReport(listingId, reason, description);
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => setOpen(false), 1500);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-white/10">
          <Flag className="mr-2 h-4 w-4" />
          Report
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-surface border-white/[0.08]">
        <DialogHeader>
          <DialogTitle className="text-soft-white">Report Listing</DialogTitle>
        </DialogHeader>
        {submitted ? (
          <p className="text-sm text-muted-foreground py-4">
            Thank you for your report. We will review it shortly.
          </p>
        ) : (
          <div className="space-y-4">
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="border-white/10 bg-white/5 text-soft-white">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent className="bg-elevated border-white/10">
                {reasons.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Additional details (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 resize-none"
              rows={3}
            />
            <Button
              onClick={handleSubmit}
              disabled={!reason || loading}
              className="w-full bg-accent-gold text-background hover:bg-accent-gold/90"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
