"use client";

import { TelemetryPoint, Mission } from "@/lib/types";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Polygon,
  Marker,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

interface MissionMapProps {
  mission: Mission;
  telemetry: TelemetryPoint[];
}

export function MissionMap({ mission, telemetry }: MissionMapProps) {
  const path: LatLngExpression[] = telemetry.map((t) => [t.lat, t.lng]);
  const last = telemetry[telemetry.length - 1];

  const polygon: LatLngExpression[] =
    mission.surveyArea?.polygon?.map((p) => [p.lat, p.lng]) ?? [];

  const center: LatLngExpression = last
    ? ([last.lat, last.lng] as LatLngExpression)
    : polygon[0] ?? ([18.5204, 73.8567] as LatLngExpression);

  return (
    <div className="h-72 overflow-hidden rounded-2xl border border-border bg-muted/40">
      <MapContainer
        center={center}
        zoom={16}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {polygon.length >= 3 && (
          <Polygon
            positions={polygon}
            pathOptions={{ color: "#6366f1", weight: 2 }}
          />
        )}

        {path.length > 1 && (
          <Polyline
            positions={path}
            pathOptions={{ color: "#22c55e", weight: 3 }}
          />
        )}

        {last && <Marker position={[last.lat, last.lng]} />}
      </MapContainer>
    </div>
  );
}
