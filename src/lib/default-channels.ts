// =============================================================================
// COSMOS Mission Operations Platform — Default Telemetry Channels
// =============================================================================
// Each subsystem type ships with a set of standard telemetry channels.  When a
// new subsystem is provisioned these defaults are used to bootstrap its channel
// list.  PAYLOAD is intentionally empty — its channels are mission-specific and
// must be configured by the operator.
// =============================================================================

import { SubsystemType } from "./constants";

// ── Channel shape ────────────────────────────────────────────────────────────

export interface DefaultChannel {
  /** Machine-friendly channel identifier (snake_case). */
  name: string;
  /** Engineering unit string, e.g. "V", "°C", "%". */
  unit: string;
  /** Value datatype for storage and display formatting. */
  datatype: "float" | "integer" | "boolean";
  /** Nominal sampling rate in Hz. */
  samplingRate: number;
  /** Lower bound of the expected operating range (if applicable). */
  minValue?: number;
  /** Upper bound of the expected operating range (if applicable). */
  maxValue?: number;
  /** Human-readable description shown in dashboards and tooltips. */
  description: string;
}

// ── Per-subsystem channel tables ─────────────────────────────────────────────

const EPS_CHANNELS: DefaultChannel[] = [
  {
    name: "battery_voltage",
    unit: "V",
    datatype: "float",
    samplingRate: 1,
    minValue: 0,
    maxValue: 8.4,
    description: "Main battery voltage",
  },
  {
    name: "battery_current",
    unit: "A",
    datatype: "float",
    samplingRate: 1,
    minValue: -3,
    maxValue: 5,
    description: "Battery charge/discharge current",
  },
  {
    name: "battery_temperature",
    unit: "°C",
    datatype: "float",
    samplingRate: 0.5,
    minValue: -20,
    maxValue: 60,
    description: "Battery pack temperature",
  },
  {
    name: "bus_voltage",
    unit: "V",
    datatype: "float",
    samplingRate: 1,
    minValue: 0,
    maxValue: 8.4,
    description: "Power bus voltage",
  },
  {
    name: "state_of_charge",
    unit: "%",
    datatype: "float",
    samplingRate: 0.2,
    minValue: 0,
    maxValue: 100,
    description: "Battery state of charge",
  },
];

const THERMAL_CHANNELS: DefaultChannel[] = [
  {
    name: "battery_temp",
    unit: "°C",
    datatype: "float",
    samplingRate: 0.5,
    minValue: -20,
    maxValue: 60,
    description: "Battery thermal sensor",
  },
  {
    name: "obc_temp",
    unit: "°C",
    datatype: "float",
    samplingRate: 0.5,
    minValue: -10,
    maxValue: 85,
    description: "OBC board temperature",
  },
  {
    name: "payload_temp",
    unit: "°C",
    datatype: "float",
    samplingRate: 0.5,
    minValue: -20,
    maxValue: 50,
    description: "Payload bay temperature",
  },
];

const OBC_CHANNELS: DefaultChannel[] = [
  {
    name: "cpu_utilization",
    unit: "%",
    datatype: "float",
    samplingRate: 1,
    minValue: 0,
    maxValue: 100,
    description: "CPU utilization percentage",
  },
  {
    name: "cpu_temperature",
    unit: "°C",
    datatype: "float",
    samplingRate: 0.5,
    minValue: -10,
    maxValue: 85,
    description: "CPU die temperature",
  },
  {
    name: "memory_utilization",
    unit: "%",
    datatype: "float",
    samplingRate: 0.2,
    minValue: 0,
    maxValue: 100,
    description: "RAM utilization percentage",
  },
  {
    name: "reboot_count",
    unit: "count",
    datatype: "integer",
    samplingRate: 0.1,
    minValue: 0,
    maxValue: 1000,
    description: "Total reboot count since deployment",
  },
];

const ADCS_CHANNELS: DefaultChannel[] = [
  {
    name: "angular_velocity_x",
    unit: "°/s",
    datatype: "float",
    samplingRate: 2,
    minValue: -360,
    maxValue: 360,
    description: "X-axis angular velocity",
  },
  {
    name: "angular_velocity_y",
    unit: "°/s",
    datatype: "float",
    samplingRate: 2,
    minValue: -360,
    maxValue: 360,
    description: "Y-axis angular velocity",
  },
  {
    name: "angular_velocity_z",
    unit: "°/s",
    datatype: "float",
    samplingRate: 2,
    minValue: -360,
    maxValue: 360,
    description: "Z-axis angular velocity",
  },
  {
    name: "attitude_error",
    unit: "°",
    datatype: "float",
    samplingRate: 1,
    minValue: 0,
    maxValue: 180,
    description: "Pointing error magnitude",
  },
  {
    name: "reaction_wheel_speed",
    unit: "RPM",
    datatype: "float",
    samplingRate: 1,
    minValue: -8000,
    maxValue: 8000,
    description: "Reaction wheel angular speed",
  },
];

const COMM_CHANNELS: DefaultChannel[] = [
  {
    name: "rssi",
    unit: "dBm",
    datatype: "float",
    samplingRate: 0.5,
    minValue: -120,
    maxValue: 0,
    description: "Received signal strength indicator",
  },
  {
    name: "packet_loss",
    unit: "%",
    datatype: "float",
    samplingRate: 0.2,
    minValue: 0,
    maxValue: 100,
    description: "Packet loss ratio",
  },
  {
    name: "signal_strength",
    unit: "dBm",
    datatype: "float",
    samplingRate: 0.5,
    minValue: -120,
    maxValue: 0,
    description: "Downlink signal strength",
  },
  {
    name: "uplink_count",
    unit: "count",
    datatype: "integer",
    samplingRate: 0.1,
    description: "Total uplink packets received",
  },
  {
    name: "downlink_count",
    unit: "count",
    datatype: "integer",
    samplingRate: 0.1,
    description: "Total downlink packets sent",
  },
];

// PAYLOAD channels are intentionally empty — they are mission-specific and
// must be configured by the operator when setting up the payload subsystem.
const PAYLOAD_CHANNELS: DefaultChannel[] = [];

// ── Lookup map ───────────────────────────────────────────────────────────────

const CHANNEL_MAP: Record<SubsystemType, DefaultChannel[]> = {
  EPS: EPS_CHANNELS,
  ADCS: ADCS_CHANNELS,
  OBC: OBC_CHANNELS,
  COMM: COMM_CHANNELS,
  PAYLOAD: PAYLOAD_CHANNELS,
  THERMAL: THERMAL_CHANNELS,
};

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns the default telemetry channel definitions for a given subsystem type.
 *
 * The returned array is a shallow copy so callers can safely mutate it without
 * affecting the canonical definitions.
 */
export function getDefaultChannels(subsystemType: SubsystemType): DefaultChannel[] {
  return [...(CHANNEL_MAP[subsystemType] ?? [])];
}
