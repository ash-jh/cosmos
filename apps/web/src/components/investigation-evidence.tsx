"use client";

import {
  Activity,
  CheckCircle2,
  CircleDot,
} from "lucide-react";

import type {
  AnomalyResult,
  RCAResult,
} from "@/hooks/use-telemetry";

type Props = {
  anomaly: AnomalyResult | null;
  rca: RCAResult | null;
};

export function InvestigationEvidence({
  anomaly,
  rca,
}: Props) {
  if (!anomaly || !rca) {
    return null;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">

      {/* Evidence */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60">
        <div className="border-b border-zinc-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-cyan-400" />

            <div>
              <p className="text-sm font-medium text-zinc-200">
                Evidence
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                Signals supporting the current hypothesis
              </p>
            </div>
          </div>
        </div>

        <div className="p-5">
          {rca.evidence.length === 0 ? (
            <p className="text-sm text-zinc-600">
              No supporting evidence available.
            </p>
          ) : (
            <div className="space-y-3">
              {rca.evidence.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="flex gap-3"
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-cyan-400" />

                  <p className="text-sm leading-6 text-zinc-400">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Channels */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60">
        <div className="border-b border-zinc-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <CircleDot className="size-4 text-cyan-400" />

            <div>
              <p className="text-sm font-medium text-zinc-200">
                Correlated channels
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                Channels contributing to the anomaly
              </p>
            </div>
          </div>
        </div>

        <div className="p-5">
          {anomaly.affectedChannels.length === 0 ? (
            <p className="text-sm text-zinc-600">
              No abnormal channels.
            </p>
          ) : (
            <div className="space-y-2">
              {anomaly.channels
                .filter((channel) =>
                  anomaly.affectedChannels.includes(
                    channel.channel
                  )
                )
                .map((channel) => (
                  <div
                    key={channel.channel}
                    className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-2.5"
                  >
                    <span className="font-mono text-xs text-zinc-300">
                      {channel.channel}
                    </span>

                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-zinc-500">
                        {channel.value}
                      </span>

                      <span
                        className={`text-xs font-medium ${
                          channel.severity === "critical"
                            ? "text-red-400"
                            : "text-amber-400"
                        }`}
                      >
                        {channel.z_score.toFixed(2)}σ
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}