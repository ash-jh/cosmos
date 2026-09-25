"use client";

import type { ChannelAnomaly } from "@/hooks/use-telemetry";

type Props = {
  channels: ChannelAnomaly[];
};

const severityStyle = {
  normal: "text-emerald-400",
  warning: "text-amber-400",
  critical: "text-red-400",
};

export function AnomalyChannelTable({
  channels,
}: Props) {
  const sorted = [...channels].sort(
    (a, b) => b.z_score - a.z_score
  );

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/60">
      <div className="border-b border-zinc-800 px-5 py-4">
        <p className="text-sm font-medium text-zinc-200">
          Channel Analysis
        </p>

        <p className="mt-1 text-xs text-zinc-600">
          Current deviation from nominal operating baseline
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-left text-[10px] uppercase tracking-widest text-zinc-600">
              <th className="px-5 py-3">Channel</th>
              <th className="px-5 py-3">Value</th>
              <th className="px-5 py-3">Z-score</th>
              <th className="px-5 py-3">Severity</th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((channel) => (
              <tr
                key={channel.channel}
                className="border-b border-zinc-900 last:border-0"
              >
                <td className="px-5 py-3 font-mono text-xs text-zinc-300">
                  {channel.channel}
                </td>

                <td className="px-5 py-3 text-zinc-400">
                  {channel.value}
                </td>

                <td className="px-5 py-3 font-mono text-zinc-300">
                  {channel.z_score.toFixed(2)}
                </td>

                <td
                  className={`px-5 py-3 text-xs font-medium uppercase ${severityStyle[channel.severity]}`}
                >
                  {channel.severity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}