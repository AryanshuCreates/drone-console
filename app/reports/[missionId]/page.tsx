import { fetchReportByMissionId } from "@/lib/client-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface MissionReportPageProps {
  params: Promise<{ missionId: string }>;
}

export default async function MissionReportPage({
  params,
}: MissionReportPageProps) {
  const { missionId } = await params;

  const result = await fetchReportByMissionId(missionId);

  // ❗ If no report or mission, show a friendly message instead of 404
  if (!result) {
    return (
      <div className="space-y-4">
        <header>
          <h1 className="text-2xl font-bold text-slate-900">
            Report not available
          </h1>
          <p className="text-sm text-slate-500">
            No report has been generated yet for mission{" "}
            <code className="text-xs">{missionId}</code>.
          </p>
          <Link
            href="/reports"
            className="mt-2 inline-block text-sm text-indigo-600 hover:underline"
          >
            ← Back to Reports
          </Link>
        </header>
      </div>
    );
  }

  const { mission, report } = result;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">
          Mission Report · {mission.name}
        </h1>

        <p className="text-sm text-slate-500">
          {mission.siteCode} — Completed mission performance summary.
        </p>

        <Link
          href={`/missions/${mission.id}`}
          className="inline-block mt-2 text-sm text-indigo-600 hover:underline"
        >
          ← Back to Mission
        </Link>
      </header>

      {/* Summary Card */}
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800">
            Summary Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3 p-6">
          <Metric
            label="Duration"
            value={`${(report.durationSeconds / 60).toFixed(0)} min`}
          />
          <Metric
            label="Distance"
            value={`${(report.distanceMeters / 1000).toFixed(2)} km`}
          />
          <Metric
            label="Area Coverage"
            value={`${(report.areaCoverageSquareMeters / 1000).toFixed(1)}K m²`}
          />
          <Metric
            label="Coverage Efficiency"
            value={`${report.coveragePercentage.toFixed(1)}%`}
          />
          <Metric
            label="Battery Used"
            value={`${report.batteryConsumedPercentage}%`}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
