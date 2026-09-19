"use client";

import { useState, useEffect } from "react";
import { Rocket, Satellite, Activity, Layers, AlertTriangle, ShieldCheck, Zap, Cpu, Radio, Thermometer, Shield } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export default function DashboardOverviewPage() {
  const seedMission = useMutation(api.seed.seedReferenceMission);
  const models = useQuery(api.models.list);
  const [seeding, setSeeding] = useState(false);
  const [simActive, setSimActive] = useState(true);
  const [clock, setClock] = useState(new Date().toISOString());

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date().toISOString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSeedMission = async () => {
    try {
      setSeeding(true);
      await seedMission();
      toast.success("RVCE CubeSat-01 & COSMOS-SAT-01 initialized with standard telemetry schemas!");
    } catch (e: any) {
      toast.error(e?.message || "Failed to seed reference mission");
    } finally {
      setSeeding(false);
    }
  };

  const subsystems = [
    { name: "Electrical Power System", acro: "EPS", icon: Zap, status: "Nominal", value: "7.84 V / 1.42 A", color: "text-emerald-400" },
    { name: "Thermal Control", acro: "THERMAL", icon: Thermometer, status: "Nominal", value: "24.5 °C (Chassis)", color: "text-emerald-400" },
    { name: "On-Board Computer", acro: "OBC", icon: Cpu, status: "Nominal", value: "28.5% CPU / 38.6 °C", color: "text-emerald-400" },
    { name: "Attitude Control", acro: "ADCS", icon: Activity, status: "Nominal", value: "1.15° Error / 1840 RPM", color: "text-emerald-400" },
    { name: "Communications", acro: "COMM", icon: Radio, status: "Nominal", value: "-76.4 dBm / 1.2% Loss", color: "text-emerald-400" },
    { name: "Mission Payload", acro: "PAYLOAD", icon: Shield, status: "Nominal", value: "4.8 W / Active", color: "text-emerald-400" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Flight Operations
            </span>
            <span className="text-xs text-slate-500 font-mono">UTC {clock.slice(11, 19)}</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Mission Control Center</h1>
          <p className="text-slate-400 text-sm mt-1">RVCE CubeSat-01 • COSMOS-SAT-01 Telemetry & Autonomous Health</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSeedMission}
            disabled={seeding}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            {seeding ? "Seeding RVCE Mission..." : "Seed RVCE Reference Mission"}
          </button>

          <Link
            href="/digital-twin"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20"
          >
            <Zap className="w-3.5 h-3.5" />
            Inject Fault / Digital Twin
          </Link>
        </div>
      </div>

      {/* Operational Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Spacecraft", value: "COSMOS-SAT-01", sub: "LEO 525 km • Polar Orbit", icon: Satellite, color: "text-blue-400" },
          { label: "Overall Health", value: "NOMINAL", sub: "6 of 6 Subsystems Healthy", icon: ShieldCheck, color: "text-emerald-400" },
          { label: "Active Telemetry Channels", value: "24 Channels", sub: "1.0 Hz Ingestion Loop", icon: Activity, color: "text-cyan-400" },
          { label: "Edge Inference Runtime", value: "ONNX / TCN-INT8", sub: "Latency 2.1 ms • RAM 210 KB", icon: Cpu, color: "text-indigo-400" },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-xl shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-3">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-xl font-bold text-white tracking-tight">{stat.value}</p>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Subsystem Health Matrix */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            Subsystem Health Telemetry Matrix
          </h2>
          <Link href="/telemetry" className="text-xs font-medium text-blue-400 hover:text-blue-300">
            Open Full Telemetry Stream →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subsystems.map((sys) => {
            const Icon = sys.icon;
            return (
              <div
                key={sys.acro}
                className="bg-slate-900/70 border border-slate-800/80 hover:border-blue-500/40 p-5 rounded-xl transition-all relative overflow-hidden group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-blue-400 group-hover:border-blue-500/30 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider font-bold">
                        {sys.acro}
                      </span>
                      <h3 className="text-sm font-semibold text-white">{sys.name}</h3>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    {sys.status}
                  </span>
                </div>

                <div className="text-xs font-mono text-slate-400 flex items-center justify-between pt-3 border-t border-slate-800/50">
                  <span>Current State:</span>
                  <span className="text-slate-200 font-semibold">{sys.value}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Realtime Event Log & Quick Jump */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Live Telemetry Ingestion Activity
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Canonical Packet Rate: 1.0 Hz</span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between p-2.5 rounded bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">[EPS] V_batt: 7.82 V | I_batt: 1.45 A | V_bus: 7.74 V</span>
              <span className="text-emerald-400">NOMINAL (z-score: 0.12)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">[OBC] CPU: 28.5% | Mem: 42.1% | T_cpu: 38.6 °C</span>
              <span className="text-emerald-400">NOMINAL (z-score: 0.08)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">[ADCS] Att_err: 1.15° | RW_speed: 1840 RPM</span>
              <span className="text-emerald-400">NOMINAL (z-score: 0.21)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">[COMM] RSSI: -76.4 dBm | PktLoss: 1.2%</span>
              <span className="text-emerald-400">NOMINAL (z-score: 0.04)</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Mission Diagnostic Status
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
              <div className="font-semibold mb-1">0 Active Anomalies</div>
              <p className="text-[11px] text-emerald-400/80">
                All multivariate telemetry channels within adaptive $3\sigma$ bounds.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 space-y-2">
              <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Fast Navigation</div>
              <div className="flex flex-col gap-1.5">
                <Link href="/telemetry" className="text-blue-400 hover:underline">→ Live Multi-Channel Plots</Link>
                <Link href="/anomalies" className="text-blue-400 hover:underline">→ Anomaly Detection Desk</Link>
                <Link href="/rca" className="text-blue-400 hover:underline">→ Root Cause Correlation Graph</Link>
                <Link href="/digital-twin" className="text-blue-400 hover:underline">→ Fault Injection & Recovery Twin</Link>
                <Link href="/models" className="text-blue-400 hover:underline">→ Edge Model Benchmarks</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
