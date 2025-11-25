import { NextRequest } from "next/server";
import { getMissionById, getMissionReport } from "@/lib/mock-data";
import { jsonNotFound, jsonOk, jsonServerError } from "@/lib/api-utils";

interface Params {
  params: { missionId: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const mission = await getMissionById(params.missionId);
    if (!mission) return jsonNotFound("Mission not found.");

    const report = await getMissionReport(params.missionId);
    if (!report) return jsonNotFound("Report not found for this mission.");

    return jsonOk({ mission, report });
  } catch (error) {
    console.error("GET /api/reports/[missionId] error", error);
    return jsonServerError();
  }
}
