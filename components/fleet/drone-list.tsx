import { Drone } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { DroneStatusPill } from "./drone-status-pill";

interface DroneListProps {
  drones: Drone[];
}

export function DroneList({ drones }: DroneListProps) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-0">
        <table className="min-w-full text-xs">
          <thead className="bg-muted/40 text-[11px] uppercase tracking-wide text-text-muted">
            <tr>
              <th className="px-4 py-2 text-left">Drone</th>
              <th className="px-4 py-2 text-left">Site</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Battery</th>
              <th className="px-4 py-2 text-left">Last heartbeat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {drones.map((d) => (
              <tr key={d.id} className="hover:bg-muted/30">
                <td className="px-4 py-2">
                  <p className="text-sm font-medium text-text-primary">
                    {d.name}
                  </p>
                  <p className="text-[11px] text-text-muted">{d.model}</p>
                </td>
                <td className="px-4 py-2 text-xs text-text-secondary">
                  {d.siteCode}
                </td>
                <td className="px-4 py-2">
                  <DroneStatusPill status={d.status} />
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 rounded-full bg-muted">
                      <div
                        className="h-1.5 rounded-full bg-accent"
                        style={{ width: `${d.batteryLevel}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-text-secondary">
                      {d.batteryLevel}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2 text-[11px] text-text-muted">
                  {new Date(d.lastHeartbeatAt).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
