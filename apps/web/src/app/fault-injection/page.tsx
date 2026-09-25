"use client";

import {
  AlertTriangle,
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
      setMessage(
        "Could not clear fault."
      );
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="space-y-8 p-8">

      {/* Header */}

      <div className="flex items-start justify-between">

        <div>

          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <ShieldAlert className="size-3.5" />
            Simulation Environment
          </div>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Fault Injection
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Introduce controlled spacecraft failures into the
            digital simulation and observe their telemetry effects.
          </p>

        </div>


        {/* Simulation indicator */}

        <div className="flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-400">

          <span className="size-2 rounded-full bg-amber-400" />

          SIMULATION ONLY

        </div>

      </div>


      {/* Safety notice */}

      <div className="flex gap-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">

        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-400" />

        <div>

          <p className="text-sm font-medium text-amber-300">
            Simulation environment
          </p>

          <p className="mt-1 text-xs leading-5 text-zinc-500">
            Fault injection modifies only the COSMOS spacecraft
            simulator. No real spacecraft commands, radio links,
            uplinks, or hardware are connected to this operation.
          </p>

        </div>

      </div>


      {/* Active fault */}

      <section>

        <div className="mb-4 flex items-center justify-between">

          <div>

            <p className="text-[10px] uppercase tracking-widest text-zinc-600">
              Current State
            </p>

            <h2 className="mt-1 text-sm font-medium text-zinc-200">
              Active Fault
            </h2>

          </div>


          {activeFault && (
            <button
              onClick={clearFault}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-zinc-800 px-3 py-2 text-xs text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-200 disabled:opacity-50"
            >
              <RotateCcw className="size-3.5" />

              Clear Fault
            </button>
          )}

        </div>


        <div
          className={`rounded-xl border p-5 ${
            activeFault
              ? "border-red-500/20 bg-red-500/5"
              : "border-zinc-800 bg-zinc-950/50"
          }`}
        >

          {activeFault ? (

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div className="flex size-10 items-center justify-center rounded-lg bg-red-500/10">
                  <Zap className="size-5 text-red-400" />
                </div>

                <div>

                  <p className="text-sm font-medium text-red-300">
                    {faults.find(
                      (fault) =>
                        fault.id === activeFault
                    )?.name ?? activeFault}
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    Fault is currently being injected
                    into the spacecraft simulation.
                  </p>

                </div>

              </div>


              <div className="flex items-center gap-2 text-xs text-red-400">

                <span className="size-2 animate-pulse rounded-full bg-red-400" />

                ACTIVE

              </div>

            </div>

          ) : (

            <div className="flex items-center gap-4">

              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <CheckCircle2 className="size-5 text-emerald-400" />
              </div>

              <div>

                <p className="text-sm font-medium text-zinc-200">
                  Spacecraft Nominal
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  No simulated faults are currently active.
                </p>

              </div>

            </div>

          )}

        </div>

      </section>


      {/* Fault catalogue */}

      <section>

        <div className="mb-4">

          <p className="text-[10px] uppercase tracking-widest text-zinc-600">
            Fault Catalogue
          </p>

          <h2 className="mt-1 text-sm font-medium text-zinc-200">
            Available Scenarios
          </h2>

        </div>


        <div className="grid gap-4 lg:grid-cols-2">

          {faults.map((fault) => {

            const isActive =
              activeFault === fault.id;

            return (
              <div
                key={fault.id}
                className={`rounded-xl border p-5 transition ${
                  isActive
                    ? "border-red-500/30 bg-red-500/5"
                    : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-700"
                }`}
              >

                <div className="flex items-start justify-between">

                  <div>

                    <div className="flex items-center gap-2">

                      <h3 className="text-sm font-medium text-zinc-200">
                        {fault.name}
                      </h3>

                      <span className="rounded border border-zinc-800 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-zinc-600">
                        {fault.subsystem}
                      </span>

                    </div>

                    <p className="mt-2 text-xs leading-5 text-zinc-500">
                      {fault.description}
                    </p>

                  </div>

                </div>


                <div className="mt-4 space-y-1.5">

                  {fault.effects.map((effect) => (
                    <div
                      key={effect}
                      className="text-[11px] text-zinc-600"
                    >
                      {effect}
                    </div>
                  ))}

                </div>


                <button
                  onClick={() =>
                    activateFault(fault.id)
                  }
                  disabled={loading || isActive}
                  className={`mt-5 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium transition ${
                    isActive
                      ? "cursor-default bg-red-500/10 text-red-400"
                      : "bg-zinc-100 text-zinc-950 hover:bg-white disabled:opacity-50"
                  }`}
                >

                  <Zap className="size-3.5" />

                  {isActive
                    ? "Fault Active"
                    : "Inject Fault"}

                </button>

              </div>
            );
          })}

        </div>

      </section>


      {/* Message */}

      {message && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-xs text-zinc-400">
          {message}
        </div>
      )}

    </div>
  );
}