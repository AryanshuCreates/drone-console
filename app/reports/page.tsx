import { fetchReports, fetchOrgStats } from "@/lib/client-api";
import { ReportSummaryCard } from "@/components/reports/report-summary-card";
import { MissionReportTable } from "@/components/reports/mission-report-table";
import { MissionMetricsChart } from "@/components/reports/mission-metrics-chart";

export default async function ReportsPage() {
  const [stats, reports] = await Promise.all([fetchOrgStats(), fetchReports()]);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Survey reports</h1>
        <p className="text-sm text-slate-500">
          Summaries of completed missions, coverage, and flight statistics.
        </p>
      </header>

      <ReportSummaryCard stats={stats} />

      <section className="grid gap-4 md:grid-cols-[1.4fr,1.8fr]">
        <MissionMetricsChart reports={reports} />
        <MissionReportTable reports={reports} />
      </section>
    </div>
  );
}
