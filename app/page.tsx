import { fetchOverview } from "@/lib/client-api";
import { StatCard } from "@/components/ui/stat-card";
import { MissionList } from "@/components/missions/mission-list";
import { Card, CardContent } from "@/components/ui/card";

export default async function OverviewPage() {
  const data = await fetchOverview();
  const { missions, stats, summary, drones } = data;

  const recentMissions = missions.slice(0, 6);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Operations Overview
          </h1>
          <p className="text-sm text-slate-500">
            Monitor mission load, fleet utilization, and coverage across all
            sites.
          </p>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Total Surveys"
          value={stats.totalSurveys}
          subtitle="Completed missions"
        />
        <StatCard
          label="Active Missions"
          value={summary.activeMissions}
          subtitle="In progress / starting"
        />
        <StatCard
          label="Available Drones"
          value={summary.availableDrones}
          subtitle="Ready for dispatch"
        />
        <StatCard
          label="Avg Coverage"
          value={`${stats.avgCoveragePercentage.toFixed(1)}%`}
          subtitle="Per survey"
        />
      </section>

      <section className="grid gap-6 md:grid-cols-[2fr,1.1fr]">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-700">
            Recent missions
          </h2>
          <MissionList missions={recentMissions} />
        </div>

        <Card className="border border-slate-200 bg-white">
          <CardContent className="p-4">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">
              Fleet snapshot
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              {drones.length} assets across{" "}
              {new Set(drones.map((d) => d.siteCode)).size} sites.
            </p>
            {/* You can add a small utilization chart here later */}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
