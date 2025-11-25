import { cn } from "@/lib/utils";

type DroneStatus = "AVAILABLE" | "IN_MISSION" | "CHARGING" | "MAINTENANCE";

const statusStyles: Record<DroneStatus, string> = {
  AVAILABLE: "bg-accent/15 text-accent-foreground border border-accent/40",
  IN_MISSION: "bg-primary/15 text-primary-foreground border border-primary/40",
  CHARGING:
    "bg-secondary/15 text-secondary-foreground border border-secondary/40",
  MAINTENANCE:
    "bg-destructive/15 text-destructive border border-destructive/40",
};

export function DroneStatusPill({ status }: { status: DroneStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        statusStyles[status]
      )}
    >
      {status.toLowerCase().replace("_", " ")}
    </span>
  );
}
