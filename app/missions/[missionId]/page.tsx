import { fetchMissionById, fetchMissionTelemetry } from "@/lib/client-api";
import MissionDetailClient from "./mission-detail-client";

interface MissionDetailPageProps {
  params: Promise<{ missionId: string }>;
}

export default async function MissionDetailPage({
  params,
}: MissionDetailPageProps) {
  const { missionId } = await params;

  const mission = await fetchMissionById(missionId);

  if (!mission) {
    return (
      <div className="space-y-2">
        <h1 className="text-lg font-semibold text-slate-900">
          Mission not found
        </h1>
        <p className="text-sm text-slate-500">
          No mission exists with ID <code className="text-xs">{missionId}</code>
          . Double-check the URL or go back to the Missions list.
        </p>
      </div>
    );
  }

  const telemetry = await fetchMissionTelemetry(missionId);

  return <MissionDetailClient mission={mission} initialTelemetry={telemetry} />;
}
