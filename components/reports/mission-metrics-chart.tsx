"use client";

import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { MissionReport } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

interface MissionMetricsChartProps {
  reports: MissionReport[];
}

export function MissionMetricsChart({ reports }: MissionMetricsChartProps) {
  const data = reports.map((r) => ({
    name: r.missionName,
    durationMin: r.durationSeconds / 60,
    distanceKm: r.distanceMeters / 1000,
    coveragePct: r.coveragePercentage,
  }));

  if (!data.length) return null;

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4">
        <h2 className="mb-3 text-sm font-semibold text-text-secondary">
          Mission metrics
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                interval={0}
                angle={-25}
                textAnchor="end"
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="durationMin" name="Duration (min)" />
              <Bar dataKey="distanceKm" name="Distance (km)" />
              <Bar dataKey="coveragePct" name="Coverage (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
