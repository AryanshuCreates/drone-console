import Link from "next/link";
import { Mission } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { MissionStatusBadge } from "./mission-status-badge";

interface MissionListProps {
  missions: Mission[];
}

export function MissionList({ missions }: MissionListProps) {
  if (!missions.length) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="p-6 text-sm text-text-muted">
          No missions yet. Create your first mission to get started.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {missions.map((m) => (
            <Link
              key={m.id}
              href={`/missions/${m.id}`}
              className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-muted/40"
            >
              <div>
                <p className="font-medium text-text-primary">{m.name}</p>
                <p className="text-xs text-text-muted">
                  {m.siteCode} · Pattern: {m.config.pathPattern.toLowerCase()} ·{" "}
                  Alt: {m.config.altitudeMeters}m
                </p>
              </div>
              <MissionStatusBadge status={m.status} />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
