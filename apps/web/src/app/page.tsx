"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import {
  Activity,
  Battery,
  Cpu,
  Gauge,
  Radio,
  Satellite,
  Thermometer,
  ArrowUpRight,
} from "lucide-react";

const subsystemIcons = {
  EPS: Battery,
  ADCS: Gauge,
  OBC: Cpu,
  COMM: Radio,
  PAYLOAD: Satellite,
  THERMAL: Thermometer,
};

export default function Home() {
  const organization = useQuery(
    api.organizations.getBySlug,
    {
      slug: "rvce",
    }
  );

  const missions = useQuery(
    api.missions.list,
    organization
      ? {
          organizationId: organization._id,
        }
      : "skip"
  );

  const mission = missions?.[0];

  const spacecraft = useQuery(
    api.spacecraft.getByMission,
    mission
      ? {
          missionId: mission._id,
        }
      : "skip"
  );

  const satellite = spacecraft?.[0];

  const subsystems = useQuery(
    api.subsystems.list,
    satellite
      ? {
          spacecraftId: satellite._id,
        }
      : "skip"
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* PAGE HEADER */}

        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cyan-400">
              <Activity className="size-3.5" />
              Mission Overview
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              {satellite?.name ?? "COSMOS-SAT-01"}
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              {mission?.name ?? "RVCE CubeSat-01"}
            </p>
          </div>

          <div className="hidden text-right sm:block">
            <p className="text-xs uppercase tracking-wider text-zinc-600">
              Mission state
            </p>

            <p className="mt-1 text-sm font-medium text-emerald-400">
              ● NOMINAL
            </p>
          </div>
        </div>

        {/* MISSION SUMMARY */}

        <section className="mb-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-600">
              Organization
            </p>

            <p className="mt-2 text-lg font-medium">
              {organization?.name ?? "Loading..."}
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Mission operator
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-600">
              Spacecraft
            </p>

            <p className="mt-2 text-lg font-medium">
              {satellite?.name ?? "Loading..."}
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              CubeSat reference vehicle
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-600">
              Telemetry
            </p>

            <p className="mt-2 text-lg font-medium text-zinc-300">
              NOT STREAMING
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Simulator not started
            </p>
          </div>

        </section>

        {/* SUBSYSTEMS */}

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-600">
                Spacecraft Health
              </p>

              <h2 className="mt-1 text-lg font-medium">
                Subsystem Status
              </h2>
            </div>

            <button className="flex items-center gap-1 text-xs text-zinc-500 transition hover:text-cyan-400">
              View telemetry
              <ArrowUpRight className="size-3" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {subsystems?.map((subsystem) => {
              const Icon =
                subsystemIcons[
                  subsystem.type as keyof typeof subsystemIcons
                ] ?? Activity;

              return (
                <div
                  key={subsystem._id}
                  className="group rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 transition hover:border-cyan-500/30 hover:bg-zinc-900/70"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex size-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950">
                      <Icon className="size-4 text-cyan-400" />
                    </div>

                    <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-emerald-400">
                      <span className="size-1.5 rounded-full bg-emerald-400" />
                      Nominal
                    </span>
                  </div>

                  <div className="mt-5">
                    <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-600">
                      {subsystem.type}
                    </p>

                    <h3 className="mt-1 font-medium">
                      {subsystem.name}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                      {subsystem.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}