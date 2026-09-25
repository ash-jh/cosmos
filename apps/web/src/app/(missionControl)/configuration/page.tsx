"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

import {
  Settings,
  Satellite,
  CheckCircle2,
  ArrowLeft,
  Radio,
  Cpu,
  Building2,
  Orbit,
} from "lucide-react";

export default function ConfigurationPage() {
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
    <div className="quicksand min-h-[calc(100vh-4rem)] bg-[#05070d] px-5 py-8 text-white sm:px-7 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">

        {/* BACK NAVIGATION */}

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

        {/* HEADER */}

        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Settings
                className="size-3.5 text-cyan-300/65"
                strokeWidth={1.7}
              />

              <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-cyan-300/55">
                Mission Configuration
              </span>
            </div>

            <h1 className="text-3xl font-medium tracking-[-0.045em] text-white md:text-4xl">
              Configuration
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/35">
              View the spacecraft model, mission parameters, and
              subsystem configuration currently used by COSMOS.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full border border-cyan-300/[0.09] bg-cyan-300/[0.02] px-3.5 py-2 lg:self-auto">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-300/20" />
              <span className="relative size-1.5 rounded-full bg-cyan-300/70 shadow-[0_0_8px_rgba(103,232,249,0.35)]" />
            </span>

            <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-cyan-300/60">
              Configuration Loaded
            </span>
          </div>
        </div>

        {/* MISSION */}

        <section className="mb-8 overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.025]">
          <div className="border-b border-white/[0.07] px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035]">
                <Orbit
                  className="size-4 text-cyan-300/65"
                  strokeWidth={1.6}
                />
              </div>

              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.24em] text-white/25">
                  Mission
                </p>

                <h2 className="mt-1 text-sm font-medium text-white/80">
                  {mission?.name ?? "Loading..."}
                </h2>
              </div>
            </div>
          </div>

          <div className="grid gap-px bg-white/[0.07] md:grid-cols-2">
            <div className="bg-white/[0.02] p-6 transition-colors duration-300 hover:bg-white/[0.04]">
              <div className="flex items-center gap-2">
                <Building2 className="size-3.5 text-white/25" />
                <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/25">
                  Organization
                </p>
              </div>

              <p className="mt-4 text-base font-medium tracking-[-0.01em] text-white/80">
                {organization?.name ?? "Loading..."}
              </p>

              <p className="mt-1.5 text-xs text-white/25">
                Mission operator
              </p>
            </div>

            <div className="bg-white/[0.02] p-6 transition-colors duration-300 hover:bg-white/[0.04]">
              <div className="flex items-center gap-2">
                <Radio className="size-3.5 text-white/25" />
                <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/25">
                  Mission Type
                </p>
              </div>

              <p className="mt-4 text-base font-medium tracking-[-0.01em] text-white/80">
                {mission?.missionType ?? "Loading..."}
              </p>

              <p className="mt-1.5 text-xs text-white/25">
                Configured mission profile
              </p>
            </div>
          </div>
        </section>

        {/* SPACECRAFT */}

        <section className="mb-8 overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.025]">
          <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl border border-cyan-300/[0.10] bg-cyan-300/[0.035]">
                <Satellite
                  className="size-4 text-cyan-300/70"
                  strokeWidth={1.6}
                />
              </div>

              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.24em] text-white/25">
                  Spacecraft
                </p>

                <h2 className="mt-1 text-sm font-medium text-white/80">
                  {satellite?.name ?? "Loading..."}
                </h2>
              </div>
            </div>

            <span className="hidden rounded-md border border-white/[0.08] bg-white/[0.025] px-2 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-white/20 sm:block">
              COSMOS-SAT-01
            </span>
          </div>

          <div className="grid gap-px bg-white/[0.07] md:grid-cols-2">
            <div className="bg-white/[0.02] p-6">
              <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/25">
                Spacecraft ID
              </p>

              <p className="mt-4 truncate font-mono text-xs text-white/45">
                {satellite?._id ?? "Loading..."}
              </p>

              <p className="mt-2 text-xs text-white/20">
                Registered spacecraft identifier
              </p>
            </div>

            <div className="bg-white/[0.02] p-6">
              <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/25">
                Status
              </p>

              <div className="mt-4 flex items-center gap-2">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-300/20" />
                  <span className="relative size-1.5 rounded-full bg-emerald-300/75" />
                </span>

                <span className="text-sm font-medium text-emerald-300/70">
                  {satellite?.status ?? "Loading..."}
                </span>
              </div>

              <p className="mt-2 text-xs text-white/20">
                Current spacecraft state
              </p>
            </div>
          </div>
        </section>

        {/* SUBSYSTEMS */}

        <section className="overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.025]">
          <div className="flex items-end justify-between border-b border-white/[0.07] px-6 py-5">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.24em] text-white/25">
                Spacecraft Systems
              </p>

              <h2 className="mt-1.5 text-sm font-medium text-white/75">
                Subsystem Configuration
              </h2>
            </div>

            <span className="hidden text-[9px] uppercase tracking-[0.18em] text-white/20 sm:block">
              {subsystems?.length
                ? `${subsystems.length.toString().padStart(2, "0")} systems`
                : "Loading"}
            </span>
          </div>

          <div className="grid gap-px bg-white/[0.07] md:grid-cols-2">
            {subsystems?.map((subsystem) => (
              <div
                key={subsystem._id}
                className="group relative bg-white/[0.02] p-6 transition-colors duration-300 hover:bg-white/[0.045]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-cyan-300/55">
                      {subsystem.type}
                    </span>

                    <h3 className="mt-2 text-sm font-medium text-white/75">
                      {subsystem.name}
                    </h3>

                    <p className="mt-2 max-w-md text-xs leading-6 text-white/30">
                      {subsystem.description}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 rounded-full border border-emerald-300/[0.08] bg-emerald-300/[0.02] px-2.5 py-1">
                    <CheckCircle2
                      className="size-3 text-emerald-300/60"
                      strokeWidth={1.7}
                    />

                    <span className="text-[8px] font-medium uppercase tracking-[0.16em] text-emerald-300/55">
                      Active
                    </span>
                  </div>
                </div>

                <div className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-cyan-300/35 transition-all duration-500 group-hover:w-full" />
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}

        <footer className="mt-10 border-t border-white/[0.08] pt-5">
          <div className="flex flex-col gap-3 text-[9px] uppercase tracking-[0.18em] text-white/20 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Configuration · COSMOS-SAT-01
            </span>

            <span>
              Systems · {subsystems?.length?.toString().padStart(2, "0") ?? "--"}
            </span>

            <span>
              Mission · {mission?.missionType ?? "—"}
            </span>
          </div>
        </footer>

      </div>
    </div>
  );
}