import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllReports } from "@/features/admin/actions/admin-actions";
import { ReportActions } from "@/features/admin/components/report-actions";

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

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const currentStatus = params.status || "all";
  const reports = await getAllReports(currentStatus);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-playfair text-soft-white">Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {reports.length} reports
        </p>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((status) => (
          <Link
            key={status}
            href={`/admin/reports${status === "all" ? "" : `?status=${status}`}`}
            className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
              currentStatus === status
                ? "bg-accent-gold/10 text-accent-gold"
                : "text-muted-foreground hover:text-soft-white hover:bg-elevated"
            }`}
          >
            {status}
          </Link>
        ))}
      </div>

      <Card className="border-white/[0.08] bg-surface">
        <CardHeader>
          <CardTitle className="text-soft-white text-base">
            All Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <p className="text-muted-foreground text-sm">No reports found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">
                      Reporter
                    </th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">
                      Listing
                    </th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium hidden sm:table-cell">
                      Reason
                    </th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">
                      Status
                    </th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium hidden md:table-cell">
                      Date
                    </th>
                    <th className="text-right py-3 px-2 text-muted-foreground font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr
                      key={report.id}
                      className="border-b border-white/[0.05] last:border-0"
                    >
                      <td className="py-3 px-2 text-soft-white">
                        {report.reporter_name}
                      </td>
                      <td className="py-3 px-2">
                        {report.listing_title ? (
                          <Link
                            href={`/listing/${report.listing_id}`}
                            className="text-accent-gold hover:underline"
                          >
                            {report.listing_title}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">Deleted</span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-muted-foreground hidden sm:table-cell">
                        {report.reason}
                      </td>
                      <td className="py-3 px-2">
                        <Badge className={getStatusBadgeClass(report.status)}>
                          {report.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground hidden md:table-cell">
                        {new Date(report.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <ReportActions
                          reportId={report.id}
                          listingId={report.listing_id}
                          currentStatus={report.status}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
