"use client";

import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  Search,
  ShieldAlert,
} from "lucide-react";

import type {
  AnomalyResult,
  RCAResult,
} from "@/hooks/use-telemetry";

type Props = {
  anomaly: AnomalyResult | null;
  rca: RCAResult | null;
};

export function InvestigationSummary({
  anomaly,
  rca,
}: Props) {
  if (!anomaly || !rca) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-8">
        <div className="flex items-center gap-3">
          <Search className="size-5 text-zinc-600" />

          <div>
            <p className="text-sm font-medium text-zinc-300">
              Waiting for mission data
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Investigation data will appear when telemetry is received.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isNormal = anomaly.severity === "normal";

  if (isNormal) {
    return (
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-8">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10">
            <CheckCircle2 className="size-5 text-emerald-400" />
          </div>

          <div>
            <p className="text-sm font-semibold text-emerald-400">
              No active investigation
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Current telemetry is within the configured nominal
              operating baseline.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const critical = anomaly.severity === "critical";

  return (
    <div
      className={`rounded-xl border p-6 ${
        critical
          ? "border-red-500/20 bg-red-500/5"
          : "border-amber-500/20 bg-amber-500/5"
      }`}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${
              critical
                ? "bg-red-400/10"
                : "bg-amber-400/10"
            }`}
          >
            {critical ? (
              <ShieldAlert className="size-5 text-red-400" />
            ) : (
              <AlertTriangle className="size-5 text-amber-400" />
            )}
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Active investigation
            </p>

            <h2 className="mt-1 text-xl font-semibold text-white">
              {rca.candidate_cause
                ? rca.candidate_cause.replaceAll("_", " ")
                : "Unclassified anomaly"}
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Candidate cause identified from correlated telemetry.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 py-3 lg:min-w-36">
          <p className="text-[10px] uppercase tracking-widest text-zinc-600">
            Confidence
          </p>

          <p className="mt-1 text-xl font-semibold text-white">
            {(rca.confidence * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
          <p className="text-[10px] uppercase tracking-widest text-zinc-600">
            Severity
          </p>

          <p
            className={`mt-2 text-sm font-medium uppercase ${
              critical
                ? "text-red-400"
                : "text-amber-400"
            }`}
          >
            {anomaly.severity}
          </p>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
          <p className="text-[10px] uppercase tracking-widest text-zinc-600">
            Subsystem
          </p>

          <p className="mt-2 text-sm font-medium text-white">
            {rca.subsystem ?? "Unidentified"}
          </p>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
          <p className="text-[10px] uppercase tracking-widest text-zinc-600">
            Detector
          </p>

          <p className="mt-2 font-mono text-xs text-zinc-300">
            {anomaly.detector}
          </p>
        </div>
      </div>
    </div>
  );
}