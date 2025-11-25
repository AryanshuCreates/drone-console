import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
}

export function StatCard({ label, value, subtitle }: StatCardProps) {
  return (
    <Card className="border-border bg-card shadow-soft">
      <CardContent className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
          {label}
        </p>
        <p className="mt-2 text-2xl font-semibold text-text-primary">{value}</p>
        {subtitle && (
          <p className="mt-1 text-xs text-text-secondary">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
