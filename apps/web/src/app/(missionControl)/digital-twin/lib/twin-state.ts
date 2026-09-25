// ─────────────────────────────────────────────────────────────
// COSMOS Digital Twin — State Machine
// Manages the diagnostic workflow state: NOMINAL → ANOMALY →
// INVESTIGATING → FAULT_ISOLATED → INTERVENTION → RECOVERY →
// VERIFICATION → RECOVERED / RECOVERY_FAILED
// ─────────────────────────────────────────────────────────────

"use client";

import { useCallback, useRef, useState } from "react";

import type { TelemetryData, RCAResult } from "@/hooks/use-telemetry";

import {
  type MissionState,
  type FaultId,
  type SubsystemId,
  type ComponentId,
  type HealthState,
  type CorrectionAction,
  FAULT_SCENARIOS,
  SUBSYSTEM_CONFIGS,
  getSubsystemHealth,
  getFaultForRCA,
} from "./subsystem-config";

// ── Timeline Event ───────────────────────────────────────────

export interface TimelineEvent {
  id: string;
  timestamp: Date;
  message: string;
  severity: "info" | "warning" | "critical" | "success";
}

// ── Recovery Progress ────────────────────────────────────────

export interface RecoveryProgress {
  channel: string;
  label: string;
  unit: string;
  startValue: number;
  currentValue: number;
  targetValue: number;
  recovered: boolean;
}

// ── Twin State ───────────────────────────────────────────────

export interface TwinState {
  missionState: MissionState;
  selectedSubsystem: SubsystemId | null;
  selectedComponent: ComponentId | null;
  hoveredComponent: ComponentId | null;
  activeFaultId: FaultId | null;
  detectedFaultId: FaultId | null;
  subsystemHealth: Record<SubsystemId, HealthState>;
  diagnosticConfidence: number;
  selectedAction: CorrectionAction | null;
  recoveryProgress: RecoveryProgress[];
  verificationResults: { channel: string; passed: boolean }[];
  timeline: TimelineEvent[];
  viewMode: "systems" | "telemetry" | "faults";
  explodedView: boolean;
  telemetryOverride: Partial<TelemetryData> | null;
}

const INITIAL_HEALTH: Record<SubsystemId, HealthState> = {
  EPS: "nominal",
  OBC: "nominal",
  ADCS: "nominal",
  COMM: "nominal",
  THERMAL: "nominal",
  PAYLOAD: "nominal",
};

// ── Hook ─────────────────────────────────────────────────────

export function useTwinState() {
  const [state, setState] = useState<TwinState>({
    missionState: "NOMINAL",
    selectedSubsystem: null,
    selectedComponent: null,
    hoveredComponent: null,
    activeFaultId: null,
    detectedFaultId: null,
    subsystemHealth: { ...INITIAL_HEALTH },
    diagnosticConfidence: 0,
    selectedAction: null,
    recoveryProgress: [],
    verificationResults: [],
    timeline: [],
    viewMode: "systems",
    explodedView: false,
    telemetryOverride: null,
  });

  const timelineIdRef = useRef(0);

  // ── Timeline ──────────────────────────────────

  const addTimelineEvent = useCallback(
    (message: string, severity: TimelineEvent["severity"] = "info") => {
      timelineIdRef.current += 1;
      const event: TimelineEvent = {
        id: `evt-${timelineIdRef.current}`,
        timestamp: new Date(),
        message,
        severity,
      };
      setState((s) => ({
        ...s,
        timeline: [event, ...s.timeline].slice(0, 50),
      }));
    },
    []
  );

  // ── Selection ─────────────────────────────────

  const selectSubsystem = useCallback(
    (id: SubsystemId | null) => {
      setState((s) => ({
        ...s,
        selectedSubsystem: id,
        selectedComponent: id
          ? SUBSYSTEM_CONFIGS[id].components[0] ?? null
          : null,
      }));
    },
    []
  );

  const selectComponent = useCallback((id: ComponentId | null) => {
    setState((s) => ({ ...s, selectedComponent: id }));
  }, []);

  const setHoveredComponent = useCallback(
    (id: ComponentId | null) => {
      setState((s) => ({ ...s, hoveredComponent: id }));
    },
    []
  );

  // ── View controls ─────────────────────────────

  const setViewMode = useCallback(
    (mode: TwinState["viewMode"]) => {
      setState((s) => ({ ...s, viewMode: mode }));
    },
    []
  );

  const toggleExplodedView = useCallback(() => {
    setState((s) => ({ ...s, explodedView: !s.explodedView }));
  }, []);

  // ── Telemetry health processing ───────────────

  const processHealth = useCallback(
    (telemetry: TelemetryData) => {
      const health: Record<SubsystemId, HealthState> = {
        ...INITIAL_HEALTH,
      };

      for (const [key, config] of Object.entries(SUBSYSTEM_CONFIGS)) {
        health[key as SubsystemId] = getSubsystemHealth(
          config,
          telemetry
        );
      }

      setState((s) => ({ ...s, subsystemHealth: health }));
    },
    []
  );

  // ── Anomaly detection from telemetry stream ───

  const processAnomaly = useCallback(
    (rca: RCAResult, telemetry: TelemetryData) => {
      setState((s) => {
        // Don't overwrite if we're already in investigation/intervention flow
        if (
          s.missionState !== "NOMINAL" &&
          s.missionState !== "ANOMALY_DETECTED" &&
          s.missionState !== "RECOVERED"
        ) {
          return s;
        }

        if (rca.status === "no_issue") {
          if (s.missionState === "ANOMALY_DETECTED") {
            return {
              ...s,
              missionState: "NOMINAL" as MissionState,
              detectedFaultId: null,
              activeFaultId: null,
            };
          }
          return s;
        }

        // RCA suspects a fault
        const faultId = getFaultForRCA(rca.candidate_cause);
        if (!faultId) return s;

        if (s.missionState === "NOMINAL" || s.missionState === "RECOVERED") {
          return {
            ...s,
            missionState: "ANOMALY_DETECTED" as MissionState,
            detectedFaultId: faultId,
            activeFaultId: faultId,
            diagnosticConfidence: Math.round(rca.confidence * 100),
          };
        }

        return {
          ...s,
          detectedFaultId: faultId,
          diagnosticConfidence: Math.round(rca.confidence * 100),
        };
      });
    },
    []
  );

  // ── Investigation ─────────────────────────────

  const startInvestigation = useCallback(() => {
    setState((s) => {
      if (!s.detectedFaultId) return s;
      const fault = FAULT_SCENARIOS[s.detectedFaultId];
      if (!fault) return s;

      return {
        ...s,
        missionState: "INVESTIGATING",
        selectedSubsystem: fault.rootSubsystem,
        selectedComponent: fault.affectedComponents[0] ?? null,
      };
    });
    addTimelineEvent("Investigation initiated — navigating to affected subsystem.", "warning");
  }, [addTimelineEvent]);

  const isolateFault = useCallback(() => {
    setState((s) => ({
      ...s,
      missionState: "FAULT_ISOLATED",
    }));
    addTimelineEvent("Fault isolated — root cause identified.", "warning");
  }, [addTimelineEvent]);

  // ── Intervention ──────────────────────────────

  const selectCorrectionAction = useCallback(
    (action: CorrectionAction) => {
      setState((s) => ({
        ...s,
        selectedAction: action,
        missionState: "INTERVENTION",
      }));
    },
    []
  );

  const applyCorrectionAction = useCallback(() => {
    setState((s) => {
      const action = s.selectedAction;
      if (!action) return s;

      addTimelineEvent(
        `Corrective action applied: ${action.label}`,
        "info"
      );

      // Determine if recovery succeeds
      const succeeds = Math.random() < action.successProbability;

      // Build recovery progress
      const progress: RecoveryProgress[] = Object.entries(
        action.telemetryRecovery
      ).map(([channel, target]) => ({
        channel,
        label: channel.replace(/_/g, " "),
        unit: "",
        startValue: 0, // will be filled from current telemetry
        currentValue: 0,
        targetValue: target as number,
        recovered: false,
      }));

      return {
        ...s,
        missionState: "RECOVERY",
        recoveryProgress: progress,
        telemetryOverride: succeeds ? action.telemetryRecovery : null,
      };
    });
  }, [addTimelineEvent]);

  // ── Recovery simulation ───────────────────────

  const advanceRecovery = useCallback(
    (currentTelemetry: TelemetryData) => {
      setState((s) => {
        if (s.missionState !== "RECOVERY") return s;

        const updated = s.recoveryProgress.map((p) => {
          const current =
            currentTelemetry[p.channel as keyof TelemetryData] as number;
          const diff = Math.abs(current - p.targetValue);
          const threshold = Math.abs(p.targetValue) * 0.1 || 0.5;
          return {
            ...p,
            currentValue: current,
            startValue: p.startValue || current,
            recovered: diff < threshold,
          };
        });

        const allRecovered = updated.every((p) => p.recovered);
        const recoveryTime = updated.length > 0;

        if (allRecovered && recoveryTime) {
          addTimelineEvent("Recovery metrics within nominal range.", "success");
          return {
            ...s,
            missionState: "VERIFICATION" as MissionState,
            recoveryProgress: updated,
          };
        }

        return { ...s, recoveryProgress: updated };
      });
    },
    [addTimelineEvent]
  );

  const runVerification = useCallback(
    (currentTelemetry: TelemetryData) => {
      setState((s) => {
        if (s.missionState !== "VERIFICATION") return s;
        if (!s.detectedFaultId) return s;

        const fault = FAULT_SCENARIOS[s.detectedFaultId];
        if (!fault) return s;

        const results = fault.telemetryEffects.map((effect) => {
          const value = currentTelemetry[effect.channel] as number;
          const config = Object.values(SUBSYSTEM_CONFIGS)
            .flatMap((sub) => sub.channels)
            .find((ch) => ch.key === effect.channel);

          if (!config) return { channel: effect.channel, passed: true };

          const [nomLow, nomHigh] = config.nominalRange;
          const passed = value >= nomLow && value <= nomHigh;
          return { channel: effect.channel, passed };
        });

        const allPassed = results.every((r) => r.passed);

        if (allPassed) {
          addTimelineEvent(
            "Verification complete — spacecraft returned to nominal.",
            "success"
          );
          return {
            ...s,
            missionState: "RECOVERED" as MissionState,
            verificationResults: results,
            detectedFaultId: null,
            activeFaultId: null,
            telemetryOverride: null,
          };
        }

        // If telemetry override was applied, give it time
        if (s.telemetryOverride) {
          return { ...s, verificationResults: results };
        }

        addTimelineEvent(
          "Verification failed — telemetry remains outside nominal range.",
          "critical"
        );
        return {
          ...s,
          missionState: "RECOVERY_FAILED" as MissionState,
          verificationResults: results,
          telemetryOverride: null,
        };
      });
    },
    [addTimelineEvent]
  );

  // ── Reset ─────────────────────────────────────

  const resetToNominal = useCallback(() => {
    setState((s) => ({
      ...s,
      missionState: "NOMINAL",
      detectedFaultId: null,
      activeFaultId: null,
      selectedAction: null,
      recoveryProgress: [],
      verificationResults: [],
      diagnosticConfidence: 0,
      telemetryOverride: null,
    }));
    addTimelineEvent("Digital twin reset to nominal state.", "info");
  }, [addTimelineEvent]);

  return {
    state,
    // Selection
    selectSubsystem,
    selectComponent,
    setHoveredComponent,
    // View
    setViewMode,
    toggleExplodedView,
    // Health
    processHealth,
    processAnomaly,
    // Investigation
    startInvestigation,
    isolateFault,
    // Intervention
    selectCorrectionAction,
    applyCorrectionAction,
    // Recovery
    advanceRecovery,
    runVerification,
    // Reset
    resetToNominal,
    // Timeline
    addTimelineEvent,
  };
}

