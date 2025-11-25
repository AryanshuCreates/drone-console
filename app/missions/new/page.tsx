import { MissionForm } from "@/components/missions/mission-form";

export default function NewMissionPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Plan new mission</h1>
        <p className="text-sm text-slate-500">
          Configure flight pattern, altitude, and survey parameters for a site.
        </p>
      </header>
      <MissionForm />
    </div>
  );
}
