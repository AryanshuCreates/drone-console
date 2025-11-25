"use client";

import { useEffect, useState } from "react";
import { Mission, TelemetryPoint } from "@/lib/types";
import { MissionMap } from "@/components/monitoring/mission-map";
import { TelemetryPanel } from "@/components/monitoring/telemetry-panel";
import { ProgressBar } from "@/components/ui/progress-bar";
import { MissionActions } from "@/components/missions/mission-actions";

interface MissionDetailClientProps {
  mission: Mission;
  initialTelemetry: TelemetryPoint[];
}

function formatDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default function MissionDetailClient({
  mission: initialMission,
  initialTelemetry,
}: MissionDetailClientProps) {
  const [mission, setMission] = useState<Mission>(initialMission);
  const [telemetry, setTelemetry] =
    useState<TelemetryPoint[]>(initialTelemetry);

  const last = telemetry[telemetry.length - 1];

  const progress =
    last?.missionProgressPercentage ??
    (mission.completedAt ? 100 : mission.status === "IN_PROGRESS" ? 50 : 0);

  const etaMinutes =
    progress > 0 && progress < 100 ? Math.round((100 - progress) / 8) : 0;

  // Poll mission + telemetry every 5s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const [missionRes, telemetryRes] = await Promise.all([
          fetch(`/api/missions/${mission.id}`, { cache: "no-store" }),
          fetch(`/api/missions/${mission.id}/telemetry`, {
            cache: "no-store",
          }),
        ]);

        if (missionRes.ok) {
          const updated = (await missionRes.json()) as Mission;
          setMission(updated);
        }

        if (telemetryRes.ok) {
          const points = (await telemetryRes.json()) as TelemetryPoint[];
          setTelemetry(points);
        }
      } catch {
        // swallow polling errors for now
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [mission.id]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{mission.name}</h1>
          <p className="text-sm text-slate-500">
            {mission.siteCode} · Pattern:{" "}
            {mission.config.pathPattern.toLowerCase()} · Altitude:{" "}
            {mission.config.altitudeMeters}m · Sensors:{" "}
            {mission.config.sensors.join(", ")}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Status: {mission.status.toLowerCase().replace("_", " ")}
            {mission.status === "IN_PROGRESS" && (
              <span className="ml-2 inline-flex items-center gap-1 text-emerald-500">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                LIVE
              </span>
            )}
          </p>
        </div>
        <MissionActions mission={mission} />
      </header>

      {/* Mission metadata + map/telemetry */}
      <section className="grid gap-4 md:grid-cols-[1.1fr,1.8fr]">
        {/* Left: mission metadata */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4 text-xs text-text-secondary">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted mb-2">
              Mission timeline
            </p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Created</span>
                <span className="font-mono">
                  {formatDate(mission.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Started</span>
                <span className="font-mono">
                  {formatDate(mission.startedAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Completed</span>
                <span className="font-mono">
                  {formatDate(mission.completedAt)}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-1">
              <div className="flex justify-between">
                <span>Assigned drone</span>
                <span className="font-mono">
                  {mission.assignedDroneId ?? "Unassigned"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Overlap</span>
                <span className="font-mono">
                  {mission.config.overlapPercentage}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Capture frequency</span>
                <span className="font-mono">
                  {mission.config.dataCollectionFrequencySeconds}s
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted mb-2">
              Mission progress
            </p>
            <ProgressBar value={progress} />
            <p className="mt-1 text-xs text-text-secondary">
              {progress.toFixed(0)}% complete
              {progress > 0 && progress < 100 && (
                <> · ETA ~{etaMinutes} min (simulated)</>
              )}
            </p>
          </div>
        </div>

        {/* Right: map + telemetry */}
        <div className="space-y-4">
          <MissionMap mission={mission} telemetry={telemetry} />
          <TelemetryPanel telemetry={telemetry} />
        </div>
      </section>
    </div>
  );
}
