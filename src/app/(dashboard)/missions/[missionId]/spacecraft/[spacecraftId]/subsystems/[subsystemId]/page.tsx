"use client";

import { ArrowLeft, Plus, Zap, Activity } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function SubsystemTelemetryPage() {
  const params = useParams();
  const { missionId, spacecraftId, subsystemId } = params;

  const handleInitChannels = () => {
    toast.success("Standard telemetry channels initialized!");
  };

  // Mock channels
  const channels = [
    { id: 1, name: "v_batt", unit: "V", datatype: "Float", rate: "1", min: "11.0", max: "12.6", desc: "Main battery voltage" },
    { id: 2, name: "i_load", unit: "A", datatype: "Float", rate: "5", min: "0", max: "3.5", desc: "Total payload current draw" },
    { id: 3, name: "soc", unit: "%", datatype: "Int", rate: "0.1", min: "20", max: "100", desc: "State of Charge" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <Link href={`/missions/${missionId}/spacecraft/${spacecraftId}`} className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Subsystems
      </Link>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <Zap className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight uppercase">{subsystemId} Subsystem</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-slate-400">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Nominal Status</span>
              <span>•</span>
              <span>Electrical Power System</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleInitChannels} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors">
            Init Default Channels
          </button>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Channel
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-slate-400" />
          Telemetry Channels
        </h2>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-950/50 text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Unit</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Rate (Hz)</th>
                  <th className="px-6 py-4 font-medium">Thresholds (Min/Max)</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {channels.map((ch) => (
                  <tr key={ch.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-white font-mono">{ch.name}</td>
                    <td className="px-6 py-4 text-slate-400">{ch.unit}</td>
                    <td className="px-6 py-4 text-slate-400">{ch.datatype}</td>
                    <td className="px-6 py-4 text-slate-400">{ch.rate}</td>
                    <td className="px-6 py-4 text-slate-400">{ch.min} / {ch.max}</td>
                    <td className="px-6 py-4 text-slate-400">{ch.desc}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-400 hover:text-indigo-300 text-xs font-medium">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
