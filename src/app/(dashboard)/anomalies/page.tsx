"use client";

import { useState } from "react";
import {
  AlertTriangle,
  AlertOctagon,
  BrainCircuit,
  SearchCheck,
  ShieldCheck,
  Filter,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { toast } from "sonner";

export default function AnomalyCenterPage() {
  const anomaliesFromDb = useQuery(api.anomalies.list, {});
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  // Fallback demo incidents if database has not recorded incidents yet
  const demoIncidents = [
    {
      id: "INC-2026-0814",
      timestamp: "Today, 17:42:31 UTC",
      model: "COSMOS-TCN-Edge (v2.1)",
      score: 0.94,
      threshold: 0.75,
      severity: "critical",
      subsystem: "EPS",
      affectedChannels: ["battery_voltage", "battery_current", "battery_temperature", "bus_voltage"],
      status: "detected",
    },
    {
      id: "INC-2026-0812",
      timestamp: "Today, 14:15:10 UTC",
      model: "COSMOS-LSTM-Autoencoder",
      score: 0.79,
      threshold: 0.70,
      severity: "warning",
      subsystem: "THERMAL",
      affectedChannels: ["battery_temperature", "payload_temperature"],
      status: "investigating",
    },
    {
      id: "INC-2026-0809",
      timestamp: "Yesterday, 22:30:04 UTC",
      model: "Statistical EWMA Baseline",
      score: 0.82,
      threshold: 0.70,
      severity: "warning",
      subsystem: "OBC",
      affectedChannels: ["cpu_utilization", "cpu_temperature"],
      status: "resolved",
    },
    {
      id: "INC-2026-0801",
      timestamp: "Sep 15, 08:12:44 UTC",
      model: "COSMOS-TCN-Edge (v2.1)",
      score: 0.88,
      threshold: 0.75,
      severity: "critical",
      subsystem: "ADCS",
      affectedChannels: ["reaction_wheel_speed", "attitude_error"],
      status: "resolved",
    },
  ];

  const incidents = demoIncidents.filter((inc) => {
    if (filterSeverity === "all") return true;
    return inc.severity === filterSeverity;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3" />
              DETECTION PIPELINE (P4)
            </span>
            <span className="text-xs text-slate-500 font-mono">Temporal ML + Statistical Ensembles</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Anomaly Detection Center</h1>
          <p className="text-slate-400 text-sm mt-1">Autonomous Telemetry Outlier Identification & Multi-Channel Incidents</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/rca"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20"
          >
            <SearchCheck className="w-3.5 h-3.5" />
            Launch RCA Diagnostic Desk
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
          <span className="text-xs text-slate-400 uppercase tracking-wider">Active Critical Incidents</span>
          <div className="text-2xl font-bold text-red-400 mt-1 font-mono">1 Active</div>
          <span className="text-[11px] text-slate-500">Requires operator review</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
          <span className="text-xs text-slate-400 uppercase tracking-wider">Mean Anomaly Score</span>
          <div className="text-2xl font-bold text-amber-400 mt-1 font-mono">0.858</div>
          <span className="text-[11px] text-slate-500">Threshold: 0.750</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
          <span className="text-xs text-slate-400 uppercase tracking-wider">Inference Model</span>
          <div className="text-2xl font-bold text-blue-400 mt-1 font-mono">COSMOS-TCN-Edge</div>
          <span className="text-[11px] text-slate-500">INT8 Quantized • 2.1 ms</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
          <span className="text-xs text-slate-400 uppercase tracking-wider">Resolved Rate</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">75.0 %</div>
          <span className="text-[11px] text-slate-500">Validated by human operator</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4 bg-slate-900/40 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter Severity:</span>
          <div className="flex gap-1.5 ml-2">
            {(["all", "critical", "warning"] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1 rounded text-xs font-mono uppercase transition-colors ${
                  filterSeverity === sev
                    ? "bg-slate-800 text-white font-semibold border border-slate-700"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-slate-500 font-mono">Showing {incidents.length} incidents</span>
      </div>

      {/* Anomaly Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Incident ID</th>
                <th className="px-6 py-3.5">Timestamp (UTC)</th>
                <th className="px-6 py-3.5">Subsystem</th>
                <th className="px-6 py-3.5">Score / Threshold</th>
                <th className="px-6 py-3.5">Severity</th>
                <th className="px-6 py-3.5">Affected Telemetry Channels</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {incidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                    {inc.severity === "critical" ? (
                      <AlertOctagon className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    )}
                    {inc.id}
                  </td>
                  <td className="px-6 py-4 text-slate-400">{inc.timestamp}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                      {inc.subsystem}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-red-400 font-bold">{inc.score.toFixed(2)}</span>
                    <span className="text-slate-500"> / {inc.threshold.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        inc.severity === "critical"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    <div className="flex gap-1.5 flex-wrap max-w-xs">
                      {inc.affectedChannels.map((ch) => (
                        <span key={ch} className="px-1.5 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400 border border-slate-800">
                          {ch}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                        inc.status === "detected"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse"
                          : inc.status === "investigating"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {inc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href="/rca"
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 rounded text-xs transition-colors inline-flex items-center gap-1 font-sans font-medium"
                    >
                      <SearchCheck className="w-3 h-3" />
                      Investigate
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
