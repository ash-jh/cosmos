type SubsystemStatusProps = {
  name: string;
  code: string;
  status: "nominal" | "warning" | "critical";
};

const statusConfig = {
  nominal: {
    label: "NOMINAL",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  warning: {
    label: "WARNING",
    dot: "bg-amber-400",
    text: "text-amber-400",
    border: "border-amber-500/20",
  },
  critical: {
    label: "CRITICAL",
    dot: "bg-red-400",
    text: "text-red-400",
    border: "border-red-500/20",
  },
};

export function SubsystemStatus({
  name,
  code,
  status,
}: SubsystemStatusProps) {
  const config = statusConfig[status];

  return (
    <div
      className={`rounded-lg border ${config.border} bg-zinc-950/50 p-4`}
    >
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-zinc-200">
            {name}
          </p>

          <p className="mt-1 text-[10px] uppercase tracking-widest text-zinc-600">
            {code}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`size-2 rounded-full ${config.dot}`}
          />

          <span
            className={`text-[10px] font-medium tracking-wider ${config.text}`}
          >
            {config.label}
          </span>
        </div>

      </div>
    </div>
  );
}