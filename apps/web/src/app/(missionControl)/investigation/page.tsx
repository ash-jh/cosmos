"use client";

import Link from "next/link";

import {
  BrainCircuit,
  Clock3,
  Lock,
  Satellite,
  ArrowLeft,
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
    <div className="quicksand min-h-[calc(100vh-4rem)] bg-[#05070d] px-5 py-8 text-white sm:px-7 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">

        {/* ─────────────────────────────────────────
            BACK NAVIGATION
        ───────────────────────────────────────── */}

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

        {/* ─────────────────────────────────────────
            HEADER
        ───────────────────────────────────────── */}

        <div className="mb-9 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <BrainCircuit
                className="size-3.5 text-cyan-300/70"
                strokeWidth={1.7}
              />

              <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-cyan-300/55">
                Mission Intelligence
              </span>
            </div>

            <h1 className="text-3xl font-medium tracking-[-0.045em] text-white md:text-4xl">
              Investigation
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/35">
              Investigate correlated telemetry anomalies and
              review candidate root causes.
            </p>
          </div>

          {/* Connection state */}

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
                connected
                  ? "text-emerald-300/65"
                  : "text-red-300/65"
              }`}
            >
              {connected ? "Telemetry Live" : "Telemetry Offline"}
            </span>

            <span className="h-3 w-px bg-white/[0.08]" />

            <span className="text-[9px] uppercase tracking-[0.16em] text-white/25">
              {telemetry?.source ?? "Waiting"}
            </span>
          </div>
        </div>

        {/* ─────────────────────────────────────────
            SAFETY / SIMULATION NOTICE
        ───────────────────────────────────────── */}

        <div className="mb-10 overflow-hidden rounded-2xl border border-cyan-300/[0.10] bg-cyan-300/[0.02]">
          <div className="flex items-start gap-4 px-5 py-4">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-cyan-300/[0.10] bg-cyan-300/[0.035]">
              <Lock
                className="size-3.5 text-cyan-300/60"
                strokeWidth={1.7}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-cyan-300/65">
                  Simulation Environment
                </p>

                <span className="size-1 rounded-full bg-cyan-300/30" />
              </div>

              <p className="mt-1.5 max-w-3xl text-xs leading-6 text-white/35">
                Investigation results are generated from simulated
                spacecraft telemetry. No live spacecraft commands
                are issued by this interface.
              </p>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────
            ERROR
        ───────────────────────────────────────── */}

        {error && (
          <div className="mb-8 rounded-xl border border-red-300/[0.12] bg-red-300/[0.025] px-4 py-3.5 text-xs text-red-200/60">
            {error}
          </div>
        )}

        {/* ─────────────────────────────────────────
            MISSION CONTEXT
        ───────────────────────────────────────── */}

        <section className="mb-10">
          <div className="mb-4">
            <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-white/25">
              Investigation Context
            </p>

            <h2 className="mt-1.5 text-sm font-medium text-white/70">
              Mission state
            </h2>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.07] backdrop-blur-xl md:grid-cols-3">

            {/* Spacecraft */}

            <div className="group bg-white/[0.025] p-5 transition-colors duration-300 hover:bg-white/[0.045]">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03]">
                  <Satellite
                    className="size-3.5 text-cyan-300/55"
                    strokeWidth={1.6}
                  />
                </div>

                <span className="text-[9px] uppercase tracking-[0.22em] text-white/25">
                  Spacecraft
                </span>
              </div>

              <p className="mt-5 font-mono text-xs tracking-wide text-white/70">
                COSMOS-SAT-01
              </p>
            </div>

            {/* Latest sequence */}

            <div className="group bg-white/[0.025] p-5 transition-colors duration-300 hover:bg-white/[0.045]">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03]">
                  <Clock3
                    className="size-3.5 text-cyan-300/55"
                    strokeWidth={1.6}
                  />
                </div>

                <span className="text-[9px] uppercase tracking-[0.22em] text-white/25">
                  Latest Sequence
                </span>
              </div>

              <p className="mt-5 font-mono text-xs text-white/70">
                {telemetry?.sequence ?? "--"}
              </p>
            </div>

            {/* RCA engine */}

            <div className="group bg-white/[0.025] p-5 transition-colors duration-300 hover:bg-white/[0.045]">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03]">
                  <BrainCircuit
                    className="size-3.5 text-cyan-300/55"
                    strokeWidth={1.6}
                  />
                </div>

                <span className="text-[9px] uppercase tracking-[0.22em] text-white/25">
                  RCA Engine
                </span>
              </div>

              <p className="mt-5 font-mono text-xs tracking-wide text-white/70">
                correlation-v1
              </p>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────
            INVESTIGATION SUMMARY
        ───────────────────────────────────────── */}

        <section className="mb-10">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-white/25">
                Analysis
              </p>

              <h2 className="mt-1.5 text-sm font-medium text-white/70">
                Investigation Summary
              </h2>
            </div>

            {anomaly && (
              <span className="hidden font-mono text-[9px] uppercase tracking-[0.16em] text-white/20 sm:block">
                Detector · {anomaly.detector}
              </span>
            )}
          </div>

          <InvestigationSummary
            anomaly={anomaly}
            rca={rca}
          />
        </section>

        {/* ─────────────────────────────────────────
            EVIDENCE
        ───────────────────────────────────────── */}

        <section className="mb-10">
          <div className="mb-4">
            <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-white/25">
              Signal Analysis
            </p>

            <h2 className="mt-1.5 text-sm font-medium text-white/70">
              Evidence
            </h2>
          </div>

          <InvestigationEvidence
            anomaly={anomaly}
            rca={rca}
          />
        </section>

        {/* ─────────────────────────────────────────
            TIMELINE
        ───────────────────────────────────────── */}

        <section className="mb-10">
          <div className="mb-4">
            <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-white/25">
              Temporal Context
            </p>

            <h2 className="mt-1.5 text-sm font-medium text-white/70">
              Anomaly Timeline
            </h2>
          </div>

          <InvestigationTimeline
            history={anomalyHistory}
          />
        </section>

        {/* ─────────────────────────────────────────
            CURRENT STATE
        ───────────────────────────────────────── */}

        {anomaly && (
          <footer className="border-t border-white/[0.08] pt-5">
            <div className="flex flex-col gap-3 text-[9px] uppercase tracking-[0.18em] text-white/20 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Detector · {anomaly.detector}
              </span>

              <span>
                Score · {anomaly.score.toFixed(2)}
              </span>

              <span>
                Sequence · {telemetry?.sequence ?? "--"}
              </span>

              <span>
                RCA Status · {rca?.status ?? "unknown"}
              </span>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
