"use client";

import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  BrainCircuit,
  Radio,
  Satellite,
  CircleAlert,
} from "lucide-react";
import Link from "next/link";
import { useTelemetry } from "@/hooks/use-telemetry";
import { AnomalyStatusCard } from "@/components/anomaly-status-card";
import { AnomalyChannelTable } from "@/components/anomaly-channel-table";

export default function AnomaliesPage() {
  const { telemetry, anomaly, connected, error } = useTelemetry();

  return (
    <div className="quicksand min-h-[calc(100vh-4rem)] bg-[#05070d] px-5 py-8 text-white sm:px-7 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        {/* ─────────────────────────────────────────────
            PAGE HEADER
        ───────────────────────────────────────────── */}

        <Link
          href="/dashboard"
          className="group mb-7 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-white/30 transition-colors duration-200 hover:text-white/70"
        >
          <ArrowLeft
            className="size-3 transition-transform duration-200 group-hover:-translate-x-0.5"
            strokeWidth={1.7}
          />
          Mission Overview
        </Link>

        <div className="mb-9 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <BrainCircuit
                className="size-3.5 text-cyan-300/70"
                strokeWidth={1.8}
              />

              <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-cyan-300/55">
                Intelligence Layer
              </span>
            </div>

            <h1 className="text-3xl font-medium tracking-[-0.045em] text-white md:text-4xl">
              Anomaly Center
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/35">
              Real-time telemetry deviation analysis for COSMOS-SAT-01.
            </p>
          </div>

          {/* Detector status */}

          <div className="flex items-center gap-3 self-start rounded-full border border-white/[0.08] bg-white/[0.025] px-3.5 py-2 lg:self-auto">
            <span className="relative flex size-1.5">
              {connected && (
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-300/25" />
              )}

              <span
                className={`relative size-1.5 rounded-full ${
                  connected
                    ? "bg-emerald-300/80 shadow-[0_0_8px_rgba(110,231,183,0.45)]"
                    : "bg-red-300/80"
                }`}
              />
            </span>

            <span
              className={`text-[9px] font-medium uppercase tracking-[0.18em] ${
                connected ? "text-emerald-300/65" : "text-red-300/65"
              }`}
            >
              {connected ? "Detector Online" : "Detector Offline"}
            </span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            CONNECTION WARNING
        ───────────────────────────────────────────── */}

        {error && (
          <div className="mb-7 flex items-start gap-3 rounded-xl border border-red-300/[0.12] bg-red-300/[0.025] px-4 py-3.5">
            <CircleAlert className="mt-0.5 size-4 shrink-0 text-red-300/70" />

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-red-300/70">
                Mission Stream
              </p>

              <p className="mt-1 text-xs leading-5 text-red-200/45">{error}</p>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────
            TELEMETRY CONTEXT
        ───────────────────────────────────────────── */}

        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-white/25">
                Stream Context
              </p>

              <h2 className="mt-1.5 text-sm font-medium tracking-[-0.01em] text-white/75">
                Current telemetry state
              </h2>
            </div>

            <span className="hidden text-[9px] uppercase tracking-[0.18em] text-white/20 sm:block">
              Live mission feed
            </span>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.07] backdrop-blur-xl md:grid-cols-3">
            {/* Spacecraft */}

            <div className="group bg-white/[0.025] p-5 transition-colors duration-300 hover:bg-white/[0.045]">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.035]">
                  <Satellite
                    className="size-3.5 text-white/45"
                    strokeWidth={1.6}
                  />
                </div>

                <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/25">
                  Spacecraft
                </span>
              </div>

              <p className="mt-5 font-mono text-xs tracking-wide text-white/75">
                COSMOS-SAT-01
              </p>
            </div>

            {/* Sequence */}

            <div className="group bg-white/[0.025] p-5 transition-colors duration-300 hover:bg-white/[0.045]">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.035]">
                  <Activity
                    className="size-3.5 text-cyan-300/55"
                    strokeWidth={1.6}
                  />
                </div>

                <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/25">
                  Sequence
                </span>
              </div>

              <p className="mt-5 font-mono text-xs tracking-wide text-white/75">
                {telemetry?.sequence ?? "--"}
              </p>
            </div>

            {/* Source */}

            <div className="group bg-white/[0.025] p-5 transition-colors duration-300 hover:bg-white/[0.045]">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.035]">
                  <Radio className="size-3.5 text-white/45" strokeWidth={1.6} />
                </div>

                <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/25">
                  Source
                </span>
              </div>

              <p className="mt-5 text-xs capitalize tracking-wide text-white/75">
                {telemetry?.source ?? "--"}
              </p>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────
            OVERALL ANOMALY
        ───────────────────────────────────────────── */}

        <section className="mb-10">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-white/25">
                Detection
              </p>

              <h2 className="mt-1.5 text-sm font-medium text-white/75">
                Overall system assessment
              </h2>
            </div>

            {anomaly && (
              <span className="text-[9px] uppercase tracking-[0.18em] text-white/20">
                Score {anomaly.score.toFixed(2)}
              </span>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.02]">
            <AnomalyStatusCard anomaly={anomaly} />
          </div>
        </section>

        {/* ─────────────────────────────────────────────
            CHANNEL ANALYSIS
        ───────────────────────────────────────────── */}

        {anomaly && (
          <section className="mb-10">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-white/25">
                  Channel Analysis
                </p>

                <h2 className="mt-1.5 text-sm font-medium text-white/75">
                  Telemetry deviations
                </h2>
              </div>

              <div className="group hidden items-center gap-2 border-b border-white/[0.10] pb-1 text-[9px] uppercase tracking-[0.16em] text-white/30 transition-colors hover:border-white/30 hover:text-white/60 sm:flex">
                Inspect channels
                <ArrowUpRight className="size-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.02]">
              <AnomalyChannelTable channels={anomaly.channels} />
            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────────
            DETECTOR METADATA
        ───────────────────────────────────────────── */}

        {anomaly && (
          <footer className="border-t border-white/[0.08] pt-5">
            <div className="flex flex-col gap-3 text-[9px] uppercase tracking-[0.18em] text-white/20 sm:flex-row sm:items-center sm:justify-between">
              <span>Detector · {anomaly.detector}</span>

              <span>
                Timestamp · {new Date(anomaly.timestamp).toLocaleTimeString()}
              </span>

              <span>Thresholds · 2σ warning · 3σ critical</span>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
