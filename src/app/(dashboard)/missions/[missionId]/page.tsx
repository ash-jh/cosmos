"use client";

import { ArrowLeft, Plus, Satellite, Activity } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
// import { useQuery } from "convex/react";
// import { api } from "../../../../convex/_generated/api";

export default function MissionOverviewPage() {
  const params = useParams();
  const missionId = params.missionId as string;
  
  // Mock data
  const mission = { _id: missionId, name: "RVCE CubeSat-01", type: "Low Earth Orbit", status: "Active", description: "Primary earth observation cubesat.", createdAt: "2024-01-15T00:00:00Z" };
  const spacecraftList = [
    { _id: "sc1", name: "COSMOS-SAT-01", noradId: "40001", status: "Operational" }
  ];

  if (!mission) return <div className="p-8 animate-pulse text-slate-500">Loading mission...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <Link href="/missions" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Missions
      </Link>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">{mission.name}</h1>
            <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {mission.status}
            </span>
          </div>
          <p className="text-slate-400 max-w-2xl">{mission.description}</p>
          <div className="flex gap-4 mt-4 text-sm text-slate-500">
            <span>Type: {mission.type}</span>
            <span>Created: {new Date(mission.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Spacecraft Fleet</h2>
          <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Register Spacecraft
          </button>
        </div>

        {spacecraftList.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-xl">
            <p className="text-slate-400">No spacecraft registered for this mission yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spacecraftList.map(sc => (
              <Link href={`/missions/${missionId}/spacecraft/${sc._id}`} key={sc._id} className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl p-6 transition-all block">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <Satellite className="w-6 h-6 text-indigo-400" />
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {sc.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{sc.name}</h3>
                <p className="text-sm text-slate-500 mb-4">NORAD ID: {sc.noradId}</p>
                <div className="flex items-center gap-2 text-sm text-indigo-400 font-medium">
                  <Activity className="w-4 h-4" />
                  View Telemetry & Subsystems
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
