import { OrgSurveyStats } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

interface ReportSummaryCardProps {
  stats: OrgSurveyStats;
}

export function ReportSummaryCard({ stats }: ReportSummaryCardProps) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="grid gap-4 p-4 md:grid-cols-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
            Total surveys
          </p>
          <p className="mt-1 text-lg font-semibold text-text-primary">
            {stats.totalSurveys}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
            Distance flown
          </p>
          <p className="mt-1 text-lg font-semibold text-text-primary">
            {(stats.totalDistanceMeters / 1000).toFixed(1)} km
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
            Area covered
          </p>
          <p className="mt-1 text-lg font-semibold text-text-primary">
            {(stats.totalAreaCoveredSquareMeters / 10000).toFixed(1)} ha
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
            Avg coverage
          </p>
          <p className="mt-1 text-lg font-semibold text-text-primary">
            {stats.avgCoveragePercentage.toFixed(1)}%
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
