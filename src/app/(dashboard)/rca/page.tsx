"use client";

import { useState } from "react";
import {
  SearchCheck,
  AlertOctagon,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  GitFork,
  ArrowDown,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function RootCauseAnalysisPage() {
  const [activeTab, setActiveTab] = useState<"findings" | "evidence" | "topology">("findings");

  const incident = {
    id: "INC-2026-0814",
    timestamp: "2026-09-19T17:42:31Z (3 minutes ago)",
    spacecraft: "COSMOS-SAT-01",
    subsystem: "Electrical Power System (EPS)",
    candidateCause: "Battery Cell Degradation / Internal Resistance Increase",
    confidence: 0.94,
    severity: "Critical",
    status: "Pending Operator Review",
  };

  const correlatedChannels = [
    { name: "battery_voltage", currentVal: "6.72 V", nominalVal: "7.84 V", score: 0.94, impact: "Severe Negative Deviation", status: "Critical" },
    { name: "battery_current", currentVal: "2.84 A", nominalVal: "1.42 A", score: 0.87, impact: "High Load Draw", status: "Critical" },
    { name: "battery_temperature", currentVal: "41.8 °C", nominalVal: "24.5 °C", score: 0.81, impact: "Ohmic Overheating", status: "Warning" },
    { name: "bus_voltage", currentVal: "6.55 V", nominalVal: "7.74 V", score: 0.72, impact: "Bus Sag / Brownout Risk", status: "Warning" },
    { name: "cpu_temperature", currentVal: "38.6 °C", nominalVal: "38.2 °C", score: 0.11, impact: "Unaffected", status: "Nominal" },
    { name: "reaction_wheel_speed", currentVal: "1840 RPM", nominalVal: "1840 RPM", score: 0.04, impact: "Unaffected", status: "Nominal" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              CORRELATION & ROOT CAUSE ENGINE (P6)
            </span>
            <span className="text-xs text-slate-500 font-mono">Incident {incident.id}</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Root Cause Diagnostic Desk</h1>
          <p className="text-slate-400 text-sm mt-1">Multi-Channel Anomaly Correlation, Topology Mapping & Candidate Cause</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/digital-twin"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20"
          >
            Test Recovery Action in Digital Twin
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Primary Investigation Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold font-mono uppercase">
                {incident.severity}
              </span>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Detected: {incident.timestamp}
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-500 tracking-wider uppercase font-mono">
                Primary Candidate Root Cause
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
                {incident.candidateCause}
              </h2>
              <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                Autonomous multi-channel correlation identified strong simultaneous degradation across 4 EPS channels.
                The acute battery voltage sag accompanied by current surge and battery temperature rise indicates cell degradation
                or excessive load dissipation leading to primary bus undervoltage.
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs text-slate-400">Model Confidence</span>
              <div className="text-3xl font-bold text-emerald-400 font-mono mt-1">
                {(incident.confidence * 100).toFixed(0)} %
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Based on subsystem graph correlation &amp; dynamic z-scores.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-900 text-xs font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Affected Subsystem:</span>
                <span className="text-slate-200 font-semibold">{incident.subsystem}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Spacecraft Target:</span>
                <span className="text-slate-200 font-semibold">{incident.spacecraft}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("findings")}
          className={`px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all ${
            activeTab === "findings"
              ? "bg-slate-800 text-white border border-slate-700"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Investigation Checklist
        </button>
        <button
          onClick={() => setActiveTab("evidence")}
          className={`px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all ${
            activeTab === "evidence"
              ? "bg-slate-800 text-white border border-slate-700"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Channel Evidence Matrix ({correlatedChannels.length})
        </button>
        <button
          onClick={() => setActiveTab("topology")}
          className={`px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all ${
            activeTab === "topology"
              ? "bg-slate-800 text-white border border-slate-700"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Failure Propagation Topology
        </button>
      </div>

      {/* Tab 1: Checklist */}
      {activeTab === "findings" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-white">Diagnostic Questions &amp; Answers</h3>
            <div className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 font-semibold">1. What changed?</span>
                <p className="text-slate-200 mt-1 font-mono">
                  Battery terminal voltage dropped from 7.84V to 6.72V (-14.3% under nominal).
                </p>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 font-semibold">2. When did it start?</span>
                <p className="text-slate-200 mt-1 font-mono">
                  17:42:31 UTC during orbital ingress; anomaly onset was abrupt (&lt; 4 seconds).
                </p>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 font-semibold">3. Which channels changed?</span>
                <p className="text-slate-200 mt-1 font-mono">
                  battery_voltage, battery_current, battery_temperature, bus_voltage.
                </p>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 font-semibold">4. Which subsystem is affected?</span>
                <p className="text-slate-200 mt-1 font-mono">
                  EPS (Electrical Power System) is the primary root fault origin.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Recommended Countermeasure</h3>
              <div className="mt-4 p-4 rounded-xl bg-blue-950/30 border border-blue-900/50 space-y-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 uppercase font-bold">
                  ACTION_EPS_LOAD_SHED
                </span>
                <h4 className="text-sm font-bold text-white">Shed Non-Essential Payload &amp; Transceiver Power</h4>
                <p className="text-xs text-slate-300">
                  Isolate mission payload and switch UHF transceiver into low-power beacon mode (reduce draw by 65%)
                  to allow battery cell voltage recovery above the 7.2V undervoltage threshold.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <Link
                href="/digital-twin"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Proceed to Digital Twin Validation →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Evidence */}
      {activeTab === "evidence" && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Telemetry Channel</th>
                <th className="px-6 py-3.5">Current Value</th>
                <th className="px-6 py-3.5">Nominal Baseline</th>
                <th className="px-6 py-3.5">Correlation Score</th>
                <th className="px-6 py-3.5">Physical Impact Observation</th>
                <th className="px-6 py-3.5">Health State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {correlatedChannels.map((ch) => (
                <tr key={ch.name} className="hover:bg-slate-800/30">
                  <td className="px-6 py-4 font-bold text-white">{ch.name}</td>
                  <td className="px-6 py-4 text-red-400 font-bold">{ch.currentVal}</td>
                  <td className="px-6 py-4 text-slate-400">{ch.nominalVal}</td>
                  <td className="px-6 py-4">
                    <span className="text-amber-400 font-bold">{ch.score.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{ch.impact}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ch.status === "Critical"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : ch.status === "Warning"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {ch.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Topology */}
      {activeTab === "topology" && (
        <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-xl space-y-6">
          <h3 className="text-sm font-semibold text-white">Subsystem Cascading Failure Graph</h3>
          <div className="flex flex-col items-center space-y-4 max-w-xl mx-auto font-mono text-xs">
            <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-center w-full shadow-lg shadow-red-950/50">
              <span className="text-[10px] text-red-400 uppercase font-bold">Root Failure Origin</span>
              <div className="text-sm font-bold text-white mt-1">EPS Battery Cell Internal Resistance Spike</div>
              <p className="text-[11px] text-slate-300 mt-1">V_batt droop (6.72V) &amp; Ohmic Heating (41.8°C)</p>
            </div>

            <ArrowDown className="w-5 h-5 text-red-400 animate-bounce" />

            <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-500/40 text-center w-full">
              <span className="text-[10px] text-amber-400 uppercase font-bold">Cascading Subsystem Impact</span>
              <div className="text-sm font-bold text-white mt-1">Main Regulated Bus Voltage Droop</div>
              <p className="text-[11px] text-slate-300 mt-1">V_bus sags to 6.55V (approaching 6.0V critical threshold)</p>
            </div>

            <ArrowDown className="w-5 h-5 text-amber-400" />

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center w-full">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Downstream Systems at Risk</span>
              <div className="text-sm font-bold text-slate-200 mt-1">OBC Brownout &amp; Flight Computer Watchdog Reset</div>
              <p className="text-[11px] text-slate-400 mt-1">Potential loss of attitude control if unaddressed</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

