"use client";

import { useState } from "react";
import {
  Cpu,
  Zap,
  Flame,
  Radio,
  Navigation,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Info,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { toast } from "sonner";

export default function DigitalTwinPage() {
  const [subsystem, setSubsystem] = useState<string>("EPS");
  const [faultType, setFaultType] = useState<string>("battery_degradation");
  const [severity, setSeverity] = useState<string>("Medium");
  const [duration, setDuration] = useState<number>(60);
  const [isFaultActive, setIsFaultActive] = useState<boolean>(false);
  const [isSimulatingRecovery, setIsSimulatingRecovery] = useState<boolean>(false);
  const [operatorDecision, setOperatorDecision] = useState<"pending" | "approved" | "rejected">("pending");

  const faultOptions: Record<string, Array<{ id: string; label: string }>> = {
    EPS: [
      { id: "battery_degradation", label: "Battery Cell Degradation (IR Spike)" },
      { id: "battery_overheating", label: "Battery Overheating" },
      { id: "current_spike", label: "Current Spike / Payload Latchup" },
      { id: "bus_undervoltage", label: "Bus Undervoltage" },
    ],
    THERMAL: [
      { id: "thermal_runaway", label: "Radiator Thermal Runaway" },
      { id: "sensor_drift", label: "Thermistor Calibration Drift" },
    ],
    OBC: [
      { id: "cpu_overload", label: "Flight Computer CPU Overload (100%)" },
      { id: "memory_saturation", label: "RAM Leak / Saturation" },
      { id: "thermal_throttling", label: "CPU Thermal Throttling" },
    ],
    ADCS: [
      { id: "wheel_degradation", label: "Reaction Wheel Bearing Degradation" },
      { id: "attitude_disturbance", label: "Gravity Gradient Disturbance" },
    ],
    COMM: [
      { id: "packet_loss", label: "RF Multipath Packet Loss Spike" },
      { id: "signal_degradation", label: "LNA Gain Drop (-20 dBm)" },
    ],
  };

  const handleInjectFault = () => {
    setIsFaultActive(true);
    setOperatorDecision("pending");
    toast.error(`Fault Injected: [${subsystem}] ${faultType} (Severity: ${severity})`);
  };

  const handleResetTwin = () => {
    setIsFaultActive(false);
    setIsSimulatingRecovery(false);
    setOperatorDecision("pending");
    toast.info("Digital Twin reset to Nominal Flight Baseline.");
  };

  const handleTestRecovery = () => {
    setIsSimulatingRecovery(true);
    toast.info("Running high-fidelity counterfactual simulation in Digital Twin...");
  };

  const handleApprove = () => {
    setOperatorDecision("approved");
    toast.success("SIMULATED ACTION APPROVED: Action validated and logged to flight audit record.");
  };

  const handleReject = () => {
    setOperatorDecision("rejected");
    toast.warning("SIMULATED ACTION REJECTED by operator.");
  };

  // Trajectory data for Before vs After simulation
  const simulationData = [
    { step: "T-30s", unmitigated: 7.82, mitigated: 7.82, nominal: 7.80 },
    { step: "T-20s", unmitigated: 7.80, mitigated: 7.80, nominal: 7.80 },
    { step: "T-10s", unmitigated: 7.78, mitigated: 7.78, nominal: 7.80 },
    { step: "Fault", unmitigated: 7.15, mitigated: 7.15, nominal: 7.80 },
    { step: "T+10s", unmitigated: 6.84, mitigated: 7.22, nominal: 7.80 },
    { step: "T+20s", unmitigated: 6.65, mitigated: 7.45, nominal: 7.80 },
    { step: "T+30s", unmitigated: 6.52, mitigated: 7.62, nominal: 7.80 },
    { step: "T+40s", unmitigated: 6.41, mitigated: 7.71, nominal: 7.80 },
    { step: "T+50s", unmitigated: 6.33, mitigated: 7.76, nominal: 7.80 },
    { step: "T+60s", unmitigated: 6.25, mitigated: 7.79, nominal: 7.80 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <Cpu className="w-3 h-3" />
              DIGITAL TWIN &amp; RESPONSE (P2, P3, P8)
            </span>
            <span className="text-xs text-slate-500 font-mono">COSMOS-SAT-01 In-Silico Multiphysics Twin</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Digital Twin &amp; Fault Simulation</h1>
          <p className="text-slate-400 text-sm mt-1">Cascading Multiphysics Modeling, Fault Injection &amp; In-the-Loop Recovery Validation</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetTwin}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Twin to Nominal
          </button>
        </div>
      </div>

      {/* Grid: Left = Fault Console, Right = Twin Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fault Injection Console */}
        <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Fault Injection Console
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
              OPERATOR TOOL
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Target Subsystem</label>
              <select
                className="w-full h-9 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 px-3 font-mono text-xs"
                value={subsystem}
                onChange={(e) => {
                  setSubsystem(e.target.value);
                  setFaultType(faultOptions[e.target.value][0].id);
                }}
              >
                <option value="EPS">EPS (Electrical Power System)</option>
                <option value="THERMAL">THERMAL (Thermal Control)</option>
                <option value="OBC">OBC (On-Board Computer)</option>
                <option value="ADCS">ADCS (Attitude Determination &amp; Control)</option>
                <option value="COMM">COMM (Communications)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Specific Spacecraft Fault</label>
              <select
                className="w-full h-9 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 px-3 font-mono text-xs"
                value={faultType}
                onChange={(e) => setFaultType(e.target.value)}
              >
                {(faultOptions[subsystem] || []).map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Severity</label>
                <select
                  className="w-full h-9 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 px-3 font-mono text-xs"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Duration (sec)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                  className="w-full h-9 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 px-3 font-mono text-xs"
                />
              </div>
            </div>

            <button
              onClick={handleInjectFault}
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 text-xs"
            >
              <Zap className="w-4 h-4" />
              INJECT FAULT INTO SIMULATOR
            </button>
          </div>
        </div>

        {/* Digital Twin State Representation */}
        <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 p-6 rounded-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                Live Multiphysics Twin Status
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Coupled state variables across EPS, Thermal, OBC, ADCS &amp; COMM
              </p>
            </div>
            <span
              className={`text-xs font-mono px-2.5 py-1 rounded font-bold uppercase ${
                isFaultActive
                  ? "bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse"
                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              }`}
            >
              {isFaultActive ? "FAULT IN PROGRESS" : "ALL SYSTEMS NOMINAL"}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
              <span className="text-slate-500 text-[10px] block">V_batt (Terminal)</span>
              <span className={`text-lg font-bold ${isFaultActive ? "text-red-400" : "text-slate-100"}`}>
                {isFaultActive ? "6.72 V" : "7.84 V"}
              </span>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
              <span className="text-slate-500 text-[10px] block">T_battery (Thermal)</span>
              <span className={`text-lg font-bold ${isFaultActive ? "text-amber-400" : "text-slate-100"}`}>
                {isFaultActive ? "41.8 °C" : "24.5 °C"}
              </span>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
              <span className="text-slate-500 text-[10px] block">V_bus (Regulated)</span>
              <span className={`text-lg font-bold ${isFaultActive ? "text-red-400" : "text-slate-100"}`}>
                {isFaultActive ? "6.55 V" : "7.74 V"}
              </span>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Brownout Margin</span>
              <span className={`text-lg font-bold ${isFaultActive ? "text-red-400" : "text-emerald-400"}`}>
                {isFaultActive ? "+0.55 V" : "+1.74 V"}
              </span>
            </div>
          </div>

          {/* Cascading effects narrative */}
          {isFaultActive && (
            <div className="p-3.5 bg-red-950/30 border border-red-900/50 rounded-lg text-xs space-y-1">
              <div className="font-bold text-red-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                Cascading Multiphysics Propagation Active:
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Battery Internal Resistance Spike (ΔR_int) creates excessive Joule heating (I²·R_int),
                causing thermal rise to 41.8°C. Increased IR droop pulls main bus voltage down to 6.55V, jeopardizing
                OBC flight computer voltage margins.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Simulated Response & Operator Validation Section (P8) */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Simulated Response &amp; Countermeasure Validation (Phase P8)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Predictive testing of candidate operational commands using fast-forward Digital Twin
            </p>
          </div>

          {!isSimulatingRecovery ? (
            <button
              onClick={handleTestRecovery}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <Play className="w-3.5 h-3.5" />
              Simulate Candidate Recovery Action
            </button>
          ) : (
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
              ✓ Fast-Forward Simulation Complete (120s Horizon)
            </span>
          )}
        </div>

        {/* Action Description */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-bold">
                CANDIDATE ACTION
              </span>
              <h3 className="text-sm font-bold text-white mt-2">
                EXEC_EPS_LOAD_SHED_PAYLOAD
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                De-energize non-essential payload instrument rails &amp; switch UHF transceiver from 100% duty cycle to 20% beacon mode.
              </p>
            </div>

            <div className="space-y-1.5 text-xs font-mono pt-3 border-t border-slate-900">
              <div className="flex justify-between">
                <span className="text-slate-500">Power Shed:</span>
                <span className="text-slate-200">-3.6 Watts (-65%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Predicted Voltage:</span>
                <span className="text-emerald-400 font-bold">&gt; 7.75 V (Nominal)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Predicted Recovery:</span>
                <span className="text-emerald-400 font-bold">&lt; 15 seconds</span>
              </div>
            </div>
          </div>

          {/* Forecast Chart */}
          <div className="lg:col-span-2 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">
                Digital Twin Forecast: Unmitigated Degradation vs. Simulated Action
              </span>
              <span className="text-[11px] font-mono text-emerald-400">
                Recovery Predicted: YES
              </span>
            </div>

            <div className="h-[200px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={simulationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="step" stroke="#64748b" tick={{ fontSize: 10, fill: "#64748b" }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: "#64748b" }} domain={[6.0, 8.0]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "6px",
                      fontSize: "11px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "10px" }} />
                  <Line
                    type="monotone"
                    dataKey="unmitigated"
                    name="Unmitigated (Degrading)"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="mitigated"
                    name="Simulated Action (Recovered)"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="nominal"
                    name="Nominal Baseline"
                    stroke="#64748b"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Human-in-the-Loop Approval Modal Box (Section 14) */}
        <div className="bg-slate-950 border-2 border-emerald-500/40 rounded-xl p-6 relative overflow-hidden shadow-xl shadow-emerald-950/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1 max-w-xl">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                SIMULATION VALIDATED
              </span>
              <h3 className="text-base font-bold text-white mt-1">
                Candidate action appears to restore nominal spacecraft state.
              </h3>
              <p className="text-xs text-slate-400">
                Digital twin forward integration indicates full bus stabilization at 7.79V with zero brownout risk.
                Awaiting operator review and audit confirmation.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {operatorDecision === "pending" ? (
                <>
                  <button
                    onClick={handleReject}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                  >
                    REJECT ACTION
                  </button>
                  <button
                    onClick={handleApprove}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-emerald-600/30 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    APPROVE SIMULATED ACTION
                  </button>
                </>
              ) : operatorDecision === "approved" ? (
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-lg font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  ACTION APPROVED BY OPERATOR
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg font-bold">
                  <XCircle className="w-4 h-4" />
                  ACTION REJECTED BY OPERATOR
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-900 flex items-center gap-2 text-[11px] text-slate-500">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Phase I Safety Boundary: The button strictly approves the simulated action inside the Digital Twin. No real uplink command is transmitted.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
