// lib/mock-data.ts
import {
  Drone,
  Mission,
  MissionReport,
  OrgSurveyStats,
  TelemetryPoint,
  SurveyArea,
  LatLng,
} from "./types";
import { generateWaypointsForMission } from "./path-planning";

const now = Date.now();

/**
 * Simple geographic helpers
 * (rough, but good enough to make the map look realistic).
 */

// San Francisco DC1 bounding polygon (approx over a block)
const SFO_DC1_POLYGON: LatLng[] = [
  { lat: 37.7745, lng: -122.4194 },
  { lat: 37.7745, lng: -122.4184 },
  { lat: 37.7737, lng: -122.4184 },
  { lat: 37.7737, lng: -122.4194 },
];

// Pune plant polygon (some industrial area outline)
const PUNE_PLANT_POLYGON: LatLng[] = [
  { lat: 18.5204, lng: 73.8567 },
  { lat: 18.5204, lng: 73.8575 },
  { lat: 18.5197, lng: 73.8575 },
  { lat: 18.5197, lng: 73.8567 },
];

// Survey areas reused by missions
const sfoPerimeterArea: SurveyArea = {
  id: "area_1",
  name: "DC SFO1 Perimeter",
  siteCode: "US-SFO-DC1",
  polygon: SFO_DC1_POLYGON,
};

const puneRoofArea: SurveyArea = {
  id: "area_2",
  name: "Main Plant Roof",
  siteCode: "IN-PN-PL1",
  polygon: PUNE_PLANT_POLYGON,
};

const sfoYardArea: SurveyArea = {
  id: "area_3",
  name: "Yard Area",
  siteCode: "US-SFO-DC1",
  polygon: SFO_DC1_POLYGON.map((p) => ({
    lat: p.lat - 0.0005,
    lng: p.lng + 0.0008,
  })),
};

// Pre-generated waypoints based on area, pattern & overlap
const mission1Waypoints = generateWaypointsForMission(
  sfoPerimeterArea,
  "PERIMETER",
  70
);

const mission2Waypoints = generateWaypointsForMission(
  puneRoofArea,
  "CROSSHATCH",
  80
);

const mission3Waypoints = generateWaypointsForMission(
  sfoYardArea,
  "CROSSHATCH",
  65
);

// =======================
// DRONES
// =======================

export const dronesStore: Drone[] = [
  {
    id: "drone_1",
    name: "Falcon-01",
    model: "DJI M300 RTK",
    siteCode: "US-SFO-DC1",
    status: "IN_MISSION",
    batteryLevel: 61,
    lastHeartbeatAt: new Date(now - 30_000).toISOString(),
  },
  {
    id: "drone_2",
    name: "Falcon-02",
    model: "DJI M300 RTK",
    siteCode: "US-SFO-DC1",
    status: "AVAILABLE",
    batteryLevel: 100,
    lastHeartbeatAt: new Date(now - 60_000).toISOString(),
  },
  {
    id: "drone_3",
    name: "Sentinel-01",
    model: "Skydio X2",
    siteCode: "IN-PN-PL1",
    status: "CHARGING",
    batteryLevel: 38,
    lastHeartbeatAt: new Date(now - 120_000).toISOString(),
  },
];

// =======================
// MISSIONS
// =======================

export const missionsStore: Mission[] = [
  {
    id: "mission_1",
    name: "Perimeter Sweep - DC SFO1",
    siteCode: "US-SFO-DC1",
    surveyArea: sfoPerimeterArea,
    status: "IN_PROGRESS",
    assignedDroneId: "drone_1",
    config: {
      altitudeMeters: 80,
      overlapPercentage: 70,
      pathPattern: "PERIMETER",
      speedMetersPerSecond: 7,
      dataCollectionFrequencySeconds: 2,
      sensors: ["RGB"],
      waypoints: mission1Waypoints,
    },
    createdAt: new Date(now - 3_600_000).toISOString(), // 1 hour ago
    startedAt: new Date(now - 900_000).toISOString(), // 15 min ago
  },
  {
    id: "mission_2",
    name: "Roof Inspection - Plant Pune",
    siteCode: "IN-PN-PL1",
    surveyArea: puneRoofArea,
    status: "PLANNED",
    assignedDroneId: null,
    config: {
      altitudeMeters: 50,
      overlapPercentage: 80,
      pathPattern: "CROSSHATCH",
      speedMetersPerSecond: 5,
      dataCollectionFrequencySeconds: 3,
      sensors: ["RGB", "Thermal"],
      waypoints: mission2Waypoints,
    },
    createdAt: new Date(now - 7_200_000).toISOString(), // 2 hours ago
  },
  {
    id: "mission_3",
    name: "Yard Mapping - DC SFO1",
    siteCode: "US-SFO-DC1",
    surveyArea: sfoYardArea,
    status: "COMPLETED",
    assignedDroneId: "drone_2",
    config: {
      altitudeMeters: 90,
      overlapPercentage: 65,
      pathPattern: "CROSSHATCH",
      speedMetersPerSecond: 6,
      dataCollectionFrequencySeconds: 2,
      sensors: ["RGB"],
      waypoints: mission3Waypoints,
    },
    createdAt: new Date(now - 86_400_000).toISOString(), // 24h ago
    startedAt: new Date(now - 85_900_000).toISOString(),
    completedAt: new Date(now - 85_500_000).toISOString(),
  },
];

// =======================
// REPORTS / ORG STATS
// =======================

export const missionReportsStore: MissionReport[] = [
  {
    missionId: "mission_3",
    missionName: "Yard Mapping - DC SFO1",
    siteCode: "US-SFO-DC1",
    durationSeconds: 2400,
    distanceMeters: 7800,
    areaCoverageSquareMeters: 120_000,
    coveragePercentage: 96.4,
    batteryConsumedPercentage: 52,
  },
];

export const orgStatsStore: OrgSurveyStats = {
  totalSurveys: missionReportsStore.length,
  totalDistanceMeters: missionReportsStore.reduce(
    (sum, m) => sum + m.distanceMeters,
    0
  ),
  totalAreaCoveredSquareMeters: missionReportsStore.reduce(
    (sum, m) => sum + m.areaCoverageSquareMeters,
    0
  ),
  avgCoveragePercentage:
    missionReportsStore.reduce((sum, m) => sum + m.coveragePercentage, 0) /
    missionReportsStore.length,
};

// =======================
// ACCESS HELPERS
// =======================

export function getMissions() {
  return Promise.resolve([...missionsStore]);
}

export function getMissionById(id: string) {
  return Promise.resolve(missionsStore.find((m) => m.id === id) ?? null);
}

export function getDrones() {
  return Promise.resolve([...dronesStore]);
}

export function getMissionReport(missionId: string) {
  return Promise.resolve(
    missionReportsStore.find((r) => r.missionId === missionId) ?? null
  );
}

export function getOrgStats() {
  return Promise.resolve(orgStatsStore);
}

// =======================
// TELEMETRY
// =======================

/**
 * Very simple interpolation over waypoints to generate a smooth path.
 * t is between 0 and 1.
 */
function interpolateOnPath(waypoints: LatLng[], t: number): LatLng {
  if (!waypoints.length) {
    return { lat: 0, lng: 0 };
  }

  if (waypoints.length === 1) return waypoints[0];

  const scaled = t * (waypoints.length - 1);
  const idx = Math.floor(scaled);
  const frac = scaled - idx;

  const a = waypoints[idx];
  const b = waypoints[Math.min(idx + 1, waypoints.length - 1)];

  return {
    lat: a.lat + (b.lat - a.lat) * frac,
    lng: a.lng + (b.lng - a.lng) * frac,
  };
}

/**
 * Generate telemetry for a mission, walking along its waypoints.
 * If there are no waypoints, we fall back to a simple straight-line path.
 */
export function getTelemetryForMission(
  missionId: string
): Promise<TelemetryPoint[]> {
  const mission = missionsStore.find((m) => m.id === missionId);

  const waypoints =
    mission?.config.waypoints && mission.config.waypoints.length > 1
      ? mission.config.waypoints
      : SFO_DC1_POLYGON; // fallback

  const start = now - 900_000; // 15 minutes ago
  const steps = 10;
  const points: TelemetryPoint[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const pos = interpolateOnPath(waypoints, t);

    points.push({
      timestamp: new Date(start + i * 60_000).toISOString(),
      lat: pos.lat,
      lng: pos.lng,
      altitudeMeters: mission?.config.altitudeMeters ?? 80,
      batteryLevel: 95 - i * 4, // drains over time
      speedMetersPerSecond: mission?.config.speedMetersPerSecond ?? 7,
      missionProgressPercentage: t * 100,
    });
  }

  return Promise.resolve(points);
}
