"use client";

import { TelemetryPoint } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

interface TelemetryPanelProps {
  telemetry: TelemetryPoint[];
}

export function TelemetryPanel({ telemetry }: TelemetryPanelProps) {
  const last = telemetry[telemetry.length - 1];

  return (
    <Card className="border border-border bg-card">
      <CardContent className="space-y-3 p-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
          Telemetry snapshot
        </p>

        {!last ? (
          <p className="text-xs text-text-muted">
            No live telemetry available yet for this mission.
          </p>
        ) : (
          <div className="space-y-2 text-xs text-text-secondary">
            <div className="flex justify-between">
              <span>Last update</span>
              <span className="font-mono">
                {new Date(last.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Lat / Lng</span>
              <span className="font-mono">
                {last.lat.toFixed(5)}, {last.lng.toFixed(5)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Altitude</span>
              <span className="font-mono">
                {last.altitudeMeters.toFixed(0)} m
              </span>
            </div>
            <div className="flex justify-between">
              <span>Speed</span>
              <span className="font-mono">
                {last.speedMetersPerSecond.toFixed(1)} m/s
              </span>
            </div>
            <div className="flex justify-between">
              <span>Battery</span>
              <span className="font-mono">{last.batteryLevel}%</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
