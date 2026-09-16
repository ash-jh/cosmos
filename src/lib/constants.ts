// =============================================================================
// COSMOS Mission Operations Platform — Shared Constants & Types
// =============================================================================
// Single source of truth for every enumerated value used across the platform.
// Using `as const` arrays lets us derive both runtime lists (for selects,
// validation, etc.) and compile-time union types from one declaration.
// =============================================================================

// ── Subsystem taxonomy ───────────────────────────────────────────────────────

export const SUBSYSTEM_TYPES = ["EPS", "ADCS", "OBC", "COMM", "PAYLOAD", "THERMAL"] as const;
export type SubsystemType = typeof SUBSYSTEM_TYPES[number];

// ── Mission lifecycle ────────────────────────────────────────────────────────

export const MISSION_STATUSES = ["planning", "active", "completed", "archived"] as const;
export type MissionStatus = typeof MISSION_STATUSES[number];

export const MISSION_TYPES = ["cubesat", "smallsat", "cansat", "other"] as const;
export type MissionType = typeof MISSION_TYPES[number];

// ── Spacecraft & subsystem health ────────────────────────────────────────────

export const SPACECRAFT_STATUSES = ["nominal", "warning", "critical", "offline"] as const;
export type SpacecraftStatus = typeof SPACECRAFT_STATUSES[number];

export const SUBSYSTEM_STATUSES = ["nominal", "warning", "critical", "offline"] as const;
export type SubsystemStatus = typeof SUBSYSTEM_STATUSES[number];

// ── Alerts & anomalies ──────────────────────────────────────────────────────

export const SEVERITY_LEVELS = ["info", "warning", "critical"] as const;
export type SeverityLevel = typeof SEVERITY_LEVELS[number];

export const ALERT_STATUSES = ["active", "acknowledged", "resolved"] as const;
export type AlertStatus = typeof ALERT_STATUSES[number];

export const ANOMALY_STATUSES = ["detected", "investigating", "resolved", "false_positive"] as const;
export type AnomalyStatus = typeof ANOMALY_STATUSES[number];

// ── Telemetry channels ──────────────────────────────────────────────────────

export const CHANNEL_DATATYPES = ["float", "integer", "boolean", "string"] as const;
export type ChannelDatatype = typeof CHANNEL_DATATYPES[number];

// ── Simulation engine ───────────────────────────────────────────────────────

export const SIMULATION_STATUSES = ["pending", "running", "completed", "failed"] as const;
export type SimulationStatus = typeof SIMULATION_STATUSES[number];

// ── ML / predictive models ──────────────────────────────────────────────────

export const MODEL_ARCHITECTURES = ["lstm", "tcn", "statistical"] as const;
export type ModelArchitecture = typeof MODEL_ARCHITECTURES[number];

export const MODEL_STATUSES = ["training", "ready", "deployed", "archived"] as const;
export type ModelStatus = typeof MODEL_STATUSES[number];

// =============================================================================
// Display helpers — human-readable labels & icon names (Lucide icon keys)
// =============================================================================

/** Full display names shown in dashboards and reports. */
export const SUBSYSTEM_TYPE_LABELS: Record<SubsystemType, string> = {
  EPS: "Electrical Power System",
  ADCS: "Attitude Determination & Control",
  OBC: "On-Board Computer",
  COMM: "Communications",
  PAYLOAD: "Payload",
  THERMAL: "Thermal Control",
};

/** Lucide icon component names used for each subsystem in the UI. */
export const SUBSYSTEM_TYPE_ICONS: Record<SubsystemType, string> = {
  EPS: "Zap",
  ADCS: "Compass",
  OBC: "Cpu",
  COMM: "Radio",
  PAYLOAD: "Package",
  THERMAL: "Thermometer",
};
