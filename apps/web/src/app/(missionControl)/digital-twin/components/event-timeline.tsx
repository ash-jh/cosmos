// ─────────────────────────────────────────────────────────────
// COSMOS Digital Twin — Event Timeline
// Compact event stream showing diagnostic events in
// chronological order.
// ─────────────────────────────────────────────────────────────

"use client";

import { memo } from "react";
import type { TimelineEvent } from "../lib/twin-state";

interface EventTimelineProps {
  events: TimelineEvent[];
}

const SEVERITY_STYLES = {
  info: {
    dot: "bg-white/40",
    text: "text-white/45",
  },
  warning: {
    dot: "bg-amber-400",
    text: "text-amber-200/70",
  },
  critical: {
    dot: "bg-red-400",
    text: "text-red-200/70",
  },
  success: {
    dot: "bg-emerald-400",
    text: "text-emerald-200/70",
  },
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export const EventTimeline = memo(function EventTimeline({
  events,
}: EventTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-4">
        <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-white/20">
          Event Timeline
        </p>

        <p className="mt-3 text-[10px] text-white/20">
          No events recorded in this session.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.015]">
      <div className="border-b border-white/[0.06] px-4 py-3">
        <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-white/25">
          Event Timeline
        </p>
      </div>

      <div className="max-h-48 overflow-y-auto px-4 py-2">
        {events.slice(0, 20).map((event) => {
          const style = SEVERITY_STYLES[event.severity];

          return (
            <div
              key={event.id}
              className="flex items-start gap-3 border-b border-white/[0.03] py-2 last:border-0"
            >
              <span className="mt-1.5 shrink-0 font-mono text-[9px] text-white/20">
                {formatTime(event.timestamp)}
              </span>

              <span
                className={`mt-1.5 size-1.5 shrink-0 rounded-full ${style.dot}`}
              />

              <span
                className={`text-[10px] leading-5 ${style.text}`}
              >
                {event.message}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

