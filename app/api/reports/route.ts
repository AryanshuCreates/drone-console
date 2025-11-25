import { jsonOk, jsonServerError } from "@/lib/api-utils";
import { missionReportsStore } from "@/lib/mock-data";

export async function GET() {
  try {
    // Later you can add filters (by site, date range, etc.)
    return jsonOk(missionReportsStore);
  } catch (error) {
    console.error("GET /api/reports error", error);
    return jsonServerError();
  }
}
