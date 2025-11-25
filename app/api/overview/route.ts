import { jsonOk, jsonServerError } from "@/lib/api-utils";
import { getDrones, getMissions, getOrgStats } from "@/lib/mock-data";

export async function GET() {
  try {
    const [missions, drones, stats] = await Promise.all([
      getMissions(),
      getDrones(),
      getOrgStats(),
    ]);

    const activeMissions = missions.filter((m) =>
      ["STARTING", "IN_PROGRESS", "PAUSED"].includes(m.status)
    );
    const availableDrones = drones.filter((d) => d.status === "AVAILABLE");

    return jsonOk({
      missions,
      drones,
      stats,
      summary: {
        activeMissions: activeMissions.length,
        availableDrones: availableDrones.length,
      },
    });
  } catch (error) {
    console.error("GET /api/overview error", error);
    return jsonServerError();
  }
}
