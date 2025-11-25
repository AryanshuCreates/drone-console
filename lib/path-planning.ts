import { LatLng, MissionPattern, SurveyArea } from "./types";

function calcBoundingBox(polygon: LatLng[]) {
  const lats = polygon.map((p) => p.lat);
  const lngs = polygon.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  return { minLat, maxLat, minLng, maxLng };
}

export function generateWaypointsForMission(
  area: SurveyArea,
  pattern: MissionPattern,
  overlap: number
): LatLng[] {
  if (!area.polygon.length) return [];

  const { minLat, maxLat, minLng, maxLng } = calcBoundingBox(area.polygon);

  const waypoints: LatLng[] = [];

  const latSpan = maxLat - minLat || 0.0005;
  const lngSpan = maxLng - minLng || 0.0005;

  // crude step derived from overlap: more overlap → smaller step
  const steps = Math.max(4, Math.round((100 - overlap) / 5));
  const latStep = latSpan / steps;
  const lngStep = lngSpan / steps;

  if (pattern === "PERIMETER") {
    // simple rectangular perimeter around bbox
    waypoints.push(
      { lat: minLat, lng: minLng },
      { lat: minLat, lng: maxLng },
      { lat: maxLat, lng: maxLng },
      { lat: maxLat, lng: minLng },
      { lat: minLat, lng: minLng }
    );
    return waypoints;
  }

  if (pattern === "CROSSHATCH") {
    // vertical passes
    for (let i = 0; i <= steps; i++) {
      const lng = minLng + lngStep * i;
      const top = { lat: maxLat, lng };
      const bottom = { lat: minLat, lng };
      if (i % 2 === 0) {
        waypoints.push(top, bottom);
      } else {
        waypoints.push(bottom, top);
      }
    }
    // horizontal passes
    for (let i = 0; i <= steps; i++) {
      const lat = minLat + latStep * i;
      const left = { lat, lng: minLng };
      const right = { lat, lng: maxLng };
      if (i % 2 === 0) {
        waypoints.push(right, left);
      } else {
        waypoints.push(left, right);
      }
    }
    return waypoints;
  }

  // LINEAR: simple diagonal over bbox
  waypoints.push({ lat: minLat, lng: minLng }, { lat: maxLat, lng: maxLng });
  return waypoints;
}
