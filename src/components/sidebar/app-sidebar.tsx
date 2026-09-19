"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Rocket,
  Satellite,
  Activity,
  AlertTriangle,
  BrainCircuit,
  Zap,
  Cpu,
  BarChart3,
  LayoutDashboard,
  ShieldCheck,
  SearchCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    title: "Mission Overview",
    href: "/",
    icon: LayoutDashboard,
    phase: "P0",
    active: true,
  },
  {
    title: "Missions Directory",
    href: "/missions",
    icon: Rocket,
    phase: "P0",
    active: true,
  },
  {
    title: "Live Telemetry",
    href: "/telemetry",
    icon: Activity,
    phase: "P1",
    active: true,
  },
  {
    title: "Anomaly Center",
    href: "/anomalies",
    icon: AlertTriangle,
    phase: "P4",
    active: true,
  },
  {
    title: "Root Cause (RCA)",
    href: "/rca",
    icon: SearchCheck,
    phase: "P6",
    active: true,
  },
  {
    title: "Digital Twin & Faults",
    href: "/digital-twin",
    icon: Cpu,
    phase: "P2-P3",
    active: true,
  },
  {
    title: "Edge & ML Models",
    href: "/models",
    icon: BarChart3,
    phase: "P5",
    active: true,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold shadow-sm">
          <Satellite className="h-5 w-5" />
        </div>
        <div>
          <div className="font-bold text-slate-100 tracking-wider text-sm flex items-center gap-1.5">
            COSMOS <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded font-mono border border-blue-500/20">Phase I</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">RVCE Ground Control</p>
        </div>
      </div>

      {/* Organization Badge */}
      <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-200">RVCE Space Club</span>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono">NOMINAL</span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
          Mission Operations
        </div>
        {NAV_ITEMS.map((item) => {
          const isSelected =
            pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all",
                isSelected
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold shadow-sm"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={cn("h-4 w-4", isSelected ? "text-blue-400" : "text-slate-400")} />
                <span>{item.title}</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                {item.phase}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex flex-col gap-1.5 bg-slate-950/80">
        <div className="flex justify-between">
          <span>Deployment:</span>
          <span className="text-slate-200 font-semibold">RVCE CubeSat-01</span>
        </div>
        <div className="flex justify-between">
          <span>Spacecraft:</span>
          <span className="text-slate-200 font-semibold">COSMOS-SAT-01</span>
        </div>
        <div className="flex justify-between items-center pt-1 border-t border-slate-900">
          <span>Telemetry Stream:</span>
          <span className="flex items-center gap-1 text-emerald-400 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        </div>
      </div>
    </aside>
  );
}
