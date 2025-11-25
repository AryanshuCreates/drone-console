import type { ReactNode } from "react";
import "./globals.css";
import { ConsoleShell } from "@/components/layout/console-shell";

export const metadata = {
  title: "AeroCommand - Drone Survey Console",
  description: "Plan, monitor, and analyze autonomous drone surveys.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-background text-text-primary antialiased">
        <ConsoleShell>{children}</ConsoleShell>
      </body>
    </html>
  );
}
