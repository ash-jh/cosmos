import Link from "next/link"
import { Home, Rocket, Activity, AlertTriangle, AlertOctagon, Zap, Shield, Database, LayoutDashboard } from "lucide-react"
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
    href: "#",
    icon: Activity,
    phase: "P1",
    active: false,
  },
  {
    title: "Alert Center",
    href: "#",
    icon: AlertTriangle,
    phase: "P7",
    active: false,
  },
  {
    title: "Anomaly Analysis",
    href: "#",
    icon: BrainCircuit,
    phase: "P4",
    active: false,
  },
  {
    title: "Fault Injection",
    href: "#",
    icon: Zap,
    phase: "P3",
    active: false,
  },
  {
    title: "Digital Twin",
    href: "#",
    icon: Cpu,
    phase: "P2",
    active: false,
  },
  {
    title: "Edge & ML Models",
    href: "#",
    icon: BarChart3,
    phase: "P5",
    active: false,
  },
];

export function AppSidebar() {
  const navItems = [
    { name: "Overview", href: "/", icon: Home },
    { name: "Missions", href: "/missions", icon: Rocket },
    { name: "Spacecraft", href: "/spacecraft", icon: Database },
    { name: "Telemetry", href: "/telemetry", icon: Activity },
    { name: "Alerts", href: "/alerts", icon: AlertTriangle },
    { name: "Anomalies", href: "/anomalies", icon: AlertOctagon },
    { name: "Fault Injection", href: "/fault-injection", icon: Zap, disabled: true },
    { name: "Digital Twin", href: "/digital-twin", icon: LayoutDashboard, disabled: true },
    { name: "Models", href: "/models", icon: Shield, disabled: true },
  ]
  const pathname = usePathname();

  return (
    <div className="w-64 border-r h-screen flex flex-col bg-slate-50">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold">COSMOS</h2>
        <p className="text-sm text-gray-500">Mission Operations</p>
    <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold shadow-sm">
          <Satellite className="h-5 w-5" />
        </div>
        <div>
          <div className="font-bold text-slate-100 tracking-wider text-sm flex items-center gap-1.5">
            COSMOS <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded font-mono border border-blue-500/20">v1.0</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">RVCE Ground Control</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.disabled ? "#" : item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              item.disabled ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-slate-200 hover:text-slate-900"
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.name}
            {item.disabled && (
              <span className="ml-auto text-[10px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded">P1-P8</span>
            )}
          </Link>
        ))}

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
          const isSelected = item.active && (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)));
          const Icon = item.icon;

          if (!item.active) {
            return (
              <div
                key={item.title}
                className="flex items-center justify-between px-3 py-2 rounded-md text-xs text-slate-400 opacity-60 cursor-not-allowed group"
                title={`Planned for Phase ${item.phase}`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-slate-500" />
                  <span>{item.title}</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                  {item.phase}
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors",
                isSelected
                  ? "bg-blue-600/15 text-blue-400 border border-blue-500/20 font-semibold"
                  : "text-slate-300 hover:bg-slate-900 hover:text-slate-100"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={cn("h-4 w-4", isSelected ? "text-blue-400" : "text-slate-400")} />
                <span>{item.title}</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                ACTIVE
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  )

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex flex-col gap-1 bg-slate-950">
        <div className="flex justify-between">
          <span>Deployment:</span>
          <span className="text-slate-200 font-semibold">RVCE CubeSat-01</span>
        </div>
        <div className="flex justify-between">
          <span>Spacecraft:</span>
          <span className="text-slate-200 font-semibold">COSMOS-SAT-01</span>
        </div>
      </div>
    </aside>
  );
}
