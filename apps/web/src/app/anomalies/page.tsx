"use client";

import {
  Activity,
  BrainCircuit,
  Radio,
  Satellite,
} from "lucide-react";

import { useTelemetry } from "@/hooks/use-telemetry";
import { AnomalyStatusCard } from "@/components/anomaly-status-card";
import { AnomalyChannelTable } from "@/components/anomaly-channel-table";

export default function AnomaliesPage() {
  const {
    telemetry,
    anomaly,
    connected,
    error,
  } = useTelemetry();

  return (
    <div className="space-y-6 p-6 lg:p-8">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-cyan-400">
            <BrainCircuit className="size-3.5" />
            Intelligence Layer
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Anomaly Center
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-zinc-500">
            Real-time telemetry deviation analysis for
            COSMOS-SAT-01.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span
            className={`size-2 rounded-full ${
              connected
                ? "bg-emerald-400"
                : "bg-red-400"
            }`}
          />

          <span
            className={
              connected
                ? "text-emerald-400"
                : "text-red-400"
            }
          >
            {connected
              ? "DETECTOR ONLINE"
              : "DETECTOR OFFLINE"}
          </span>
        </div>
      </div>

      {/* Connection warning */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* System state */}
      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="flex items-center gap-2 text-zinc-500">
            <Satellite className="size-4" />
            <span className="text-xs uppercase tracking-widest">
              Spacecraft
            </span>
          </div>

          <p className="mt-3 font-mono text-sm text-white">
            COSMOS-SAT-01
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="flex items-center gap-2 text-zinc-500">
            <Activity className="size-4" />
            <span className="text-xs uppercase tracking-widest">
              Sequence
            </span>
          </div>

          <p className="mt-3 font-mono text-sm text-white">
            {telemetry?.sequence ?? "--"}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="flex items-center gap-2 text-zinc-500">
            <Radio className="size-4" />
            <span className="text-xs uppercase tracking-widest">
              Source
            </span>
          </div>

          <p className="mt-3 text-sm capitalize text-white">
            {telemetry?.source ?? "--"}
          </p>
        </div>
      </div>

      {/* Overall anomaly */}
      <AnomalyStatusCard anomaly={anomaly} />

      {/* Channel analysis */}
      {anomaly && (
        <AnomalyChannelTable
          channels={anomaly.channels}
        />
      )}

      {/* Footer metadata */}
      {anomaly && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 pt-4 text-[10px] uppercase tracking-widest text-zinc-600">
          <span>
            Detector: {anomaly.detector}
          </span>

          <span>
            Timestamp:{" "}
            {new Date(anomaly.timestamp).toLocaleTimeString()}
          </span>

          <span>
            Thresholds: 2σ warning · 3σ critical
          </span>
        </div>
      )}
    </div>
  );
}