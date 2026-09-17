"use client";

import { Rocket, Satellite, Activity, Layers, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function DashboardOverviewPage() {
  const handleSeedMission = () => {
    toast.info("Seeding RVCE Reference Mission...");
    // Future: call Convex mutation to seed data
  };

  const handleCreateMission = () => {
    toast.info("Create Mission Dialog triggered");
    // Future: Open dialog
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Mission Control Overview</h1>
          <p className="text-slate-400 mt-1">RVCE Spacecraft Health Platform</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSeedMission}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-sm font-medium rounded-lg transition-colors"
          >
            Seed RVCE Reference Mission
          </button>
          <button 
            onClick={handleCreateMission}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Mission
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Missions", value: "2", icon: Rocket, color: "text-indigo-400" },
          { label: "Total Spacecraft", value: "4", icon: Satellite, color: "text-cyan-400" },
          { label: "Registered Subsystems", value: "24", icon: Layers, color: "text-emerald-400" },
          { label: "Monitored Telemetry", value: "128", icon: Activity, color: "text-amber-400" },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/50 mb-4">
              <p className="text-sm font-medium text-slate-400">{stat.label}</p>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-indigo-950/30 border border-indigo-900/50 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">REFERENCE</span>
            <h3 className="text-lg font-semibold text-white">RVCE CubeSat-01 / COSMOS-SAT-01</h3>
          </div>
          <p className="text-slate-400 text-sm">Primary reference mission for testing and telemetry simulation.</p>
        </div>
        <Link 
          href="/missions/rvce-01" 
          className="mt-4 md:mt-0 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white text-sm font-medium rounded-lg transition-colors"
        >
          View Mission Details
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-white">Real-time Subsystem Health</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {["EPS", "ADCS", "OBC", "COMM", "PAYLOAD", "THERMAL"].map((sys) => (
              <div key={sys} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                <span className="font-medium text-slate-300">{sys}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Mission Log Feed</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 min-h-[250px]">
            <div className="space-y-4">
              <div className="flex gap-3 text-sm">
                <span className="text-slate-500 font-mono">10:42:01</span>
                <span className="text-slate-300">Telemetry sync completed for COSMOS-SAT-01</span>
              </div>
              <div className="flex gap-3 text-sm">
                <span className="text-slate-500 font-mono">10:40:15</span>
                <span className="text-emerald-400">EPS battery charge nominal at 98%</span>
              </div>
              <div className="flex gap-3 text-sm">
                <span className="text-slate-500 font-mono">10:35:22</span>
                <span className="text-amber-400">THERMAL warning: T_Radiator high</span>
              </div>
              <div className="flex gap-3 text-sm">
                <span className="text-slate-500 font-mono">10:30:00</span>
                <span className="text-slate-300">Operator login successful</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
