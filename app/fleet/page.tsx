import { fetchDrones } from "@/lib/client-api";
import { DroneList } from "@/components/fleet/drone-list";

export default async function FleetPage() {
  const drones = await fetchDrones();

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Fleet Inventory</h1>
        <p className="text-sm text-slate-500">
          Organization-wide drone inventory, utilization, and health status.
        </p>
      </header>

      <DroneList drones={drones} />
    </div>
  );
}
