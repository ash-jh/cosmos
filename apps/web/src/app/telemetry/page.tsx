"use client";

import {
  Activity,
  Radio,
  Satellite,
  Signal,
  Wifi,
} from "lucide-react";

import { useTelemetry } from "@/hooks/use-telemetry";
import { TelemetryChart } from "@/components/telemetry-chart";
import { SubsystemStatus } from "@/components/subsystem-status";


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
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
      <p className="text-[10px] uppercase tracking-widest text-zinc-600">
        {label}
      </p>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight text-zinc-100">
          {value}
        </span>

        {unit && (
          <span className="text-xs text-zinc-500">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}


export default function TelemetryPage() {
  const {
    telemetry,
    history,
    connected,
    error,
  } = useTelemetry();

  const data = telemetry?.telemetry;

  const batteryVoltageHistory = history.map(
    (packet) => ({
      sequence: packet.sequence,
      value: packet.telemetry.battery_voltage,
    })
  );

  const batteryTemperatureHistory = history.map(
    (packet) => ({
      sequence: packet.sequence,
      value: packet.telemetry.battery_temperature,
    })
  );

  const cpuHistory = history.map(
    (packet) => ({
      sequence: packet.sequence,
      value: packet.telemetry.obc_cpu_utilization,
    })
  );

  const obcTemperatureHistory = history.map(
    (packet) => ({
      sequence: packet.sequence,
      value: packet.telemetry.obc_temperature,
    })
  );

  const attitudeHistory = history.map(
    (packet) => ({
      sequence: packet.sequence,
      value: packet.telemetry.attitude_error,
    })
  );

  const rssiHistory = history.map(
    (packet) => ({
      sequence: packet.sequence,
      value: packet.telemetry.rssi,
    })
  );

  return (
    <div className="space-y-8 p-8">

      {/* ───────────────── HEADER ───────────────── */}

      <div className="flex items-start justify-between">

        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Satellite className="size-3.5" />
            RVCE CubeSat-01
          </div>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Live Telemetry
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Real-time spacecraft health and telemetry stream.
          </p>
        </div>

        <div
          className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
            connected
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/20 bg-red-500/10 text-red-400"
          }`}
        >
          <span
            className={`size-2 rounded-full ${
              connected
                ? "animate-pulse bg-emerald-400"
                : "bg-red-400"
            }`}
          />

          {connected
            ? "TELEMETRY LIVE"
            : "TELEMETRY OFFLINE"}
        </div>
      </div>


      {/* ───────────────── CONNECTION BAR ───────────────── */}

      <div className="flex flex-wrap items-center gap-6 rounded-xl border border-zinc-800 bg-zinc-950/50 px-5 py-4">

        <div className="flex items-center gap-2">
          <Wifi className="size-4 text-emerald-400" />

          <span className="text-xs text-zinc-400">
            WebSocket
          </span>

          <span className="text-xs text-emerald-400">
            Connected
          </span>
        </div>

        <div className="h-4 w-px bg-zinc-800" />

        <div className="flex items-center gap-2">
          <Signal className="size-4 text-cyan-400" />

          <span className="text-xs text-zinc-400">
            Source
          </span>

          <span className="text-xs text-zinc-200">
            Simulator
          </span>
        </div>

        <div className="h-4 w-px bg-zinc-800" />

        <div className="flex items-center gap-2">
          <Activity className="size-4 text-cyan-400" />

          <span className="text-xs text-zinc-400">
            Packet rate
          </span>

          <span className="text-xs text-zinc-200">
            1 Hz
          </span>
        </div>

        {telemetry && (
          <>
            <div className="h-4 w-px bg-zinc-800" />

            <div className="text-xs text-zinc-500">
              Packet #{telemetry.sequence}
            </div>
          </>
        )}

      </div>


      {/* ───────────────── ERROR ───────────────── */}

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
          {error}
        </div>
      )}


      {/* ───────────────── WAITING ───────────────── */}

      {!data && (
        <div className="flex min-h-72 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/40">
          <div className="text-center">

            <Activity className="mx-auto size-8 animate-pulse text-cyan-400" />

            <p className="mt-4 text-sm text-zinc-400">
              Waiting for spacecraft telemetry...
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Connect the COSMOS telemetry service on port 8000.
            </p>

          </div>
        </div>
      )}


      {data && (
        <>

          {/* ───────────────── SUBSYSTEMS ───────────────── */}

          <section>
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-widest text-zinc-600">
                Spacecraft Health
              </p>

              <h2 className="mt-1 text-sm font-medium text-zinc-200">
                Subsystem Status
              </h2>
            </div>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">

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


          {/* ───────────────── EPS ───────────────── */}

          <section>

            <div className="mb-4 flex items-center gap-2">
              <Radio className="size-4 text-cyan-400" />

              <h2 className="text-sm font-medium">
                Electrical Power System
              </h2>

              <span className="text-xs text-zinc-600">
                EPS
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">

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


          {/* ───────────────── OBC ───────────────── */}

          <section>

            <div className="mb-4 flex items-center gap-2">
              <Activity className="size-4 text-cyan-400" />

              <h2 className="text-sm font-medium">
                On-Board Computer
              </h2>

              <span className="text-xs text-zinc-600">
                OBC
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

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


          {/* ───────────────── ADCS ───────────────── */}

          <section>

            <div className="mb-4 flex items-center gap-2">
              <Satellite className="size-4 text-cyan-400" />

              <h2 className="text-sm font-medium">
                Attitude Determination & Control
              </h2>

              <span className="text-xs text-zinc-600">
                ADCS
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

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


          {/* ───────────────── COMM ───────────────── */}

          <section>

            <div className="mb-4 flex items-center gap-2">
              <Signal className="size-4 text-cyan-400" />

              <h2 className="text-sm font-medium">
                Communications
              </h2>

              <span className="text-xs text-zinc-600">
                COMM
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">

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


          {/* ───────────────── FOOTER ───────────────── */}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 pt-4 text-xs text-zinc-600">

            <span>
              Sequence #{telemetry?.sequence}
            </span>

            <span>
              Source: {telemetry?.source}
            </span>

            <span>
              {telemetry &&
                new Date(
                  telemetry.timestamp
                ).toLocaleTimeString()}
            </span>

          </div>

        </>
      )}

    </div>
  );
}