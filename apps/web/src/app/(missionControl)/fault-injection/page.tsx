"use client";

import Link from "next/link";

import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  ShieldAlert,
  Zap,
} from "lucide-react";

import { useEffect, useState } from "react";

const faults = [
  {
    id: "battery_degradation",
    name: "Battery Degradation",
    subsystem: "EPS",
    description:
      "Simulates degraded battery performance causing voltage drop and increased current draw.",
    effects: [
      "Battery voltage ↓",
      "Battery current ↑",
      "Bus voltage ↓",
    ],
  },
  {
    id: "battery_overheating",
    name: "Battery Overheating",
    subsystem: "EPS",
    description:
      "Simulates abnormal thermal behavior in the spacecraft battery.",
    effects: [
      "Battery temperature ↑",
      "Payload temperature ↑",
    ],
  },
  {
    id: "bus_undervoltage",
    name: "Bus Undervoltage",
    subsystem: "EPS",
    description:
      "Simulates a spacecraft power bus voltage collapse.",
    effects: [
      "Battery voltage ↓",
      "Bus voltage ↓",
      "Power margin ↓",
    ],
  },
  {
    id: "cpu_overload",
    name: "OBC CPU Overload",
    subsystem: "OBC",
    description:
      "Simulates excessive on-board computer processing load.",
    effects: [
      "CPU utilization ↑",
      "Memory utilization ↑",
      "OBC temperature ↑",
    ],
  },
  {
    id: "obc_overheating",
    name: "OBC Overheating",
    subsystem: "OBC",
    description:
      "Simulates thermal stress on the spacecraft computer.",
    effects: [
      "OBC temperature ↑",
      "Thermal margin ↓",
    ],
  },
  {
    id: "adcs_instability",
    name: "ADCS Instability",
    subsystem: "ADCS",
    description:
      "Simulates attitude-control instability and increased spacecraft rotation.",
    effects: [
      "Angular velocity ↑",
      "Attitude error ↑",
      "Reaction wheel speed ↑",
    ],
  },
  {
    id: "communication_degradation",
    name: "Communication Degradation",
    subsystem: "COMM",
    description:
      "Simulates a degraded spacecraft-ground communication link.",
    effects: [
      "RSSI ↓",
      "Packet loss ↑",
      "Downlink reliability ↓",
    ],
  },
];

export default function FaultInjectionPage() {
  const [activeFault, setActiveFault] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/faults")
      .then((response) => response.json())
      .then((data) => {
        setActiveFault(data.fault);
      })
      .catch(() => {
        setMessage(
          "Unable to connect to the simulation service."
        );
      });
  }, []);

  async function activateFault(fault: string) {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        "http://localhost:8000/faults/activate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fault,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Fault activation failed.");
      }

      const data = await response.json();

      setActiveFault(data.fault);

      setMessage(
        `${fault} activated in simulation.`
      );
    } catch {
      setMessage(
        "Could not activate fault. Is the telemetry service running?"
      );
    } finally {
      setLoading(false);
    }
  }

  async function clearFault() {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        "http://localhost:8000/faults/clear",
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Fault clearing failed.");
      }

      setActiveFault(null);

      setMessage(
        "Active fault cleared. Spacecraft simulation returning to nominal state."
      );
    } catch {
      setMessage("Could not clear fault.");
    } finally {
      setLoading(false);
    }
  }

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
              <ShieldAlert
                className="size-3.5 text-amber-300/65"
                strokeWidth={1.7}
              />

              <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-amber-300/55">
                Simulation Environment
              </span>
            </div>

            <h1 className="text-3xl font-medium tracking-[-0.045em] text-white md:text-4xl">
              Fault Injection
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/35">
              Introduce controlled spacecraft failures into the
              simulation and observe their telemetry effects.
            </p>
          </div>

          {/* Simulation state */}

          <div className="flex items-center gap-2 self-start rounded-full border border-amber-300/[0.10] bg-amber-300/[0.025] px-3.5 py-2 lg:self-auto">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-300/20" />

              <span className="relative size-1.5 rounded-full bg-amber-300/75 shadow-[0_0_8px_rgba(252,211,77,0.35)]" />
            </span>

            <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-amber-300/65">
              Simulation Only
            </span>
          </div>
        </div>

        {/* ─────────────────────────────────────────
            SAFETY NOTICE
        ───────────────────────────────────────── */}

        <div className="mb-10 overflow-hidden rounded-2xl border border-amber-300/[0.10] bg-amber-300/[0.02]">
          <div className="flex items-start gap-4 px-5 py-4">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-amber-300/[0.10] bg-amber-300/[0.035]">
              <AlertTriangle
                className="size-3.5 text-amber-300/65"
                strokeWidth={1.7}
              />
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-amber-300/65">
                Controlled Fault Environment
              </p>

              <p className="mt-1.5 max-w-3xl text-xs leading-6 text-white/35">
                Fault injection modifies only the COSMOS spacecraft
                simulator. No real spacecraft commands, radio links,
                uplinks, or hardware are connected to this operation.
              </p>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────
            SERVICE MESSAGE
        ───────────────────────────────────────── */}

        {message && (
          <div
            className={`mb-8 rounded-xl border px-4 py-3.5 text-xs ${
              message.toLowerCase().includes("could") ||
              message.toLowerCase().includes("unable")
                ? "border-red-300/[0.12] bg-red-300/[0.025] text-red-200/60"
                : "border-white/[0.09] bg-white/[0.025] text-white/45"
            }`}
          >
            {message}
          </div>
        )}

        {/* ─────────────────────────────────────────
            ACTIVE FAULT
        ───────────────────────────────────────── */}

        <section className="mb-12">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-white/25">
                Current State
              </p>

              <h2 className="mt-1.5 text-sm font-medium text-white/70">
                Active Fault
              </h2>
            </div>

            {activeFault && (
              <button
                onClick={clearFault}
                disabled={loading}
                className="group flex items-center gap-2 border-b border-white/[0.12] pb-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white/35 transition-all duration-200 hover:border-white/40 hover:text-white/75 disabled:opacity-40"
              >
                <RotateCcw
                  className="size-3 transition-transform duration-300 group-hover:-rotate-45"
                  strokeWidth={1.7}
                />

                Clear Fault
              </button>
            )}
          </div>

          <div
            className={`overflow-hidden rounded-2xl border ${
              activeFault
                ? "border-red-300/[0.13] bg-red-300/[0.025]"
                : "border-white/[0.09] bg-white/[0.025]"
            }`}
          >
            {activeFault ? (
              <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-red-300/[0.10] bg-red-300/[0.035]">
                    <Zap
                      className="size-4 text-red-300/70"
                      strokeWidth={1.6}
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-red-200/85">
                      {faults.find(
                        (fault) => fault.id === activeFault
                      )?.name ?? activeFault}
                    </p>

                    <p className="mt-1.5 text-xs leading-5 text-white/30">
                      Fault is currently being injected into the
                      spacecraft simulation.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start text-[9px] font-medium uppercase tracking-[0.18em] text-red-300/65 sm:self-auto">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-300/25" />
                    <span className="relative size-1.5 rounded-full bg-red-300/80" />
                  </span>

                  Active
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-6">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-emerald-300/[0.10] bg-emerald-300/[0.025]">
                  <CheckCircle2
                    className="size-4 text-emerald-300/65"
                    strokeWidth={1.6}
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-white/75">
                    Spacecraft Nominal
                  </p>

                  <p className="mt-1.5 text-xs leading-5 text-white/30">
                    No simulated faults are currently active.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ─────────────────────────────────────────
            FAULT CATALOGUE
        ───────────────────────────────────────── */}

        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-white/25">
                Fault Catalogue
              </p>

              <h2 className="mt-1.5 text-sm font-medium text-white/70">
                Available Scenarios
              </h2>
            </div>

            <span className="hidden text-[9px] uppercase tracking-[0.18em] text-white/20 sm:block">
              {faults.length.toString().padStart(2, "0")} scenarios
            </span>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.07] lg:grid-cols-2">
            {faults.map((fault) => {
              const isActive =
                activeFault === fault.id;

              return (
                <div
                  key={fault.id}
                  className={`group relative overflow-hidden bg-white/[0.025] p-6 transition-colors duration-300 ${
                    isActive
                      ? "bg-red-300/[0.025]"
                      : "hover:bg-white/[0.045]"
                  }`}
                >
                  {/* Fault header */}

                  <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`text-sm font-medium ${
                            isActive
                              ? "text-red-200/85"
                              : "text-white/75"
                          }`}
                        >
                          {fault.name}
                        </h3>

                        <span
                          className={`rounded-md border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] ${
                            isActive
                              ? "border-red-300/[0.12] bg-red-300/[0.025] text-red-300/45"
                              : "border-white/[0.08] bg-white/[0.025] text-white/20"
                          }`}
                        >
                          {fault.subsystem}
                        </span>
                      </div>

                      <p className="mt-2.5 max-w-lg text-xs leading-6 text-white/30">
                        {fault.description}
                      </p>
                    </div>

                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg border ${
                        isActive
                          ? "border-red-300/[0.10] bg-red-300/[0.035]"
                          : "border-white/[0.08] bg-white/[0.03]"
                      }`}
                    >
                      <Zap
                        className={`size-3.5 ${
                          isActive
                            ? "text-red-300/65"
                            : "text-white/25"
                        }`}
                        strokeWidth={1.6}
                      />
                    </div>
                  </div>

                  {/* Effects */}

                  <div className="mt-6 border-t border-white/[0.06] pt-4">
                    <p className="mb-2.5 text-[8px] font-medium uppercase tracking-[0.22em] text-white/20">
                      Expected Effects
                    </p>

                    <div className="flex flex-wrap gap-x-5 gap-y-2">
                      {fault.effects.map((effect) => (
                        <span
                          key={effect}
                          className="font-mono text-[10px] text-white/35"
                        >
                          {effect}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action */}

                  <button
                    onClick={() =>
                      activateFault(fault.id)
                    }
                    disabled={loading || isActive}
                    className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition-all duration-300 ${
                      isActive
                        ? "cursor-default border border-red-300/[0.10] bg-red-300/[0.035] text-red-300/55"
                        : "bg-white text-black hover:-translate-y-px hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
                    }`}
                  >
                    <Zap
                      className="size-3"
                      strokeWidth={1.8}
                    />

                    {isActive
                      ? "Fault Active"
                      : "Inject Fault"}
                  </button>

                  {/* Hover rail */}

                  <div
                    className={`pointer-events-none absolute bottom-0 left-0 h-px w-0 transition-all duration-500 group-hover:w-full ${
                      isActive
                        ? "bg-red-300/40"
                        : "bg-amber-300/35"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* ─────────────────────────────────────────
            FOOTER
        ───────────────────────────────────────── */}

        <footer className="mt-12 border-t border-white/[0.08] pt-5">
          <div className="flex flex-col gap-3 text-[9px] uppercase tracking-[0.18em] text-white/20 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Environment · Simulation
            </span>

            <span>
              Spacecraft · COSMOS-SAT-01
            </span>

            <span>
              Faults · {faults.length.toString().padStart(2, "0")}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
