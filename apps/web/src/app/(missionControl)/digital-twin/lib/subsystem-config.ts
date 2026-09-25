// ─────────────────────────────────────────────────────────────
// COSMOS Digital Twin — Subsystem Configuration
// Central data model for subsystems, telemetry, faults, and
// causal propagation chains.
// ─────────────────────────────────────────────────────────────

import type { TelemetryData } from "@/hooks/use-telemetry";

// ── Types ────────────────────────────────────────────────────

export type SubsystemId =
  | "EPS"
  | "OBC"
  | "ADCS"
  | "COMM"
  | "THERMAL"
  | "PAYLOAD";

export type ComponentId =
  | "battery"
  | "solar_panel_left"
  | "solar_panel_right"
  | "power_bus"
  | "obc_board"
  | "reaction_wheel"
  | "imu"
  | "radio"
  | "antenna"
  | "thermal_sensor"
  | "payload_module"
  | "cubesat_frame";

export type HealthState = "nominal" | "warning" | "critical";

export type FaultId =
  | "battery_degradation"
  | "battery_overheating"
  | "bus_undervoltage"
  | "cpu_overload"
  | "obc_overheating"
  | "adcs_instability"
  | "communication_degradation";

export type MissionState =
  | "NOMINAL"
  | "ANOMALY_DETECTED"
  | "INVESTIGATING"
  | "FAULT_ISOLATED"
  | "INTERVENTION"
  | "RECOVERY"
  | "VERIFICATION"
  | "RECOVERED"
  | "RECOVERY_FAILED";

// ── Telemetry Channel ────────────────────────────────────────

export interface TelemetryChannel {
  key: keyof TelemetryData;
  label: string;
  unit: string;
  nominalRange: [number, number];
  warningRange: [number, number];
  format?: (v: number) => string;
}

// ── Subsystem Definition ─────────────────────────────────────

export interface SubsystemConfig {
  id: SubsystemId;
  name: string;
  description: string;
  components: ComponentId[];
  channels: TelemetryChannel[];
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
}

// ── Fault Definition ─────────────────────────────────────────

export interface FaultScenario {
  id: FaultId;
  name: string;
  rootSubsystem: SubsystemId;
  affectedSubsystems: SubsystemId[];
  affectedComponents: ComponentId[];
  telemetryEffects: {
    channel: keyof TelemetryData;
    direction: "up" | "down";
    description: string;
  }[];
  possibleCauses: string[];
  correctionActions: CorrectionAction[];
  propagationChain: SubsystemId[];
}

export interface CorrectionAction {
  id: string;
  label: string;
  description: string;
  successProbability: number; // 0–1
  telemetryRecovery: Partial<Record<keyof TelemetryData, number>>;
}

// ── Camera views ─────────────────────────────────────────────

export const DEFAULT_CAMERA_POSITION: [number, number, number] = [6, 4, 6];
export const DEFAULT_CAMERA_TARGET: [number, number, number] = [0, 0, 0];

// ── Subsystem Configs ────────────────────────────────────────

export const SUBSYSTEM_CONFIGS: Record<SubsystemId, SubsystemConfig> = {
  EPS: {
    id: "EPS",
    name: "Electrical Power System",
    description: "Battery, solar panels, and power distribution.",
    components: ["battery", "solar_panel_left", "solar_panel_right", "power_bus"],
    channels: [
      {
        key: "battery_voltage",
        label: "Battery Voltage",
        unit: "V",
        nominalRange: [7.2, 8.4],
        warningRange: [6.8, 7.2],
      },
      {
        key: "battery_current",
        label: "Battery Current",
        unit: "A",
        nominalRange: [1.5, 2.1],
        warningRange: [2.1, 2.5],
      },
      {
        key: "bus_voltage",
        label: "Bus Voltage",
        unit: "V",
        nominalRange: [7.1, 8.3],
        warningRange: [6.6, 7.1],
      },
      {
        key: "state_of_charge",
        label: "State of Charge",
        unit: "%",
        nominalRange: [60, 100],
        warningRange: [40, 60],
        format: (v) => `${v.toFixed(1)}`,
      },
    ],
    cameraPosition: [3, 0.5, 3],
    cameraTarget: [0, -0.3, 0],
  },

  OBC: {
    id: "OBC",
    name: "On-Board Computer",
    description: "Central processing, memory, and compute management.",
    components: ["obc_board"],
    channels: [
      {
        key: "obc_cpu_utilization",
        label: "CPU Utilization",
        unit: "%",
        nominalRange: [10, 55],
        warningRange: [55, 75],
      },
      {
        key: "obc_memory_utilization",
        label: "Memory Utilization",
        unit: "%",
        nominalRange: [20, 55],
        warningRange: [55, 70],
      },
      {
        key: "obc_temperature",
        label: "OBC Temperature",
        unit: "°C",
        nominalRange: [30, 45],
        warningRange: [45, 55],
      },
      {
        key: "reboot_count",
        label: "Reboot Count",
        unit: "",
        nominalRange: [0, 2],
        warningRange: [2, 5],
        format: (v) => `${Math.round(v)}`,
      },
    ],
    cameraPosition: [2.5, 1.5, 2.5],
    cameraTarget: [0, 0.2, 0],
  },

  ADCS: {
    id: "ADCS",
    name: "Attitude Determination & Control",
    description: "Reaction wheels, IMU, and attitude sensors.",
    components: ["reaction_wheel", "imu"],
    channels: [
      {
        key: "angular_velocity_x",
        label: "Angular Velocity X",
        unit: "°/s",
        nominalRange: [-0.5, 0.5],
        warningRange: [-1.5, 1.5],
      },
      {
        key: "angular_velocity_y",
        label: "Angular Velocity Y",
        unit: "°/s",
        nominalRange: [-0.5, 0.5],
        warningRange: [-1.5, 1.5],
      },
      {
        key: "angular_velocity_z",
        label: "Angular Velocity Z",
        unit: "°/s",
        nominalRange: [-0.5, 0.5],
        warningRange: [-1.5, 1.5],
      },
      {
        key: "attitude_error",
        label: "Attitude Error",
        unit: "°",
        nominalRange: [0, 0.5],
        warningRange: [0.5, 1.5],
      },
      {
        key: "reaction_wheel_speed",
        label: "Reaction Wheel Speed",
        unit: "RPM",
        nominalRange: [1500, 2000],
        warningRange: [2000, 2500],
      },
    ],
    cameraPosition: [2, -1, 3],
    cameraTarget: [0, -0.7, 0],
  },

  COMM: {
    id: "COMM",
    name: "Communications",
    description: "Radio transceiver and antenna system.",
    components: ["radio", "antenna"],
    channels: [
      {
        key: "rssi",
        label: "RSSI",
        unit: "dBm",
        nominalRange: [-75, -55],
        warningRange: [-85, -75],
      },
      {
        key: "packet_loss",
        label: "Packet Loss",
        unit: "%",
        nominalRange: [0, 3],
        warningRange: [3, 8],
      },
      {
        key: "uplink_count",
        label: "Uplink Count",
        unit: "",
        nominalRange: [0, 10000],
        warningRange: [0, 10000],
        format: (v) => `${Math.round(v)}`,
      },
      {
        key: "downlink_count",
        label: "Downlink Count",
        unit: "",
        nominalRange: [0, 10000],
        warningRange: [0, 10000],
        format: (v) => `${Math.round(v)}`,
      },
    ],
    cameraPosition: [0, 3, 4],
    cameraTarget: [0, 0.8, 0],
  },

  THERMAL: {
    id: "THERMAL",
    name: "Thermal Management",
    description: "Temperature sensors and thermal control.",
    components: ["thermal_sensor"],
    channels: [
      {
        key: "battery_temperature",
        label: "Battery Temperature",
        unit: "°C",
        nominalRange: [20, 35],
        warningRange: [35, 45],
      },
      {
        key: "obc_temperature",
        label: "OBC Temperature",
        unit: "°C",
        nominalRange: [30, 45],
        warningRange: [45, 55],
      },
      {
        key: "payload_temperature",
        label: "Payload Temperature",
        unit: "°C",
        nominalRange: [18, 30],
        warningRange: [30, 40],
      },
    ],
    cameraPosition: [4, 2, 2],
    cameraTarget: [0, 0, 0],
  },

  PAYLOAD: {
    id: "PAYLOAD",
    name: "Payload Module",
    description: "Scientific instrument and sensor package.",
    components: ["payload_module"],
    channels: [
      {
        key: "payload_temperature",
        label: "Payload Temperature",
        unit: "°C",
        nominalRange: [18, 30],
        warningRange: [30, 40],
      },
    ],
    cameraPosition: [2, -1.5, 3],
    cameraTarget: [0, -1, 0],
  },
};

// ── Fault Scenarios ──────────────────────────────────────────

export const FAULT_SCENARIOS: Record<FaultId, FaultScenario> = {
  battery_degradation: {
    id: "battery_degradation",
    name: "Battery Degradation",
    rootSubsystem: "EPS",
    affectedSubsystems: ["EPS", "OBC", "PAYLOAD"],
    affectedComponents: ["battery", "power_bus", "obc_board", "payload_module"],
    telemetryEffects: [
      { channel: "battery_voltage", direction: "down", description: "Battery voltage below expected range" },
      { channel: "battery_current", direction: "up", description: "Battery current elevated" },
      { channel: "bus_voltage", direction: "down", description: "Bus voltage declining" },
    ],
    possibleCauses: [
      "Battery cell degradation",
      "Power regulation fault",
      "Excessive load anomaly",
    ],
    correctionActions: [
      {
        id: "reduce_payload",
        label: "Reduce Payload Load",
        description: "Reduce simulated payload power consumption and evaluate whether spacecraft bus voltage recovers.",
        successProbability: 0.75,
        telemetryRecovery: { battery_voltage: 7.35, bus_voltage: 7.25, battery_current: 1.85 },
      },
      {
        id: "rebalance_power",
        label: "Rebalance Power Allocation",
        description: "Redistribute power across subsystems to reduce battery stress.",
        successProbability: 0.60,
        telemetryRecovery: { battery_voltage: 7.20, bus_voltage: 7.10, battery_current: 1.90 },
      },
      {
        id: "safe_mode",
        label: "Enter Safe Mode",
        description: "Put the spacecraft into minimal-power safe mode to preserve battery.",
        successProbability: 0.90,
        telemetryRecovery: { battery_voltage: 7.42, bus_voltage: 7.32, battery_current: 1.80 },
      },
    ],
    propagationChain: ["EPS", "OBC", "PAYLOAD"],
  },

  battery_overheating: {
    id: "battery_overheating",
    name: "Battery Overheating",
    rootSubsystem: "EPS",
    affectedSubsystems: ["EPS", "THERMAL"],
    affectedComponents: ["battery", "thermal_sensor"],
    telemetryEffects: [
      { channel: "battery_temperature", direction: "up", description: "Battery temperature significantly elevated" },
      { channel: "payload_temperature", direction: "up", description: "Payload temperature rising" },
    ],
    possibleCauses: [
      "Battery thermal runaway",
      "Cooling system failure",
      "Environmental thermal load",
    ],
    correctionActions: [
      {
        id: "reduce_charge_rate",
        label: "Reduce Charge Rate",
        description: "Lower solar charge rate to reduce battery thermal load.",
        successProbability: 0.70,
        telemetryRecovery: { battery_temperature: 33.0, payload_temperature: 24.0 },
      },
      {
        id: "activate_heater_bypass",
        label: "Activate Thermal Bypass",
        description: "Route excess heat away from the battery.",
        successProbability: 0.80,
        telemetryRecovery: { battery_temperature: 31.5, payload_temperature: 22.0 },
      },
    ],
    propagationChain: ["EPS", "THERMAL"],
  },

  bus_undervoltage: {
    id: "bus_undervoltage",
    name: "Bus Undervoltage",
    rootSubsystem: "EPS",
    affectedSubsystems: ["EPS", "OBC", "PAYLOAD"],
    affectedComponents: ["power_bus", "battery", "obc_board"],
    telemetryEffects: [
      { channel: "battery_voltage", direction: "down", description: "Battery voltage dropping" },
      { channel: "bus_voltage", direction: "down", description: "Bus voltage significantly depressed" },
    ],
    possibleCauses: [
      "Power bus regulator failure",
      "Battery degradation",
      "Load exceeds power budget",
    ],
    correctionActions: [
      {
        id: "shed_nonessential",
        label: "Shed Non-Essential Loads",
        description: "Disable non-critical subsystems to reduce bus demand.",
        successProbability: 0.80,
        telemetryRecovery: { battery_voltage: 7.30, bus_voltage: 7.20 },
      },
      {
        id: "reset_eps",
        label: "Reset EPS Controller",
        description: "Power-cycle the EPS controller to restore regulation.",
        successProbability: 0.65,
        telemetryRecovery: { battery_voltage: 7.42, bus_voltage: 7.32 },
      },
    ],
    propagationChain: ["EPS", "OBC", "PAYLOAD"],
  },

  cpu_overload: {
    id: "cpu_overload",
    name: "OBC CPU Overload",
    rootSubsystem: "OBC",
    affectedSubsystems: ["OBC", "THERMAL"],
    affectedComponents: ["obc_board", "thermal_sensor"],
    telemetryEffects: [
      { channel: "obc_cpu_utilization", direction: "up", description: "CPU utilization critically elevated" },
      { channel: "obc_memory_utilization", direction: "up", description: "Memory utilization elevated" },
      { channel: "obc_temperature", direction: "up", description: "OBC temperature rising" },
    ],
    possibleCauses: [
      "Runaway process",
      "Sensor polling loop",
      "Payload data overflow",
    ],
    correctionActions: [
      {
        id: "kill_processes",
        label: "Kill Non-Essential Processes",
        description: "Terminate background tasks to free CPU resources.",
        successProbability: 0.85,
        telemetryRecovery: { obc_cpu_utilization: 35, obc_memory_utilization: 44, obc_temperature: 41 },
      },
      {
        id: "reboot_obc",
        label: "Reboot OBC",
        description: "Perform a controlled OBC restart.",
        successProbability: 0.90,
        telemetryRecovery: { obc_cpu_utilization: 30, obc_memory_utilization: 40, obc_temperature: 39 },
      },
    ],
    propagationChain: ["OBC", "THERMAL"],
  },

  obc_overheating: {
    id: "obc_overheating",
    name: "OBC Overheating",
    rootSubsystem: "OBC",
    affectedSubsystems: ["OBC", "THERMAL"],
    affectedComponents: ["obc_board", "thermal_sensor"],
    telemetryEffects: [
      { channel: "obc_temperature", direction: "up", description: "OBC temperature significantly elevated" },
    ],
    possibleCauses: [
      "Thermal control failure",
      "Environmental thermal load",
      "Heat sink degradation",
    ],
    correctionActions: [
      {
        id: "reduce_clock",
        label: "Reduce Clock Speed",
        description: "Lower OBC processing speed to reduce thermal output.",
        successProbability: 0.75,
        telemetryRecovery: { obc_temperature: 43 },
      },
      {
        id: "activate_cooling",
        label: "Activate Passive Cooling",
        description: "Orient spacecraft for maximum thermal radiation.",
        successProbability: 0.65,
        telemetryRecovery: { obc_temperature: 40 },
      },
    ],
    propagationChain: ["OBC", "THERMAL"],
  },

  adcs_instability: {
    id: "adcs_instability",
    name: "ADCS Instability",
    rootSubsystem: "ADCS",
    affectedSubsystems: ["ADCS"],
    affectedComponents: ["reaction_wheel", "imu"],
    telemetryEffects: [
      { channel: "angular_velocity_x", direction: "up", description: "Angular velocity X elevated" },
      { channel: "angular_velocity_y", direction: "up", description: "Angular velocity Y elevated" },
      { channel: "attitude_error", direction: "up", description: "Attitude error increasing" },
      { channel: "reaction_wheel_speed", direction: "up", description: "Reaction wheel speed abnormal" },
    ],
    possibleCauses: [
      "Reaction wheel desaturation needed",
      "IMU sensor drift",
      "Control algorithm divergence",
    ],
    correctionActions: [
      {
        id: "desaturate_wheels",
        label: "Desaturate Reaction Wheels",
        description: "Use magnetorquers to offload reaction wheel momentum.",
        successProbability: 0.85,
        telemetryRecovery: { angular_velocity_x: 0.1, angular_velocity_y: 0.08, attitude_error: 0.2, reaction_wheel_speed: 1750 },
      },
      {
        id: "reset_adcs",
        label: "Reset ADCS Controller",
        description: "Restart the attitude control system and re-initialize.",
        successProbability: 0.70,
        telemetryRecovery: { angular_velocity_x: 0.05, angular_velocity_y: 0.05, attitude_error: 0.15, reaction_wheel_speed: 1700 },
      },
    ],
    propagationChain: ["ADCS"],
  },

  communication_degradation: {
    id: "communication_degradation",
    name: "Communication Degradation",
    rootSubsystem: "COMM",
    affectedSubsystems: ["COMM"],
    affectedComponents: ["radio", "antenna"],
    telemetryEffects: [
      { channel: "rssi", direction: "down", description: "Signal strength significantly reduced" },
      { channel: "packet_loss", direction: "up", description: "Packet loss elevated" },
    ],
    possibleCauses: [
      "Antenna misalignment",
      "RF interference",
      "Transceiver degradation",
    ],
    correctionActions: [
      {
        id: "realign_antenna",
        label: "Realign Antenna",
        description: "Adjust spacecraft attitude to improve antenna pointing.",
        successProbability: 0.80,
        telemetryRecovery: { rssi: -67, packet_loss: 1.2 },
      },
      {
        id: "switch_frequency",
        label: "Switch Frequency Band",
        description: "Change to backup frequency to avoid interference.",
        successProbability: 0.70,
        telemetryRecovery: { rssi: -65, packet_loss: 0.9 },
      },
    ],
    propagationChain: ["COMM"],
  },
};

// ── Component → Subsystem mapping ────────────────────────────

export const COMPONENT_SUBSYSTEM_MAP: Record<ComponentId, SubsystemId> = {
  battery: "EPS",
  solar_panel_left: "EPS",
  solar_panel_right: "EPS",
  power_bus: "EPS",
  obc_board: "OBC",
  reaction_wheel: "ADCS",
  imu: "ADCS",
  radio: "COMM",
  antenna: "COMM",
  thermal_sensor: "THERMAL",
  payload_module: "PAYLOAD",
  cubesat_frame: "EPS", // frame is structural
};

export const COMPONENT_LABELS: Record<ComponentId, string> = {
  battery: "Battery Pack",
  solar_panel_left: "Solar Panel (Port)",
  solar_panel_right: "Solar Panel (Starboard)",
  power_bus: "Power Distribution",
  obc_board: "OBC Board",
  reaction_wheel: "Reaction Wheel",
  imu: "IMU / Gyroscope",
  radio: "Radio Transceiver",
  antenna: "Antenna",
  thermal_sensor: "Thermal Sensor",
  payload_module: "Payload Module",
  cubesat_frame: "CubeSat Frame",
};

// ── Helpers ──────────────────────────────────────────────────

export function getChannelHealth(
  value: number,
  channel: TelemetryChannel
): HealthState {
  const [nomLow, nomHigh] = channel.nominalRange;
  const [warnLow, warnHigh] = channel.warningRange;

  // For channels where "up is bad" (current, temperature, etc.)
  if (nomLow <= warnLow) {
    // Normal ascending ranges
    if (value >= nomLow && value <= nomHigh) return "nominal";
    if (value >= warnLow && value <= warnHigh) return "warning";
    if (value < warnLow || value > warnHigh) return "critical";
    return "warning";
  }

  // For channels where "down is bad" (voltage, RSSI, etc.)
  if (value >= nomLow && value <= nomHigh) return "nominal";
  if (value >= warnLow && value <= warnHigh) return "warning";
  return "critical";
}

export function getSubsystemHealth(
  subsystem: SubsystemConfig,
  telemetry: TelemetryData
): HealthState {
  let worst: HealthState = "nominal";

  for (const channel of subsystem.channels) {
    const value = telemetry[channel.key] as number;
    const health = getChannelHealth(value, channel);
    if (health === "critical") return "critical";
    if (health === "warning") worst = "warning";
  }

  return worst;
}

export function formatTelemetryValue(
  value: number,
  channel: TelemetryChannel
): string {
  if (channel.format) return channel.format(value);
  return value.toFixed(2);
}

export function getFaultForRCA(candidateCause: string | null): FaultId | null {
  if (!candidateCause) return null;
  if (candidateCause in FAULT_SCENARIOS) return candidateCause as FaultId;
  return null;
}

