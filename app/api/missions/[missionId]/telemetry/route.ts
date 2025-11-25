import { NextRequest } from "next/server";
import { getTelemetryForMission, missionsStore } from "@/lib/mock-data";
import { jsonNotFound, jsonOk, jsonServerError } from "@/lib/api-utils";

interface Params {
  params: { missionId: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const mission = missionsStore.find((m) => m.id === params.missionId);
    if (!mission) return jsonNotFound("Mission not found.");

    const telemetry = await getTelemetryForMission(params.missionId);
    return jsonOk(telemetry);
  } catch (error) {
    console.error("GET /api/missions/[missionId]/telemetry error", error);
    return jsonServerError();
  }
}
