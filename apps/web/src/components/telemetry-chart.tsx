"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartPoint = {
  sequence: number;
  value: number;
};

type TelemetryChartProps = {
  title: string;
  unit: string;
  data: ChartPoint[];
  domain?: [number | "auto", number | "auto"];
};

export function TelemetryChart({
  title,
  unit,
  data,
  domain = ["auto", "auto"],
}: TelemetryChartProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">

      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-200">
            {title}
          </p>

          <p className="mt-1 text-xs text-zinc-600">
            Last 60 seconds
          </p>
        </div>

        <span className="text-xs text-zinc-500">
          {unit}
        </span>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
            />

            <XAxis
              dataKey="sequence"
              tick={{
                fill: "#71717a",
                fontSize: 10,
              }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              domain={domain}
              tick={{
                fill: "#71717a",
                fontSize: 10,
              }}
              tickLine={false}
              axisLine={false}
              width={45}
            />

            <Tooltip
              contentStyle={{
                background: "#0B0E14",
                border: "1px solid #27272a",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{
                color: "#a1a1aa",
              }}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#00F2FE"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />

          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}