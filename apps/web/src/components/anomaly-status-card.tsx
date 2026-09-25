"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

import type { AnomalyResult } from "@/hooks/use-telemetry";

type Props = {
  anomaly: AnomalyResult | null;
};

const config = {
  normal: {
    label: "SYSTEM NOMINAL",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-400/5",
    border: "border-emerald-500/20",
  },

  warning: {
    label: "ANOMALY DETECTED",
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-400/5",
    border: "border-amber-500/20",
  },

  critical: {
    label: "CRITICAL ANOMALY",
    icon: ShieldAlert,
    color: "text-red-400",
    bg: "bg-red-400/5",
    border: "border-red-500/20",
  },
};

export function AnomalyStatusCard({
  anomaly,
}: Props) {
  if (!anomaly) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6">
        <p className="text-sm text-zinc-500">
          Waiting for anomaly detector...
        </p>
      </div>
    );
  }

  const current = config[anomaly.severity];
  const Icon = current.icon;

  return (
    <div
      className={`rounded-xl border ${current.border} ${current.bg} p-6`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex size-10 items-center justify-center rounded-lg bg-zinc-950 ${current.color}`}
          >
            <Icon className="size-5" />
          </div>

          <div>
            <p
              className={`text-xs font-semibold tracking-[0.18em] ${current.color}`}
            >
              {current.label}
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              {anomaly.detector}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-semibold text-white">
            {anomaly.score.toFixed(2)}
          </p>

          <p className="text-[10px] uppercase tracking-widest text-zinc-600">
            anomaly score
          </p>
        </div>
      </div>

      {anomaly.affectedChannels.length > 0 && (
        <div className="mt-5 border-t border-zinc-800/70 pt-4">
          <p className="mb-2 text-[10px] uppercase tracking-widest text-zinc-600">
            Affected channels
          </p>

          <div className="flex flex-wrap gap-2">
            {anomaly.affectedChannels.map((channel) => (
              <span
                key={channel}
                className="rounded-md border border-red-500/20 bg-red-500/5 px-2.5 py-1 text-xs text-red-300"
              >
                {channel}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}