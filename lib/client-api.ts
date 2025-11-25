// lib/client-api.ts
import {
  Drone,
  Mission,
  MissionReport,
  OrgSurveyStats,
  TelemetryPoint,
} from "./types";

// Detect if we're running on the server (RSC / route handlers) or in the browser
const isServer = typeof window === "undefined";

/**
 * API_BASE rules:
 * - In production, set NEXT_PUBLIC_API_BASE to your full origin (e.g. https://your-app.vercel.app)
 * - In local dev:
 *    - on the server: use http://localhost:3000
 *    - in the browser: we can use relative URLs
 */
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || (isServer ? "http://localhost:3000" : "");

/**
 * Helper to build API URLs.
 * On server, this will be an absolute URL.
 * In the browser, it's fine as relative (e.g. "/api/overview").
 */
function apiUrl(path: string) {
  // Ensure path starts with "/"
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Overview endpoint: aggregated dashboard data.
 */
export async function fetchOverview() {
  const res = await fetch(apiUrl("/api/overview"), {
    cache: "no-store",
  });

  return handle<{
    missions: Mission[];
    drones: Drone[];
    stats: OrgSurveyStats;
    summary: { activeMissions: number; availableDrones: number };
  }>(res);
}

/**
 * List all missions (most recent first from the API).
 */
export async function fetchMissions() {
  const res = await fetch(apiUrl("/api/missions"), {
    cache: "no-store",
  });
  return handle<Mission[]>(res);
}

/**
 * Get a single mission by id.
 * Returns null if the mission doesn't exist (404).
 */
export async function fetchMissionById(id: string) {
  const res = await fetch(apiUrl(`/api/missions/${id}`), {
    cache: "no-store",
  });

  if (res.status === 404) {
    return null;
  }

  return handle<Mission>(res);
}

/**
 * Get telemetry for a mission.
 * Returns [] if mission/telemetry is not found.
 */
export async function fetchMissionTelemetry(id: string) {
  const res = await fetch(apiUrl(`/api/missions/${id}/telemetry`), {
    cache: "no-store",
  });

  if (res.status === 404) {
    return [] as TelemetryPoint[];
  }

  return handle<TelemetryPoint[]>(res);
}

/**
 * Get the fleet inventory.
 */
export async function fetchDrones() {
  const res = await fetch(apiUrl("/api/drones"), {
    cache: "no-store",
  });
  return handle<Drone[]>(res);
}

/**
 * Get all mission-level reports.
 */
export async function fetchReports() {
  const res = await fetch(apiUrl("/api/reports"), {
    cache: "no-store",
  });
  return handle<MissionReport[]>(res);
}

/**
 * Get org-wide survey statistics.
 * We reuse /api/overview and just return the "stats" subtree.
 */
export async function fetchOrgStats() {
  const res = await fetch(apiUrl("/api/overview"), {
    cache: "no-store",
  });
  const data = await handle<{
    missions: Mission[];
    drones: Drone[];
    stats: OrgSurveyStats;
    summary: { activeMissions: number; availableDrones: number };
  }>(res);

  return data.stats;
}

/**
 * Get a detailed report for a specific mission.
 * Returns null if the mission or report doesn't exist.
 */
export async function fetchReportByMissionId(id: string) {
  const res = await fetch(apiUrl(`/api/reports/${id}`), {
    cache: "no-store",
  });

  if (res.status === 404) {
    return null;
  }

  return handle<{ mission: Mission; report: MissionReport }>(res);
}
