import { NextRequest } from "next/server";
import { missionsStore } from "@/lib/mock-data";
import { MissionStatus } from "@/lib/types";
import {
  jsonBadRequest,
  jsonNotFound,
  jsonOk,
  jsonServerError,
} from "@/lib/api-utils";

interface Params {
  params: { missionId: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  const mission = missionsStore.find((m) => m.id === params.missionId);
  if (!mission) return jsonNotFound("Mission not found.");

  return jsonOk(mission);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const mission = missionsStore.find((m) => m.id === params.missionId);
    if (!mission) return jsonNotFound("Mission not found.");

    const body = await req.json();
    const { status } = body as { status?: MissionStatus };

    if (!status) return jsonBadRequest("status is required for update.");

    const validStatuses: MissionStatus[] = [
      "PLANNED",
      "SCHEDULED",
      "STARTING",
      "IN_PROGRESS",
      "PAUSED",
      "COMPLETED",
      "ABORTED",
    ];

    if (!validStatuses.includes(status)) {
      return jsonBadRequest("Invalid mission status.");
    }

    // Here you could enforce more strict transitions (state machine).
    mission.status = status;

    if (status === "IN_PROGRESS" && !mission.startedAt) {
      mission.startedAt = new Date().toISOString();
    }
    if (status === "COMPLETED") {
      mission.completedAt = new Date().toISOString();
    }
    if (status === "ABORTED") {
      mission.abortedAt = new Date().toISOString();
    }

    return jsonOk(mission);
  } catch (error) {
    console.error("PATCH /api/missions/[missionId] error", error);
    return jsonServerError();
  }
}
