"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Zap,
  Thermometer,
  Cpu,
  Radio,
  RefreshCw,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
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

type TelemetryPoint = {
  time: string;
  battery_voltage: number;
  battery_current: number;
  bus_voltage: number;
  battery_temperature: number;
  cpu_temperature: number;
  cpu_utilization: number;
  adcs_error: number;
  comm_rssi: number;
};

export default function LiveTelemetryPage() {
  const [data, setData] = useState<TelemetryPoint[]>([]);
  const [selectedSubsystem, setSelectedSubsystem] = useState<"EPS" | "THERMAL" | "OBC" | "ADCS" | "COMM">("EPS");
  const [isStreaming, setIsStreaming] = useState(true);

  // Physical simulation generator for live telemetry feed
  useEffect(() => {
    // Generate initial 25 points
    const initialPoints: TelemetryPoint[] = [];
    const now = Date.now();
    for (let i = 24; i >= 0; i--) {
      const t = new Date(now - i * 2000);
      const timeStr = t.toLocaleTimeString([], { hour12: false });
      initialPoints.push({
        time: timeStr,
        battery_voltage: +(7.8 + Math.sin(i * 0.2) * 0.05 + (Math.random() - 0.5) * 0.02).toFixed(2),
        battery_current: +(1.4 + (Math.random() - 0.5) * 0.08).toFixed(2),
        bus_voltage: +(7.7 + (Math.random() - 0.5) * 0.03).toFixed(2),
        battery_temperature: +(24.5 + Math.sin(i * 0.1) * 0.4).toFixed(1),
        cpu_temperature: +(38.2 + (Math.random() - 0.5) * 0.6).toFixed(1),
        cpu_utilization: +(28 + (Math.random() - 0.5) * 4).toFixed(0),
        adcs_error: +(1.1 + (Math.random() - 0.5) * 0.15).toFixed(2),
        comm_rssi: +(-76 + (Math.random() - 0.5) * 1.5).toFixed(1),
      });
    }
    setData(initialPoints);

    if (!isStreaming) return;

    const interval = setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1];
        const nextTime = new Date().toLocaleTimeString([], { hour12: false });
        const step = prev.length;

        const newPoint: TelemetryPoint = {
          time: nextTime,
          battery_voltage: +(7.8 + Math.sin(step * 0.2) * 0.05 + (Math.random() - 0.5) * 0.02).toFixed(2),
          battery_current: +(1.4 + (Math.random() - 0.5) * 0.08).toFixed(2),
          bus_voltage: +(7.7 + (Math.random() - 0.5) * 0.03).toFixed(2),
          battery_temperature: +(24.5 + Math.sin(step * 0.1) * 0.4).toFixed(1),
          cpu_temperature: +(38.2 + (Math.random() - 0.5) * 0.6).toFixed(1),
          cpu_utilization: +(28 + (Math.random() - 0.5) * 4).toFixed(0),
          adcs_error: +(1.1 + (Math.random() - 0.5) * 0.15).toFixed(2),
          comm_rssi: +(-76 + (Math.random() - 0.5) * 1.5).toFixed(1),
        };

        return [...prev.slice(1), newPoint];
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const latest = data[data.length - 1] || {
    battery_voltage: 7.82,
    battery_current: 1.42,
    bus_voltage: 7.74,
    battery_temperature: 24.5,
    cpu_temperature: 38.6,
    cpu_utilization: 28,
    adcs_error: 1.15,
    comm_rssi: -76.4,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              LIVE TELEMETRY STREAM
            </span>
            <span className="text-xs text-slate-500 font-mono">COSMOS-SAT-01 • 1.0 Hz Ingestion</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Spacecraft Telemetry Center</h1>
          <p className="text-slate-400 text-sm mt-1">Multi-Channel Health Monitoring & Subsystem Parametric Feeds</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 border ${
              isStreaming
                ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                : "bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-500"
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isStreaming ? "animate-spin text-emerald-400" : ""}`} />
            {isStreaming ? "Pause Live Feed" : "Resume Live Feed"}
          </button>
        </div>
      </div>

      {/* Subsystem Selector Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {(["EPS", "THERMAL", "OBC", "ADCS", "COMM"] as const).map((sub) => (
          <button
            key={sub}
            onClick={() => setSelectedSubsystem(sub)}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all ${
              selectedSubsystem === sub
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm"
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
            }`}
          >
            {sub} Channels
          </button>
        ))}
      </div>

      {/* Primary Telemetry Readings Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {selectedSubsystem === "EPS" && (
          <>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400">Battery Voltage (V_batt)</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">{latest.battery_voltage} V</div>
              <span className="text-[11px] text-emerald-400 font-mono">Nominal (6.8V - 8.4V)</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400">Battery Current (I_batt)</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">{latest.battery_current} A</div>
              <span className="text-[11px] text-emerald-400 font-mono">Discharging</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400">Main Bus Voltage (V_bus)</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">{latest.bus_voltage} V</div>
              <span className="text-[11px] text-emerald-400 font-mono">Regulated</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400">State of Charge (SoC)</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">91.4 %</div>
              <span className="text-[11px] text-emerald-400 font-mono">High Reserve</span>
            </div>
          </>
        )}

        {selectedSubsystem === "THERMAL" && (
          <>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400">Battery Pack Temp</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">{latest.battery_temperature} °C</div>
              <span className="text-[11px] text-emerald-400 font-mono">Safe (-10 to 45°C)</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400">OBC CPU Temp</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">{latest.cpu_temperature} °C</div>
              <span className="text-[11px] text-emerald-400 font-mono">Safe (-10 to 70°C)</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400">Payload Temp</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">21.0 °C</div>
              <span className="text-[11px] text-emerald-400 font-mono">Safe</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400">Radiator Panel</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">-8.4 °C</div>
              <span className="text-[11px] text-emerald-400 font-mono">Dissipating</span>
            </div>
          </>
        )}

        {selectedSubsystem === "OBC" && (
          <>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400">CPU Utilization</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">{latest.cpu_utilization} %</div>
              <span className="text-[11px] text-emerald-400 font-mono">Nominal Load</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400">RAM Allocation</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">42.1 %</div>
              <span className="text-[11px] text-emerald-400 font-mono">1.2 MB / 3.0 MB</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400">Boot Counter</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">1</div>
              <span className="text-[11px] text-emerald-400 font-mono">No Watchdog Resets</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400">Uptime</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">14d 06h</div>
              <span className="text-[11px] text-emerald-400 font-mono">Continuous</span>
            </div>
          </>
        )}

        {selectedSubsystem === "ADCS" && (
          <>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400">Attitude Pointing Error</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">{latest.adcs_error} °</div>
              <span className="text-[11px] text-emerald-400 font-mono">Nadir Locked</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400">RW-1 Speed</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">1840 RPM</div>
              <span className="text-[11px] text-emerald-400 font-mono">Within Band</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400">Angular Velocity</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">0.42 °/s</div>
              <span className="text-[11px] text-emerald-400 font-mono">Detumbled</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400">Sun Sensor Status</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">LOCKED</div>
              <span className="text-[11px] text-emerald-400 font-mono">Sun Vector Verified</span>
            </div>
          </>
        )}

        {selectedSubsystem === "COMM" && (
          <>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400">UHF RSSI</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">{latest.comm_rssi} dBm</div>
              <span className="text-[11px] text-emerald-400 font-mono">Link Margin &gt; 12 dB</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400">Packet Loss</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">1.2 %</div>
              <span className="text-[11px] text-emerald-400 font-mono">Nominal Ground Track</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400">Carrier Frequency</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">437.425 MHz</div>
              <span className="text-[11px] text-emerald-400 font-mono">Doppler Corrected</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400">Downlink Packets</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">14,290</div>
              <span className="text-[11px] text-emerald-400 font-mono">CRC Verified</span>
            </div>
          </>
        )}
      </div>

      {/* Live Waveform Chart */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Real-Time Parametric Trajectory ({selectedSubsystem})
            </h3>
            <p className="text-xs text-slate-400">
              Window: Last 25 Telemetry Samples • Physical Coupling Simulation
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Channel 1
            <span className="w-2 h-2 rounded-full bg-emerald-500 ml-2" />
            Channel 2
          </div>
        </div>

        <div className="h-[320px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: "#64748b" }} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />

              {selectedSubsystem === "EPS" && (
                <>
                  <Line
                    type="monotone"
                    dataKey="battery_voltage"
                    name="Battery Voltage (V)"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="bus_voltage"
                    name="Bus Voltage (V)"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </>
              )}

              {selectedSubsystem === "THERMAL" && (
                <>
                  <Line
                    type="monotone"
                    dataKey="battery_temperature"
                    name="Battery Temp (°C)"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="cpu_temperature"
                    name="CPU Temp (°C)"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </>
              )}

              {selectedSubsystem === "OBC" && (
                <Line
                  type="monotone"
                  dataKey="cpu_utilization"
                  name="CPU Utilization (%)"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              )}

              {selectedSubsystem === "ADCS" && (
                <Line
                  type="monotone"
                  dataKey="adcs_error"
                  name="Attitude Error (°)"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              )}

              {selectedSubsystem === "COMM" && (
                <Line
                  type="monotone"
                  dataKey="comm_rssi"
                  name="RSSI (dBm)"
                  stroke="#ec4899"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

