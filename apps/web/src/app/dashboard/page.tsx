"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

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
      ? { missionId: mission._id }
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
    <div className="min-h-screen quicksand bg-[#05070d] px-5 py-6 text-white sm:px-7 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl">

        {/* PAGE HEADER */}

        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-cyan-300/70">
              <Activity className="size-3.5" />
              Mission Overview
            </div>

            <h1 className="text-3xl font-medium tracking-[-0.045em] text-white md:text-4xl">
              {satellite?.name ?? "COSMOS-SAT-01"}
            </h1>

            <p className="mt-2 text-sm text-white/35">
              {mission?.name ?? "RVCE CubeSat-01"}
            </p>
          </div>

          <div className="hidden text-right sm:block">
            <p className="text-[9px] uppercase tracking-[0.25em] text-white/25">
              Mission state
            </p>

            <p className="mt-2 flex items-center justify-end gap-2 text-xs font-medium tracking-wide text-emerald-300/80">
              <span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.6)]" />
              NOMINAL
            </p>
          </div>
        </div>

        {/* MISSION SUMMARY */}

        <section className="mb-10 grid gap-px overflow-hidden rounded-2xl border border-white/[0.11] bg-white/[0.08] backdrop-blur-xl md:grid-cols-3">
          <div className="bg-white/[0.035] p-6 transition-colors duration-300 hover:bg-white/[0.055]">
            <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
              Organization
            </p>

            <p className="mt-4 text-lg font-medium tracking-[-0.02em] text-white/90">
              {organization?.name ?? "Loading..."}
            </p>

            <p className="mt-1.5 text-xs text-white/30">
              Mission operator
            </p>
          </div>

          <div className="bg-white/[0.035] p-6 transition-colors duration-300 hover:bg-white/[0.055]">
            <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
              Spacecraft
            </p>

            <p className="mt-4 text-lg font-medium tracking-[-0.02em] text-white/90">
              {satellite?.name ?? "Loading..."}
            </p>

            <p className="mt-1.5 text-xs text-white/30">
              CubeSat reference vehicle
            </p>
          </div>

          <div className="bg-white/[0.035] p-6 transition-colors duration-300 hover:bg-white/[0.055]">
            <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
              Telemetry
            </p>

            <p className="mt-4 text-lg font-medium tracking-[-0.02em] text-white/70">
              NOT STREAMING
            </p>

            <p className="mt-1.5 text-xs text-white/30">
              Simulator not started
            </p>
          </div>
        </section>

        {/* SUBSYSTEMS */}

        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                Spacecraft Health
              </p>

              <h2 className="mt-2 text-xl font-medium tracking-[-0.025em] text-white/90">
                Subsystem Status
              </h2>
            </div>

            <button className="group flex items-center gap-2 border-b border-white/[0.12] pb-1.5 text-[10px] uppercase tracking-[0.16em] text-white/35 transition-all duration-300 hover:border-white/40 hover:text-white/80">
              View telemetry
              <ArrowUpRight
                className="size-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.11] bg-white/[0.08] backdrop-blur-xl sm:grid-cols-2 xl:grid-cols-3">
            {subsystems?.map((subsystem) => {
              const Icon =
                subsystemIcons[
                  subsystem.type as keyof typeof subsystemIcons
                ] ?? Activity;

              return (
                <div
                  key={subsystem._id}
                  className="group relative bg-white/[0.025] p-6 transition-all duration-300 hover:bg-white/[0.055]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex size-10 items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.035] transition-colors duration-300 group-hover:border-cyan-300/20">
                      <Icon className="size-4 text-cyan-300/70 transition-colors group-hover:text-cyan-200" />
                    </div>

                    <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-emerald-300/65">
                      <span className="size-1.5 rounded-full bg-emerald-300/80 shadow-[0_0_8px_rgba(110,231,183,0.5)]" />
                      Nominal
                    </span>
                  </div>

                  <div className="mt-8">
                    <p className="text-[9px] uppercase tracking-[0.22em] text-white/25">
                      {subsystem.type}
                    </p>

                    <h3 className="mt-2 text-base font-medium tracking-[-0.015em] text-white/85">
                      {subsystem.name}
                    </h3>

                    <p className="mt-2.5 max-w-sm text-xs leading-6 text-white/35">
                      {subsystem.description}
                    </p>
                  </div>

                  {/* subtle hover accent */}
                  <div className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-cyan-300/40 transition-all duration-500 group-hover:w-full" />
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}