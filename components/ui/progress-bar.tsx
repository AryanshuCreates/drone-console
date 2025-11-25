interface ProgressBarProps {
  value: number; // 0–100
}

export function ProgressBar({ value }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="h-1.5 w-full rounded-full bg-muted">
      <div
        className="h-1.5 rounded-full bg-primary"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
