import { jsonOk, jsonServerError } from "@/lib/api-utils";
import { getDrones } from "@/lib/mock-data";

export async function GET() {
  try {
    const drones = await getDrones();
    return jsonOk(drones);
  } catch (error) {
    console.error("GET /api/drones error", error);
    return jsonServerError();
  }
}
