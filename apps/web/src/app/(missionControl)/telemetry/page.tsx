"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import {
  Activity,
  ArrowLeft,
  Radio,
  Satellite,
  Signal,
  Wifi,
  Cpu,
  Battery,
  Orbit,
} from "lucide-react";

import { useTelemetry } from "@/hooks/use-telemetry";
import { TelemetryChart } from "@/components/telemetry-chart";
import { SubsystemStatus } from "@/components/subsystem-status";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */

type ChartPoint = {
  sequence: number;
  value: number;
};

/* ─────────────────────────────────────────────
   METRIC CARD
───────────────────────────────────────────── */

function MetricCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <div className="group relative overflow-hidden bg-white/[0.025] p-5 transition-colors duration-300 hover:bg-white/[0.045]">
      <div className="flex items-center justify-between">
        <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/25">
          {label}
        </p>

        <span className="size-1 rounded-full bg-cyan-300/20 transition-colors duration-300 group-hover:bg-cyan-300/60" />
      </div>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="font-mono text-xl font-medium tracking-[-0.03em] text-white/85">
          {value}
        </span>

        {unit && (
          <span className="text-[10px] text-white/25">
            {unit}
          </span>
        )}
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-cyan-300/40 transition-all duration-500 group-hover:w-full" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   SECTION HEADING
───────────────────────────────────────────── */

function SectionHeading({
  icon: Icon,
  title,
  code,
}: {
  icon: LucideIcon;
  title: string;
  code: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="flex size-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03]">
        <Icon
          className="size-3.5 text-cyan-300/60"
          strokeWidth={1.6}
        />
      </div>

      <div className="flex items-center gap-2">
        <h2 className="text-sm font-medium tracking-[-0.01em] text-white/80">
          {title}
        </h2>

        <span className="font-mono text-[9px] tracking-[0.15em] text-white/20">
          {code}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TELEMETRY PAGE
───────────────────────────────────────────── */

export default function TelemetryPage() {
  const {
    telemetry,
    history,
    connected,
    error,
  } = useTelemetry();

  const data = telemetry?.telemetry;

  /* ─────────────────────────────────────────────
     HISTORY
  ───────────────────────────────────────────── */

  const batteryVoltageHistory: ChartPoint[] = history.map(
    (packet) => ({
      sequence: packet.sequence,
      value: packet.telemetry.battery_voltage,
    })
  );

  const batteryTemperatureHistory: ChartPoint[] = history.map(
    (packet) => ({
      sequence: packet.sequence,
      value: packet.telemetry.battery_temperature,
    })
  );

  const cpuHistory: ChartPoint[] = history.map(
    (packet) => ({
      sequence: packet.sequence,
      value: packet.telemetry.obc_cpu_utilization,
    })
  );

  const obcTemperatureHistory: ChartPoint[] = history.map(
    (packet) => ({
      sequence: packet.sequence,
      value: packet.telemetry.obc_temperature,
    })
  );

  const attitudeHistory: ChartPoint[] = history.map(
    (packet) => ({
      sequence: packet.sequence,
      value: packet.telemetry.attitude_error,
    })
  );

  const rssiHistory: ChartPoint[] = history.map(
    (packet) => ({
      sequence: packet.sequence,
      value: packet.telemetry.rssi,
    })
  );

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
              <Activity
                className="size-3.5 text-cyan-300/70"
                strokeWidth={1.8}
              />

              <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-cyan-300/55">
                Mission Telemetry
              </span>
            </div>

            <h1 className="text-3xl font-medium tracking-[-0.045em] text-white md:text-4xl">
              Live Telemetry
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/35">
              Real-time spacecraft health and telemetry
              from COSMOS-SAT-01.
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
              {connected
                ? "Telemetry Live"
                : "Telemetry Offline"}
            </span>
          </div>
        </div>

        {/* ─────────────────────────────────────────
            STREAM STATUS
        ───────────────────────────────────────── */}

        <section className="mb-10">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-white/25">
                Stream
              </p>

              <h2 className="mt-1.5 text-sm font-medium text-white/70">
                Telemetry connection
              </h2>
            </div>

            {telemetry && (
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/20">
                Packet #{telemetry.sequence}
              </span>
            )}
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.07] backdrop-blur-xl md:grid-cols-4">

            {/* Link */}

            <div className="bg-white/[0.025] p-5">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03]">
                  <Wifi className="size-3.5 text-emerald-300/60" />
                </div>

                <span className="text-[9px] uppercase tracking-[0.22em] text-white/25">
                  Link
                </span>
              </div>

              <p className="mt-5 text-xs font-medium text-white/70">
                {connected
                  ? "WebSocket Connected"
                  : "Disconnected"}
              </p>
            </div>

            {/* Source */}

            <div className="bg-white/[0.025] p-5">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03]">
                  <Signal className="size-3.5 text-cyan-300/60" />
                </div>

                <span className="text-[9px] uppercase tracking-[0.22em] text-white/25">
                  Source
                </span>
              </div>

              <p className="mt-5 text-xs font-medium capitalize text-white/70">
                {telemetry?.source ?? "--"}
              </p>
            </div>

            {/* Rate */}

            <div className="bg-white/[0.025] p-5">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03]">
                  <Radio className="size-3.5 text-cyan-300/60" />
                </div>

                <span className="text-[9px] uppercase tracking-[0.22em] text-white/25">
                  Rate
                </span>
              </div>

              <p className="mt-5 font-mono text-xs text-white/70">
                1 Hz
              </p>
            </div>

            {/* Spacecraft */}

            <div className="bg-white/[0.025] p-5">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03]">
                  <Satellite className="size-3.5 text-white/45" />
                </div>

                <span className="text-[9px] uppercase tracking-[0.22em] text-white/25">
                  Spacecraft
                </span>
              </div>

              <p className="mt-5 font-mono text-xs tracking-wide text-white/70">
                COSMOS-SAT-01
              </p>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────
            ERROR
        ───────────────────────────────────────── */}

        {error && (
          <div className="mb-8 rounded-xl border border-red-300/[0.12] bg-red-300/[0.025] px-4 py-3.5 text-xs text-red-200/60">
            {error}
          </div>
        )}

        {/* ─────────────────────────────────────────
            WAITING STATE
        ───────────────────────────────────────── */}

        {!data && (
          <div className="flex min-h-72 items-center justify-center rounded-2xl border border-white/[0.09] bg-white/[0.02]">
            <div className="text-center">
              <Activity
                className="mx-auto size-7 animate-pulse text-cyan-300/50"
                strokeWidth={1.5}
              />

              <p className="mt-4 text-sm text-white/45">
                Waiting for spacecraft telemetry
              </p>

              <p className="mt-1.5 text-[11px] text-white/20">
                Connect the COSMOS telemetry service on port 8000.
              </p>
            </div>
          </div>
        )}

        {data && (
          <>

            {/* ─────────────────────────────────────
                SUBSYSTEM MATRIX
            ───────────────────────────────────── */}

            <section className="mb-12">
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-white/25">
                    Spacecraft Health
                  </p>

                  <h2 className="mt-1.5 text-sm font-medium text-white/70">
                    Subsystem Status
                  </h2>
                </div>

                <span className="hidden text-[9px] uppercase tracking-[0.18em] text-white/20 sm:block">
                  06 subsystems
                </span>
              </div>

              <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.07] sm:grid-cols-2 xl:grid-cols-3">
                <SubsystemStatus
                  name="Electrical Power"
                  code="EPS"
                  status="nominal"
                />

                <SubsystemStatus
                  name="On-Board Computer"
                  code="OBC"
                  status="nominal"
                />

                <SubsystemStatus
                  name="Attitude Control"
                  code="ADCS"
                  status="nominal"
                />

                <SubsystemStatus
                  name="Communications"
                  code="COMM"
                  status="nominal"
                />

                <SubsystemStatus
                  name="Payload"
                  code="PAYLOAD"
                  status="nominal"
                />

                <SubsystemStatus
                  name="Thermal"
                  code="THERMAL"
                  status="nominal"
                />
              </div>
            </section>

            {/* ─────────────────────────────────────
                EPS
            ───────────────────────────────────── */}

            <section className="mb-12">
              <SectionHeading
                icon={Battery}
                title="Electrical Power System"
                code="EPS"
              />

              <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-5">
                <MetricCard
                  label="Battery Voltage"
                  value={data.battery_voltage.toFixed(2)}
                  unit="V"
                />

                <MetricCard
                  label="Battery Current"
                  value={data.battery_current.toFixed(2)}
                  unit="A"
                />

                <MetricCard
                  label="Battery Temperature"
                  value={data.battery_temperature.toFixed(1)}
                  unit="°C"
                />

                <MetricCard
                  label="Bus Voltage"
                  value={data.bus_voltage.toFixed(2)}
                  unit="V"
                />

                <MetricCard
                  label="State of Charge"
                  value={data.state_of_charge.toFixed(1)}
                  unit="%"
                />
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <TelemetryChart
                  title="Battery Voltage"
                  unit="V"
                  data={batteryVoltageHistory}
                  domain={[7.2, 7.6]}
                />

                <TelemetryChart
                  title="Battery Temperature"
                  unit="°C"
                  data={batteryTemperatureHistory}
                />
              </div>
            </section>

            {/* ─────────────────────────────────────
                OBC
            ───────────────────────────────────── */}

            <section className="mb-12">
              <SectionHeading
                icon={Cpu}
                title="On-Board Computer"
                code="OBC"
              />

              <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  label="CPU Utilization"
                  value={data.obc_cpu_utilization.toFixed(1)}
                  unit="%"
                />

                <MetricCard
                  label="Memory Utilization"
                  value={data.obc_memory_utilization.toFixed(1)}
                  unit="%"
                />

                <MetricCard
                  label="OBC Temperature"
                  value={data.obc_temperature.toFixed(1)}
                  unit="°C"
                />

                <MetricCard
                  label="Reboots"
                  value={data.reboot_count}
                />
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <TelemetryChart
                  title="CPU Utilization"
                  unit="%"
                  data={cpuHistory}
                  domain={[0, 100]}
                />

                <TelemetryChart
                  title="OBC Temperature"
                  unit="°C"
                  data={obcTemperatureHistory}
                />
              </div>
            </section>

            {/* ─────────────────────────────────────
                ADCS
            ───────────────────────────────────── */}

            <section className="mb-12">
              <SectionHeading
                icon={Orbit}
                title="Attitude Determination & Control"
                code="ADCS"
              />

              <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  label="Angular Velocity X"
                  value={data.angular_velocity_x.toFixed(4)}
                  unit="rad/s"
                />

                <MetricCard
                  label="Angular Velocity Y"
                  value={data.angular_velocity_y.toFixed(4)}
                  unit="rad/s"
                />

                <MetricCard
                  label="Angular Velocity Z"
                  value={data.angular_velocity_z.toFixed(4)}
                  unit="rad/s"
                />

                <MetricCard
                  label="Attitude Error"
                  value={data.attitude_error.toFixed(2)}
                  unit="°"
                />
              </div>

              <div className="mt-4">
                <TelemetryChart
                  title="Attitude Error"
                  unit="°"
                  data={attitudeHistory}
                />
              </div>
            </section>

            {/* ─────────────────────────────────────
                COMM
            ───────────────────────────────────── */}

            <section className="mb-12">
              <SectionHeading
                icon={Radio}
                title="Communications"
                code="COMM"
              />

              <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.07] sm:grid-cols-3">
                <MetricCard
                  label="RSSI"
                  value={data.rssi.toFixed(1)}
                  unit="dBm"
                />

                <MetricCard
                  label="Packet Loss"
                  value={data.packet_loss.toFixed(2)}
                  unit="%"
                />

                <MetricCard
                  label="Downlinks"
                  value={data.downlink_count}
                />
              </div>

              <div className="mt-4">
                <TelemetryChart
                  title="Received Signal Strength"
                  unit="dBm"
                  data={rssiHistory}
                />
              </div>
            </section>

            {/* ─────────────────────────────────────
                FOOTER
            ───────────────────────────────────── */}

            <footer className="border-t border-white/[0.08] pt-5">
              <div className="flex flex-col gap-3 text-[9px] uppercase tracking-[0.18em] text-white/20 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Sequence · #{telemetry?.sequence}
                </span>

                <span>
                  Source · {telemetry?.source}
                </span>

                <span>
                  {telemetry &&
                    new Date(
                      telemetry.timestamp
                    ).toLocaleTimeString()}
                </span>
              </div>
            </footer>

          </>
        )}
      </div>
    </div>
  );
}
