"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  Camera,
} from "lucide-react";

interface VerificationItem {
  id: string;
  userName: string;
  email: string;
  submittedAt: string;
  documents: {
    idType: string;
    selfie: boolean;
  };
  waitTime: number; // hours since submission
  status: "pending" | "reviewing";
}

const mockQueue: VerificationItem[] = [
  {
    id: "v1",
    userName: "Chantha Vy",
    email: "chantha@example.com",
    submittedAt: "2024-05-28T10:00:00Z",
    documents: { idType: "National ID", selfie: true },
    waitTime: 36,
    status: "pending",
  },
  {
    id: "v2",
    userName: "Nimol Tep",
    email: "nimol.t@example.com",
    submittedAt: "2024-05-28T14:30:00Z",
    documents: { idType: "Passport", selfie: true },
    waitTime: 32,
    status: "pending",
  },
  {
    id: "v3",
    userName: "Bopha Keo",
    email: "bopha.k@example.com",
    submittedAt: "2024-05-29T08:00:00Z",
    documents: { idType: "Driver License", selfie: false },
    waitTime: 14,
    status: "reviewing",
  },
  {
    id: "v4",
    userName: "Sophea Meas",
    email: "sophea@example.com",
    submittedAt: "2024-05-29T16:00:00Z",
    documents: { idType: "National ID", selfie: true },
    waitTime: 6,
    status: "pending",
  },
];

export function VerificationQueue() {
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>({});
  const [showRejectField, setShowRejectField] = useState<string | null>(null);

  return (
    <Card className="border-white/[0.06] bg-white/[0.02]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-soft-white">KYC Verification Queue</CardTitle>
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
            {mockQueue.length} Pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockQueue.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-gold/10 text-sm font-medium text-accent-gold">
                      {item.userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-medium text-soft-white">{item.userName}</p>
                      <p className="text-xs text-muted-foreground">{item.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {item.documents.idType}
                    </span>
                    <span className="flex items-center gap-1">
                      {item.documents.selfie ? (
                        <>
                          <Camera className="h-3 w-3 text-green-400" />
                          <span className="text-green-400">Selfie submitted</span>
                        </>
                      ) : (
                        <>
                          <User className="h-3 w-3 text-red-400" />
                          <span className="text-red-400">No selfie</span>
                        </>
                      )}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.waitTime}h ago
                      {item.waitTime >= 24 && (
                        <Badge className="ml-1 bg-green-500/20 text-green-300 border-green-500/30 text-[10px]">
                          24h+ ready
                        </Badge>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={item.waitTime < 24}
                  >
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    onClick={() =>
                      setShowRejectField(showRejectField === item.id ? null : item.id)
                    }
                  >
                    <XCircle className="mr-1 h-3 w-3" />
                    Reject
                  </Button>
                </div>
              </div>

              {showRejectField === item.id && (
                <div className="mt-3 space-y-2 border-t border-white/[0.06] pt-3">
                  <Textarea
                    placeholder="Provide a reason for rejection..."
                    value={rejectReasons[item.id] || ""}
                    onChange={(e) =>
                      setRejectReasons((prev) => ({ ...prev, [item.id]: e.target.value }))
                    }
                    className="border-white/10 bg-white/5 text-sm"
                    rows={2}
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={!rejectReasons[item.id]?.trim()}
                  >
                    Confirm Rejection
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
