"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

import {
  Settings,
  Satellite,
  CheckCircle2,
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
    <div className="p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cyan-400">
            <Settings className="size-3.5" />
            Configuration
          </div>

          <h1 className="text-2xl font-semibold">
            Mission Configuration
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Configure the spacecraft model used by COSMOS.
          </p>
        </div>

        {/* MISSION */}

        <section className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900/40">
          <div className="border-b border-zinc-800 p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-600">
              Mission
            </p>

            <h2 className="mt-1 font-medium">
              {mission?.name ?? "Loading..."}
            </h2>
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-2">

            <div>
              <label className="text-xs text-zinc-500">
                Organization
              </label>

              <div className="mt-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm">
                {organization?.name ?? "Loading..."}
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-500">
                Mission Type
              </label>

              <div className="mt-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm">
                {mission?.missionType ?? "Loading..."}
              </div>
            </div>

          </div>
        </section>

        {/* SPACECRAFT */}

        <section className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900/40">
          <div className="flex items-center gap-3 border-b border-zinc-800 p-5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-cyan-400/10">
              <Satellite className="size-4 text-cyan-400" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-600">
                Spacecraft
              </p>

              <h2 className="mt-1 font-medium">
                {satellite?.name ?? "Loading..."}
              </h2>
            </div>
          </div>

          <div className="p-5">
            <div className="grid gap-4 md:grid-cols-2">

              <div>
                <label className="text-xs text-zinc-500">
                  Spacecraft ID
                </label>

                <div className="mt-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 font-mono text-xs text-zinc-400">
                  {satellite?._id ?? "Loading..."}
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-500">
                  Status
                </label>

                <div className="mt-2 flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm">
                  <CheckCircle2 className="size-4 text-emerald-400" />
                  {satellite?.status ?? "Loading..."}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SUBSYSTEMS */}

        <section className="rounded-xl border border-zinc-800 bg-zinc-900/40">
          <div className="border-b border-zinc-800 p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-600">
              Subsystems
            </p>

            <h2 className="mt-1 font-medium">
              Spacecraft Configuration
            </h2>
          </div>

          <div className="divide-y divide-zinc-800">
            {subsystems?.map((subsystem) => (
              <div
                key={subsystem._id}
                className="flex items-center justify-between p-5"
              >
                <div>
                  <p className="text-xs uppercase tracking-wider text-cyan-400">
                    {subsystem.type}
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {subsystem.name}
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    {subsystem.description}
                  </p>
                </div>

                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs text-emerald-400">
                  ACTIVE
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}