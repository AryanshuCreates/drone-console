"use client";

import { useState, useCallback } from "react";
import { MissionConfig, MissionPattern, SurveyArea, LatLng } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MissionAreaPlannerMap } from "@/components/missions/mission-area-planner-map";

interface MissionFormProps {
  onSubmitSuccess?: () => void;
}

const AVAILABLE_SENSORS = ["RGB", "Thermal", "Multispectral"] as const;
const PATTERNS: MissionPattern[] = ["CROSSHATCH", "PERIMETER", "LINEAR"];

export function MissionForm({ onSubmitSuccess }: MissionFormProps) {
  const [name, setName] = useState("");
  const [siteCode, setSiteCode] = useState("");
  const [pattern, setPattern] = useState<MissionPattern>("CROSSHATCH");
  const [altitude, setAltitude] = useState(80);
  const [overlap, setOverlap] = useState(70);
  const [frequency, setFrequency] = useState(2);
  const [sensors, setSensors] = useState<string[]>(["RGB"]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [surveyArea, setSurveyArea] = useState<SurveyArea | null>(null);
  const [waypoints, setWaypoints] = useState<LatLng[]>([]);

  const toggleSensor = (s: string) => {
    setSensors((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  // ✅ Stable callback so MissionAreaPlannerMap's useEffect doesn't loop
  const handleAreaChange = useCallback((area: SurveyArea, wpts: LatLng[]) => {
    setSurveyArea(area);
    setWaypoints(wpts);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!surveyArea || waypoints.length < 2) {
      alert("Please define a survey area on the map.");
      return;
    }
    setIsSubmitting(true);

    const config: MissionConfig = {
      altitudeMeters: altitude,
      overlapPercentage: overlap,
      pathPattern: pattern,
      speedMetersPerSecond: 6,
      dataCollectionFrequencySeconds: frequency,
      sensors,
      waypoints,
    };

    await fetch("/api/missions", {
      method: "POST",
      body: JSON.stringify({
        name,
        siteCode,
        config,
        surveyArea,
      }),
    }).catch(console.error);

    setIsSubmitting(false);
    setName("");
    setSiteCode("");
    setSurveyArea(null);
    setWaypoints([]);
    onSubmitSuccess?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-border bg-card p-4"
    >
      {/* Top row */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-text-secondary">
            Mission name
          </label>
          <Input
            className="mt-1 text-sm"
            placeholder="Security sweep - DC SFO1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-text-secondary">
            Site code
          </label>
          <Input
            className="mt-1 text-sm"
            placeholder="US-SFO-DC1"
            value={siteCode}
            onChange={(e) => setSiteCode(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Map-based survey area + path */}
      <MissionAreaPlannerMap
        siteCode={siteCode}
        pattern={pattern}
        overlap={overlap}
        onChange={handleAreaChange}
      />

      {/* Flight + data params */}
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="text-xs font-medium text-text-secondary">
            Altitude (m)
          </label>
          <Input
            className="mt-1 text-sm"
            type="number"
            min={20}
            max={150}
            value={altitude}
            onChange={(e) => setAltitude(Number(e.target.value))}
          />
          <p className="mt-1 text-[10px] text-text-muted">
            Higher altitude = more coverage, less detail.
          </p>
        </div>
        <div>
          <label className="text-xs font-medium text-text-secondary">
            Overlap (%)
          </label>
          <Input
            className="mt-1 text-sm"
            type="number"
            min={50}
            max={90}
            value={overlap}
            onChange={(e) => setOverlap(Number(e.target.value))}
          />
          <p className="mt-1 text-[10px] text-text-muted">
            Overlap between passes for coverage.
          </p>
        </div>
        <div>
          <label className="text-xs font-medium text-text-secondary">
            Capture every (s)
          </label>
          <Input
            className="mt-1 text-sm"
            type="number"
            min={1}
            max={10}
            value={frequency}
            onChange={(e) => setFrequency(Number(e.target.value))}
          />
          <p className="mt-1 text-[10px] text-text-muted">
            Logical data capture frequency (no media).
          </p>
        </div>
      </div>

      {/* Pattern + sensors */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Pattern selection */}
        <div>
          <label className="text-xs font-medium text-text-secondary">
            Flight pattern
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {PATTERNS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPattern(p)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide",
                  pattern === p
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                )}
              >
                {p.toLowerCase()}
              </button>
            ))}
          </div>
          <p className="mt-1 text-[10px] text-text-muted">
            Crosshatch for mapping, perimeter for security patrols.
          </p>
        </div>

        {/* Sensors selection */}
        <div>
          <label className="text-xs font-medium text-text-secondary">
            Sensors to use
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {AVAILABLE_SENSORS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSensor(s)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium",
                  sensors.includes(s)
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <p className="mt-1 text-[10px] text-text-muted">
            Logical payload configuration for the mission (no actual media).
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="submit"
          disabled={isSubmitting || !name || !siteCode || !surveyArea}
        >
          {isSubmitting ? "Creating mission…" : "Create mission"}
        </Button>
      </div>
    </form>
  );
}
