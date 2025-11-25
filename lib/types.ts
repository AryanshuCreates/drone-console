export type MissionPattern = "CROSSHATCH" | "PERIMETER" | "LINEAR";

export type MissionStatus =
  | "PLANNED"
  | "SCHEDULED"
  | "STARTING"
  | "IN_PROGRESS"
  | "PAUSED"
  | "COMPLETED"
  | "ABORTED";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface SurveyArea {
  id: string;
  name: string;
  siteCode: string;
  polygon: LatLng[]; // polygon vertices in lat/lng
}

export interface MissionConfig {
  altitudeMeters: number;
  overlapPercentage: number;
  pathPattern: MissionPattern;
  speedMetersPerSecond: number;
  dataCollectionFrequencySeconds: number;
  sensors: string[];
  waypoints: LatLng[]; // generated flight path
}

export interface Drone {
  id: string;
  name: string;
  model: string;
  siteCode: string;
  status: "AVAILABLE" | "IN_MISSION" | "CHARGING" | "MAINTENANCE";
  batteryLevel: number;
  lastHeartbeatAt: string;
}

export interface Mission {
  id: string;
  name: string;
  siteCode: string;
  surveyArea: SurveyArea;
  status: MissionStatus;
  assignedDroneId: string | null;
  config: MissionConfig;
  createdAt: string;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  abortedAt?: string;
}

export interface TelemetryPoint {
  timestamp: string;
  lat: number;
  lng: number;
  altitudeMeters: number;
  batteryLevel: number;
  speedMetersPerSecond: number;
  missionProgressPercentage: number;
}

export interface MissionReport {
  missionId: string;
  missionName: string;
  siteCode: string;
  durationSeconds: number;
  distanceMeters: number;
  areaCoverageSquareMeters: number;
  coveragePercentage: number;
  batteryConsumedPercentage: number;
}

export interface OrgSurveyStats {
  totalSurveys: number;
  totalDistanceMeters: number;
  totalAreaCoveredSquareMeters: number;
  avgCoveragePercentage: number;
}
