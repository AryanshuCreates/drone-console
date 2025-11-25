"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  Marker,
  useMapEvents,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

import { LatLng, MissionPattern, SurveyArea } from "@/lib/types";
import { generateWaypointsForMission } from "@/lib/path-planning";
import { cn } from "@/lib/utils";

interface MissionAreaPlannerMapProps {
  siteCode: string;
  pattern: MissionPattern;
  overlap: number;
  onChange: (area: SurveyArea, waypoints: LatLng[]) => void;
}

const DEFAULT_CENTER: LatLngExpression = [18.5204, 73.8567]; // Pune-ish

type SetPoints = React.Dispatch<React.SetStateAction<LatLng[]>>;

function ClickToDraw({ setPoints }: { setPoints: SetPoints }) {
  useMapEvents({
    click(e) {
      setPoints((prev) => [...prev, { lat: e.latlng.lat, lng: e.latlng.lng }]);
    },
  });
  return null;
}

export function MissionAreaPlannerMap({
  siteCode,
  pattern,
  overlap,
  onChange,
}: MissionAreaPlannerMapProps) {
  const [points, setPoints] = useState<LatLng[]>([]);
  const [localWaypoints, setLocalWaypoints] = useState<LatLng[]>([]);

  const polygonPositions: LatLngExpression[] = useMemo(
    () => points.map((p) => [p.lat, p.lng]),
    [points]
  );

  // ✅ Compute waypoints & notify parent only when inputs change
  useEffect(() => {
    if (points.length < 3) {
      setLocalWaypoints([]);
      return;
    }

    const area: SurveyArea = {
      id: "PLANNED",
      name: `${siteCode || "Unknown"} Survey Area`,
      siteCode: siteCode || "UNKNOWN",
      polygon: points,
    };

    const wpts = generateWaypointsForMission(area, pattern, overlap);
    setLocalWaypoints(wpts);
    onChange(area, wpts);
  }, [points, siteCode, pattern, overlap, onChange]);

  const center: LatLngExpression = polygonPositions[0] ?? DEFAULT_CENTER;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <p>Click on the map to define your survey polygon.</p>
        <button
          type="button"
          onClick={() => setPoints([])}
          className={cn(
            "rounded-full border border-slate-300 px-2 py-1 text-[10px] uppercase tracking-wide hover:bg-slate-100"
          )}
        >
          Reset area
        </button>
      </div>

      <div className="h-72 overflow-hidden rounded-2xl border border-slate-200">
        <MapContainer
          center={center}
          zoom={16}
          className="h-full w-full"
          scrollWheelZoom
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ClickToDraw setPoints={setPoints} />

          {polygonPositions.length >= 3 && (
            <Polygon
              positions={polygonPositions}
              pathOptions={{ color: "#6366f1", weight: 2 }}
            />
          )}

          {localWaypoints.length > 1 && (
            <>
              <Polyline
                positions={localWaypoints.map((w) => [w.lat, w.lng])}
                pathOptions={{ color: "#22c55e", weight: 2 }}
              />
              <Marker
                position={[localWaypoints[0].lat, localWaypoints[0].lng]}
              />
            </>
          )}
        </MapContainer>
      </div>

      <p className="text-[11px] text-slate-500">
        Points: {points.length} · Generated waypoints: {localWaypoints.length} ·
        Pattern: {pattern.toLowerCase()}
      </p>
    </div>
  );
}
