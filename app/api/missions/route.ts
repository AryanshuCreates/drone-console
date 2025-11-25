import { NextRequest } from "next/server";
import { missionsStore } from "@/lib/mock-data";
import { Mission } from "@/lib/types";
import {
  jsonBadRequest,
  jsonCreated,
  jsonOk,
  jsonServerError,
} from "@/lib/api-utils";

export async function GET() {
  // For now, just return everything; pagination can be added later
  return jsonOk(missionsStore);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, siteCode, config, surveyArea } = body;

    if (!name || !siteCode || !config || !surveyArea) {
      return jsonBadRequest(
        "name, siteCode, config, and surveyArea are required."
      );
    }

    const nowIso = new Date().toISOString();

    const mission: Mission = {
      id: `mission_${Date.now()}`,
      name,
      siteCode,
      surveyArea,
      config,
      status: "PLANNED",
      assignedDroneId: null,
      createdAt: nowIso,
    };

    missionsStore.unshift(mission);

    return jsonCreated(mission);
  } catch (error) {
    console.error("POST /api/missions error", error);
    return jsonServerError();
  }
}
