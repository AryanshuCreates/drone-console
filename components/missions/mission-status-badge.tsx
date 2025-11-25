import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MissionStatus } from "@/lib/types";

const statusStyles: Record<MissionStatus, string> = {
  PLANNED: "bg-muted text-text-secondary border border-border",
  SCHEDULED:
    "bg-secondary/15 text-secondary-foreground border border-secondary/40",
  STARTING: "bg-primary/15 text-primary-foreground border border-primary/50",
  IN_PROGRESS: "bg-primary/20 text-primary-foreground border border-primary/60",
  PAUSED: "bg-warning/15 text-warning border border-warning/40",
  COMPLETED: "bg-accent/15 text-accent-foreground border border-accent/40",
  ABORTED: "bg-destructive/15 text-destructive border border-destructive/40",
};

export function MissionStatusBadge({ status }: { status: MissionStatus }) {
  return (
    <Badge
      className={cn(
        "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        statusStyles[status]
      )}
    >
      {status.replace("_", " ").toLowerCase()}
    </Badge>
  );
}
