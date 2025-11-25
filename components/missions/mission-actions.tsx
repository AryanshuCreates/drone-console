"use client";

import { useTransition } from "react";
import { Mission } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface MissionActionsProps {
  mission: Mission;
}

export function MissionActions({ mission }: MissionActionsProps) {
  const [isPending, startTransition] = useTransition();

  const updateStatus = (status: Mission["status"]) => {
    startTransition(async () => {
      await fetch(`/api/missions/${mission.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }).catch(console.error);
      // You can add a revalidate or use client state here
    });
  };

  const canPause = mission.status === "IN_PROGRESS";
  const canResume = mission.status === "PAUSED";
  const canAbort = ["IN_PROGRESS", "PAUSED", "STARTING"].includes(
    mission.status
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canPause && (
        <Button
          variant="soft"
          size="sm"
          disabled={isPending}
          onClick={() => updateStatus("PAUSED")}
        >
          Pause
        </Button>
      )}
      {canResume && (
        <Button
          variant="primary"
          size="sm"
          disabled={isPending}
          onClick={() => updateStatus("IN_PROGRESS")}
        >
          Resume
        </Button>
      )}
      {canAbort && (
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => updateStatus("ABORTED")}
        >
          Abort
        </Button>
      )}
    </div>
  );
}
