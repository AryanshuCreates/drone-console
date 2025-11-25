"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map as MapIcon,
  Crosshair,
  BarChart3,
  Cpu,
  ChevronRight,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/",
    id: "overview",
    label: "Overview & Fleet",
    icon: LayoutDashboard,
  },
  {
    href: "/missions",
    id: "missions",
    label: "Missions",
    icon: MapIcon,
  },
  {
    href: "/fleet",
    id: "fleet",
    label: "Fleet",
    icon: Crosshair,
  },
  {
    href: "/reports",
    id: "reports",
    label: "Survey Reports",
    icon: BarChart3,
  },
];

interface ConsoleShellProps {
  children: ReactNode;
}

export function ConsoleShell({ children }: ConsoleShellProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shadow-xl z-10">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800 bg-slate-900">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-900/20">
            <Cpu className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg tracking-tight leading-tight">
              AeroCommand
            </h1>
            <p className="text-[10px] font-medium text-indigo-400 uppercase tracking-widest">
              Drone Ops Console
            </p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative",
                  active
                    ? "bg-indigo-600 text-white shadow-md"
                    : "hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon
                  size={20}
                  className={
                    active
                      ? "text-indigo-100"
                      : "text-slate-500 group-hover:text-slate-300"
                  }
                />
                <span className="font-medium text-sm">{item.label}</span>
                {active && (
                  <ChevronRight
                    size={16}
                    className="absolute right-3 text-indigo-200"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-800 rounded-lg border border-slate-700">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">
              OP
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                Operator
              </p>
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </p>
            </div>
            <Settings
              size={16}
              className="text-slate-500 hover:text-white cursor-pointer"
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden bg-slate-50/50">
        <div className="max-w-7xl mx-auto p-8 h-full">
          <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
