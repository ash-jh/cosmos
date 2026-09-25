"use client";

import {
  BrainCircuit,
  Clock3,
  Lock,
  Satellite,
} from "lucide-react";

import { useTelemetry } from "@/hooks/use-telemetry";

import { InvestigationSummary } from "@/components/investigation-summary";
import { InvestigationEvidence } from "@/components/investigation-evidence";
import { InvestigationTimeline } from "@/components/investigation-timeline";

export default function InvestigationPage() {
  const {
    telemetry,
    anomaly,
    anomalyHistory,
    rca,
    connected,
    error,
  } = useTelemetry();

  return (
    <div className="space-y-6 p-6 lg:p-8">

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-cyan-400">
            <BrainCircuit className="size-3.5" />
            Mission Intelligence
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Investigation
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-zinc-500">
            Investigate correlated telemetry anomalies and
            review candidate root causes.
          </p>
        </div>

        <div className="flex items-center gap-3">
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
              {connected ? "LIVE" : "OFFLINE"}
            </span>
          </div>

          <span className="text-zinc-800">|</span>

          <span className="text-xs text-zinc-600">
            {telemetry?.source ?? "waiting"}
          </span>
        </div>
      </div>

      {/* Safety banner */}
      <div className="flex items-start gap-3 rounded-xl border border-cyan-500/15 bg-cyan-500/5 px-4 py-3">
        <Lock className="mt-0.5 size-4 shrink-0 text-cyan-400" />

        <div>
          <p className="text-xs font-medium text-cyan-300">
            SIMULATION ENVIRONMENT
          </p>

          <p className="mt-1 text-xs leading-5 text-zinc-500">
            Investigation results are generated from simulated
            spacecraft telemetry. No live spacecraft commands
            are issued by this interface.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Mission identity */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="flex items-center gap-2 text-zinc-600">
            <Satellite className="size-4" />
            <span className="text-[10px] uppercase tracking-widest">
              Spacecraft
            </span>
          </div>

          <p className="mt-3 font-mono text-sm text-zinc-200">
            COSMOS-SAT-01
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="flex items-center gap-2 text-zinc-600">
            <Clock3 className="size-4" />
            <span className="text-[10px] uppercase tracking-widest">
              Latest sequence
            </span>
          </div>

          <p className="mt-3 font-mono text-sm text-zinc-200">
            {telemetry?.sequence ?? "--"}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="flex items-center gap-2 text-zinc-600">
            <BrainCircuit className="size-4" />
            <span className="text-[10px] uppercase tracking-widest">
              RCA engine
            </span>
          </div>

          <p className="mt-3 font-mono text-sm text-zinc-200">
            correlation-v1
          </p>
        </div>
      </div>

      {/* Main investigation */}
      <InvestigationSummary
        anomaly={anomaly}
        rca={rca}
      />

      <InvestigationEvidence
        anomaly={anomaly}
        rca={rca}
      />

      <InvestigationTimeline
        history={anomalyHistory}
      />

      {/* Current state */}
      {anomaly && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 pt-4 text-[10px] uppercase tracking-widest text-zinc-600">
          <span>
            Detector: {anomaly.detector}
          </span>

          <span>
            Score: {anomaly.score.toFixed(2)}
          </span>

          <span>
            Sequence: {telemetry?.sequence ?? "--"}
          </span>

          <span>
            RCA status: {rca?.status ?? "unknown"}
          </span>
        </div>
      )}
    </div>
  );
}