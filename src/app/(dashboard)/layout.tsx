"use client";

import React, { ReactNode } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { NavUser } from "@/components/sidebar/nav-user";
import { Satellite, Radio } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Operational Header */}
        <header className="h-14 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Satellite className="h-4 w-4 text-blue-400" />
              <span>RVCE Mission Control Center</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>SIMULATED TELEMETRY ACTIVE</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md font-mono">
              <Radio className="h-3.5 w-3.5 text-blue-400" />
              <span>UHF: 437.425 MHz</span>
            </div>
            <NavUser />
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}
