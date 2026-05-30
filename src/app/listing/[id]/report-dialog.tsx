"use client";

import { useState } from "react";
import { Flag, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { createReport } from "@/features/listings/actions/report-actions";
import { cn } from "@/lib/utils";

const reasons = [
  { value: "spam", label: "Spam or misleading", description: "Fake listing or misleading information" },
  { value: "inappropriate", label: "Inappropriate content", description: "Offensive or harmful content" },
  { value: "scam", label: "Scam or fraud", description: "Attempting to scam or defraud buyers" },
  { value: "prohibited", label: "Prohibited item", description: "Item not allowed on the platform" },
  { value: "other", label: "Other", description: "Other reason not listed above" },
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
    const selectedReason = reasons.find((r) => r.value === reason);
    await createReport(listingId, selectedReason?.label || reason, description);
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      setOpen(false);
      // Reset state after close animation
      setTimeout(() => {
        setSubmitted(false);
        setReason("");
        setDescription("");
      }, 200);
    }, 1500);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1 border-white/10">
          <Flag className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-surface border-white/[0.08] max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-soft-white">
            <AlertTriangle className="h-5 w-5 text-orange-400" />
            Report Listing
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Help us keep the marketplace safe. Select a reason for your report.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 mb-3">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <p className="text-sm font-medium text-soft-white">Report Submitted</p>
            <p className="text-xs text-muted-foreground mt-1">
              Thank you. We will review this listing shortly.
            </p>
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            {/* Reason Radio Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-soft-white">
                Select a reason
              </Label>
              <div className="space-y-2">
                {reasons.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setReason(r.value)}
                    className={cn(
                      "w-full rounded-lg border p-3 text-left transition-all",
                      reason === r.value
                        ? "border-accent-gold/50 bg-accent-gold/5"
                        : "border-white/[0.08] bg-elevated/50 hover:border-white/20"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                          reason === r.value
                            ? "border-accent-gold"
                            : "border-white/20"
                        )}
                      >
                        {reason === r.value && (
                          <div className="h-2 w-2 rounded-full bg-accent-gold" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-soft-white">{r.label}</p>
                        <p className="text-xs text-muted-foreground">{r.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-soft-white">
                Additional details (optional)
              </Label>
              <Textarea
                placeholder="Provide any additional context..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 resize-none"
                rows={3}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!reason || loading}
              className="w-full bg-accent-gold text-background hover:bg-accent-gold/90 font-medium"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
