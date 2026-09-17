"use client";

import { Plus, Search, Calendar } from "lucide-react";
import Link from "next/link";
// import { useQuery } from "convex/react";
// import { api } from "../../../convex/_generated/api";

export default function MissionsDirectoryPage() {
  // Mock data for now, replace with: const missions = useQuery(api.missions.list) || [];
  const missions = [
    { _id: "m1", name: "RVCE CubeSat-01", type: "Low Earth Orbit", status: "Active", description: "Primary earth observation cubesat.", createdAt: "2024-01-15T00:00:00Z" },
    { _id: "m2", name: "COSMOS-LUNAR", type: "Lunar Orbiter", status: "Planning", description: "Deep space observation and comms relay.", createdAt: "2024-05-20T00:00:00Z" }
  ];

  const isLoading = false; // missions === undefined

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Missions Directory</h1>
          <p className="text-slate-400 mt-1">Manage and monitor all organizational space missions.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 self-start md:self-auto">
          <Plus className="w-4 h-4" />
          Create Mission
        </button>
      </div>

      <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search missions..." 
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2">
          {["All", "Planning", "Active", "Completed"].map((tab) => (
            <button key={tab} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${tab === "All" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-900"}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-48 animate-pulse"></div>
          ))}
        </div>
      ) : missions.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-xl">
          <p className="text-slate-400">No missions found. Create your first mission to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map(mission => (
            <Link href={`/missions/${mission._id}`} key={mission._id} className="group bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl p-6 transition-all block">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">{mission.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{mission.type}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${mission.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                  {mission.status}
                </span>
              </div>
              <p className="text-sm text-slate-400 line-clamp-2 mb-6">{mission.description}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>Created {new Date(mission.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
