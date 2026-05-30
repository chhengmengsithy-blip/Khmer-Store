"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable, type Column } from "@/components/shared/data-table";
import { ReportActions } from "@/features/admin/components/report-actions";
import { getAllReports } from "@/features/admin/actions/admin-actions";
import { ExternalLink, AlertCircle } from "lucide-react";

interface ReportItem {
  id: string;
  reporter_id: string;
  reporter_name: string;
  listing_id: string | null;
  listing_title: string | null;
  reason: string;
  description?: string;
  severity?: string;
  status: string;
  created_at: string;
}

const statusFilters = ["all", "pending", "resolved", "dismissed"];

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case "resolved":
      return "bg-green-500/10 text-green-400 border-green-500/20";
    case "dismissed":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getSeverityBadge(reason: string) {
  const lowerReason = reason?.toLowerCase() || "";
  if (
    lowerReason.includes("scam") ||
    lowerReason.includes("fraud") ||
    lowerReason.includes("illegal")
  ) {
    return {
      label: "High",
      className: "bg-red-500/10 text-red-400 border-red-500/20",
    };
  }
  if (
    lowerReason.includes("spam") ||
    lowerReason.includes("inappropriate") ||
    lowerReason.includes("misleading")
  ) {
    return {
      label: "Medium",
      className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    };
  }
  return {
    label: "Low",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  useEffect(() => {
    let mounted = true;
    getAllReports("all").then((data) => {
      if (mounted) {
        setReports(data as ReportItem[]);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredReports = useMemo(() => {
    let result = reports;
    if (activeStatus !== "all") {
      result = result.filter((r) => r.status === activeStatus);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.reporter_name.toLowerCase().includes(q) ||
          (r.listing_title && r.listing_title.toLowerCase().includes(q)) ||
          r.reason.toLowerCase().includes(q)
      );
    }
    return result;
  }, [reports, activeStatus, searchQuery]);

  const columns: Column<ReportItem>[] = [
    {
      key: "reporter_name",
      header: "Reporter",
      render: (report) => (
        <span className="text-soft-white font-medium">
          {report.reporter_name}
        </span>
      ),
    },
    {
      key: "listing_title",
      header: "Listing",
      render: (report) =>
        report.listing_title ? (
          <Link
            href={`/listing/${report.listing_id}`}
            className="text-accent-gold hover:underline text-sm"
          >
            {report.listing_title}
          </Link>
        ) : (
          <span className="text-muted-foreground">Deleted</span>
        ),
    },
    {
      key: "reason",
      header: "Reason",
      className: "hidden sm:table-cell",
      render: (report) => (
        <Badge className="bg-muted text-muted-foreground capitalize">
          {report.reason}
        </Badge>
      ),
    },
    {
      key: "severity",
      header: "Severity",
      className: "hidden md:table-cell",
      render: (report) => {
        const sev = getSeverityBadge(report.reason);
        return <Badge className={sev.className}>{sev.label}</Badge>;
      },
    },
    {
      key: "created_at",
      header: "Date",
      sortable: true,
      className: "hidden lg:table-cell",
      render: (report) => (
        <span className="text-muted-foreground text-xs">
          {new Date(report.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (report) => (
        <Badge className={getStatusBadgeClass(report.status)}>
          {report.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-20 text-right",
      render: (report) => (
        <div className="flex items-center gap-1 justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setSelectedReport(report)}
          >
            <AlertCircle className="h-3.5 w-3.5" />
          </Button>
          <ReportActions
            reportId={report.id}
            listingId={report.listing_id}
            currentStatus={report.status}
          />
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-playfair text-soft-white">Reports</h1>
        <p className="text-muted-foreground text-sm">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-playfair text-soft-white">Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {reports.length} total reports
        </p>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((status) => (
          <button
            key={status}
            onClick={() => setActiveStatus(status)}
            className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
              activeStatus === status
                ? "bg-accent-gold/10 text-accent-gold"
                : "text-muted-foreground hover:text-soft-white hover:bg-elevated"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filteredReports}
        searchPlaceholder="Search by reporter, listing, or reason..."
        onSearch={setSearchQuery}
        keyExtractor={(report) => report.id}
      />

      {/* Report Detail Modal */}
      <Dialog
        open={!!selectedReport}
        onOpenChange={(open) => !open && setSelectedReport(null)}
      >
        <DialogContent className="bg-surface border-white/[0.08] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-soft-white">Report Details</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Reporter</p>
                  <p className="text-sm text-soft-white">
                    {selectedReport.reporter_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Badge className={getStatusBadgeClass(selectedReport.status)}>
                    {selectedReport.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Severity</p>
                  {(() => {
                    const sev = getSeverityBadge(selectedReport.reason);
                    return <Badge className={sev.className}>{sev.label}</Badge>;
                  })()}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Date</p>
                  <p className="text-sm text-soft-white">
                    {new Date(selectedReport.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Reason</p>
                <p className="text-sm text-soft-white capitalize">
                  {selectedReport.reason}
                </p>
              </div>

              {selectedReport.description && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Description
                  </p>
                  <p className="text-sm text-soft-white/80">
                    {selectedReport.description}
                  </p>
                </div>
              )}

              {selectedReport.listing_id && selectedReport.listing_title && (
                <div className="pt-3 border-t border-white/[0.06]">
                  <p className="text-xs text-muted-foreground mb-2">
                    Reported Listing
                  </p>
                  <Link
                    href={`/listing/${selectedReport.listing_id}`}
                    className="flex items-center gap-2 text-sm text-accent-gold hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {selectedReport.listing_title}
                  </Link>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
