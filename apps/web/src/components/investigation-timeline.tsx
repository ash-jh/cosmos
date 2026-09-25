"use client";

import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
} from "lucide-react";

import type { AnomalyResult } from "@/hooks/use-telemetry";

type Props = {
  history: AnomalyResult[];
};

export function InvestigationTimeline({
  history,
}: Props) {
  const events = history
    .map((item, index) => ({
      item,
      index,
    }))
    .filter(
      ({ item, index }) =>
        index === 0 ||
        item.severity !== history[index - 1]?.severity ||
        item.affectedChannels.join(",") !==
          history[index - 1]?.affectedChannels.join(",")
    )
    .slice(-12)
    .reverse();

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60">
      <div className="border-b border-zinc-800 px-5 py-4">
        <p className="text-sm font-medium text-zinc-200">
          Investigation Timeline
        </p>

        <p className="mt-1 text-xs text-zinc-600">
          Live state transitions observed by the detector
        </p>
      </div>

      <div className="p-5">
        {events.length === 0 ? (
          <p className="text-sm text-zinc-600">
            Waiting for detector events...
          </p>
        ) : (
          <div className="relative space-y-0">
            {events.map(({ item, index }, eventIndex) => {
              const normal = item.severity === "normal";
              const critical = item.severity === "critical";

              return (
                <div
                  key={`${item.timestamp}-${index}`}
                  className="relative flex gap-4 pb-6 last:pb-0"
                >
                  {eventIndex !== events.length - 1 && (
                    <div className="absolute left-[7px] top-5 h-full w-px bg-zinc-800" />
                  )}

                  <div className="relative z-10 mt-1">
                    {normal ? (
                      <CheckCircle2 className="size-4 text-emerald-400" />
                    ) : critical ? (
                      <AlertTriangle className="size-4 text-red-400" />
                    ) : (
                      <CircleDot className="size-4 text-amber-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium text-zinc-300">
                        {normal
                          ? "Telemetry returned to nominal"
                          : `${item.severity.toUpperCase()} anomaly detected`}
                      </p>

                      <span className="font-mono text-[10px] text-zinc-600">
                        {new Date(
                          item.timestamp
                        ).toLocaleTimeString()}
                      </span>
                    </div>

                    {!normal &&
                      item.affectedChannels.length > 0 && (
                        <p className="mt-1 text-xs text-zinc-600">
                          {item.affectedChannels.join(" · ")}
                        </p>
                      )}

                    <p className="mt-1 font-mono text-[10px] text-zinc-700">
                      score {item.score.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}