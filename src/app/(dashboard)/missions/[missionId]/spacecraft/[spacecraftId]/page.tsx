"use client";

import { ArrowLeft, Settings, Cpu, Radio, Zap, Navigation, Thermometer, Shield } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function SpacecraftSubsystemsPage() {
  const params = useParams();
  const missionId = params.missionId as string;
  const spacecraftId = params.spacecraftId as string;

  const handleInitSubsystems = () => {
    toast.success("Standard subsystems initialized!");
    // Future: Convex mutation api.subsystems.createDefaults
  };

  const subsystems = [
    { id: "eps", name: "Electrical Power System", acro: "EPS", icon: Zap, status: "Nominal" },
    { id: "adcs", name: "Attitude Determination & Control", acro: "ADCS", icon: Navigation, status: "Nominal" },
    { id: "obc", name: "On-Board Computer", acro: "OBC", icon: Cpu, status: "Nominal" },
    { id: "comm", name: "Communications", acro: "COMM", icon: Radio, status: "Nominal" },
    { id: "payload", name: "Mission Payload", acro: "PAYLOAD", icon: Shield, status: "Nominal" },
    { id: "thermal", name: "Thermal Control", acro: "THERMAL", icon: Thermometer, status: "Warning" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <Link href={`/missions/${missionId}`} className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Mission Overview
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-800 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">COSMOS-SAT-01</h1>
          <p className="text-slate-400 mt-2">Spacecraft Subsystems & Health Monitoring</p>
        </div>
        <button 
          onClick={handleInitSubsystems}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Initialize Standard Subsystems
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subsystems.map(sys => (
          <Link 
            href={`/missions/${missionId}/spacecraft/${spacecraftId}/subsystems/${sys.id}`} 
            key={sys.id}
            className="group bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-6 transition-all block relative overflow-hidden"
          >
            <div className={`absolute top-0 left-0 w-1 h-full ${sys.status === 'Nominal' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <div className="flex justify-between items-start mb-6">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 group-hover:border-indigo-500/30 transition-colors">
                <sys.icon className="w-6 h-6 text-indigo-400" />
              </div>
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${sys.status === 'Nominal' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                {sys.status}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-500 tracking-wider">{sys.acro}</span>
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">{sys.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
