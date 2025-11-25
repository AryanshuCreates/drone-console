import { MissionReport } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface MissionReportTableProps {
  reports: MissionReport[];
}

export function MissionReportTable({ reports }: MissionReportTableProps) {
  if (!reports.length) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="p-6 text-sm text-text-muted">
          No survey reports generated yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-0">
        <table className="min-w-full text-xs">
          <thead className="bg-muted/40 text-[11px] uppercase tracking-wide text-text-muted">
            <tr>
              <th className="px-4 py-2 text-left">Mission</th>
              <th className="px-4 py-2 text-left">Site</th>
              <th className="px-4 py-2 text-left">Duration</th>
              <th className="px-4 py-2 text-left">Distance</th>
              <th className="px-4 py-2 text-left">Coverage</th>
              <th className="px-4 py-2 text-left"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reports.map((r) => (
              <tr key={r.missionId} className="hover:bg-muted/30">
                <td className="px-4 py-2">
                  <p className="text-sm font-medium text-text-primary">
                    {r.missionName}
                  </p>
                </td>
                <td className="px-4 py-2 text-xs text-text-secondary">
                  {r.siteCode}
                </td>
                <td className="px-4 py-2 text-xs text-text-secondary">
                  {(r.durationSeconds / 60).toFixed(0)} min
                </td>
                <td className="px-4 py-2 text-xs text-text-secondary">
                  {(r.distanceMeters / 1000).toFixed(2)} km
                </td>
                <td className="px-4 py-2 text-xs text-text-secondary">
                  {r.coveragePercentage.toFixed(1)}%
                </td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/reports/${r.missionId}`}
                    className="text-[11px] font-medium text-primary hover:underline"
                  >
                    View report
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
