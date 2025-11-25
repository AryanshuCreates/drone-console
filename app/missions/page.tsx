import Link from "next/link";
import { fetchMissions } from "@/lib/client-api";
import { MissionList } from "@/components/missions/mission-list";
import { Button } from "@/components/ui/button";
import { Map as MapIcon } from "lucide-react";

export default async function MissionsPage() {
  const missions = await fetchMissions();

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Missions</h1>
          <p className="text-sm text-slate-500">
            Plan, schedule, and supervise autonomous survey missions.
          </p>
        </div>

        {/* Button wrapping Link using asChild */}
        <Button asChild size="sm" className="justify-center gap-2">
          <Link href="/missions/new">
            <MapIcon className="h-4 w-4" />
            <span>Plan new mission</span>
          </Link>
        </Button>
      </header>

      <MissionList missions={missions} />
    </div>
  );
}
