"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  CircleDot,
  Cpu,
  Crosshair,
  Gauge,
  Layers3,
  RotateCcw,
  Satellite,
  ShieldCheck,
  Thermometer,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { DigitalTwinScene } from "./components/digital-twin-scene";
import { useTwinState } from "./lib/twin-state";

import {
  COMPONENT_LABELS,
  COMPONENT_SUBSYSTEM_MAP,
  FAULT_SCENARIOS,
  SUBSYSTEM_CONFIGS,
  type ComponentId,
  type HealthState,
  type SubsystemId,
} from "./lib/subsystem-config";

import { useTelemetry } from "@/hooks/use-telemetry";

/* ─────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────── */

const HEALTH_STYLES: Record<
  HealthState,
  {
    text: string;
    bg: string;
    border: string;
    dot: string;
  }
> = {
  nominal: {
    text: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    dot: "bg-emerald-400",
  },
  warning: {
    text: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    dot: "bg-amber-400",
  },
  critical: {
    text: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
    dot: "bg-red-400",
  },
};

const MISSION_STATE_LABELS: Record<string, string> = {
  NOMINAL: "NOMINAL",
  ANOMALY_DETECTED: "ANOMALY DETECTED",
  INVESTIGATING: "INVESTIGATING",
  FAULT_ISOLATED: "FAULT ISOLATED",
  INTERVENTION: "INTERVENTION",
  RECOVERY: "RECOVERY",
  VERIFICATION: "VERIFICATION",
  RECOVERED: "RECOVERED",
  RECOVERY_FAILED: "RECOVERY FAILED",
};

function formatNumber(value: unknown, digits = 2) {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return value.toFixed(digits);
}

function healthForSubsystem(
  health: Record<SubsystemId, HealthState>,
  subsystem: SubsystemId | null
): HealthState {
  if (!subsystem) return "nominal";
  return health[subsystem] ?? "nominal";
}

function getComponentHealth(
  component: ComponentId,
  subsystemHealth: Record<SubsystemId, HealthState>
): HealthState {
  const subsystem = COMPONENT_SUBSYSTEM_MAP[component];
  return subsystemHealth[subsystem] ?? "nominal";
}

function getChannelConfig(channel: string) {
  for (const subsystem of Object.values(SUBSYSTEM_CONFIGS)) {
    const found = subsystem.channels.find((item) => item.key === channel);
    if (found) return found;
  }

  return null;
}

/* ─────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────── */

export default function DigitalTwinPage() {
  const {
    telemetry,
    rca,
    connected,
    error: telemetryError,
  } = useTelemetry();

  const {
    state,
    selectSubsystem,
    selectComponent,
    setHoveredComponent,
    setViewMode,
    toggleExplodedView,
    processHealth,
    processAnomaly,
    startInvestigation,
    isolateFault,
    selectCorrectionAction,
    applyCorrectionAction,
    advanceRecovery,
    runVerification,
    resetToNominal,
    addTimelineEvent,
  } = useTwinState();

  /* ─────────────────────────────────────────────────────────
     Telemetry → Twin state
  ──────────────────────────────────────────────────────────── */

  useEffect(() => {
    if (!telemetry) return;

    processHealth(telemetry);
  }, [telemetry, processHealth]);

  useEffect(() => {
    if (!rca || !telemetry) return;

    processAnomaly(rca, telemetry);
  }, [rca, telemetry, processAnomaly]);

  /* ─────────────────────────────────────────────────────────
     Recovery animation

     The backend telemetry remains untouched.
     We interpolate the Digital Twin's displayed state locally
     toward the selected action's simulated target.
  ──────────────────────────────────────────────────────────── */

  const recoveryTimerRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  useEffect(() => {
    if (state.missionState !== "RECOVERY") {
      if (recoveryTimerRef.current) {
        clearInterval(recoveryTimerRef.current);
        recoveryTimerRef.current = null;
      }
      return;
    }

    if (!telemetry || state.recoveryProgress.length === 0) return;

    let progress = 0;

    recoveryTimerRef.current = setInterval(() => {
      progress += 0.08;

      const simulatedTelemetry = {
        ...telemetry,
      };

      for (const item of state.recoveryProgress) {
        const source =
          telemetry[item.channel as keyof typeof telemetry];

        if (typeof source !== "number") continue;

        const next =
          source + (item.targetValue - source) * Math.min(progress, 1);

        (
          simulatedTelemetry as Record<string, unknown>
        )[item.channel] = next;
      }

      advanceRecovery(simulatedTelemetry);

      if (progress >= 1) {
        if (recoveryTimerRef.current) {
          clearInterval(recoveryTimerRef.current);
          recoveryTimerRef.current = null;
        }
      }
    }, 250);

    return () => {
      if (recoveryTimerRef.current) {
        clearInterval(recoveryTimerRef.current);
        recoveryTimerRef.current = null;
      }
    };
  }, [
    state.missionState,
    state.recoveryProgress,
    telemetry,
    advanceRecovery,
  ]);

  /* ─────────────────────────────────────────────────────────
     Verification
  ──────────────────────────────────────────────────────────── */

  useEffect(() => {
    if (state.missionState !== "VERIFICATION") return;
    if (!telemetry) return;

    const timer = setTimeout(() => {
      runVerification(telemetry);
    }, 900);

    return () => clearTimeout(timer);
  }, [state.missionState, telemetry, runVerification]);

  /* ─────────────────────────────────────────────────────────
     Effective telemetry

     During simulated recovery, override values are displayed
     alongside the real stream without mutating backend data.
  ──────────────────────────────────────────────────────────── */

  const effectiveTelemetry = useMemo(() => {
    return {
      ...(telemetry ?? {}),
      ...(state.telemetryOverride ?? {}),
    };
  }, [telemetry, state.telemetryOverride]);

  /* ─────────────────────────────────────────────────────────
     Active fault
  ──────────────────────────────────────────────────────────── */

  const activeFault = state.activeFaultId
    ? FAULT_SCENARIOS[state.activeFaultId]
    : null;

  const detectedFault = state.detectedFaultId
    ? FAULT_SCENARIOS[state.detectedFaultId]
    : null;

  const faultedComponents = useMemo<ComponentId[]>(() => {
    if (!activeFault) return [];

    return activeFault.affectedComponents;
  }, [activeFault]);

  /* ─────────────────────────────────────────────────────────
     Component health
  ──────────────────────────────────────────────────────────── */

  const componentHealth = useMemo(() => {
    const result = {} as Record<ComponentId, HealthState>;

    (
      Object.keys(COMPONENT_LABELS) as ComponentId[]
    ).forEach((component) => {
      result[component] = getComponentHealth(
        component,
        state.subsystemHealth
      );
    });

    return result;
  }, [state.subsystemHealth]);

  /* ─────────────────────────────────────────────────────────
     Selected component
  ──────────────────────────────────────────────────────────── */

  const selectedSubsystem =
    state.selectedSubsystem ?? null;

  const selectedComponent =
    state.selectedComponent ?? null;

  const selectedComponentSubsystem = selectedComponent
    ? COMPONENT_SUBSYSTEM_MAP[selectedComponent]
    : null;

  const selectedSubsystemConfig = selectedSubsystem
    ? SUBSYSTEM_CONFIGS[selectedSubsystem]
    : null;

  const selectedComponentHealth = selectedComponent
    ? componentHealth[selectedComponent]
    : "nominal";

  const selectedHealthStyle =
    HEALTH_STYLES[selectedComponentHealth];

  /* ─────────────────────────────────────────────────────────
     Handlers
  ──────────────────────────────────────────────────────────── */

  const handleComponentClick = useCallback(
    (id: ComponentId) => {
      const subsystem = COMPONENT_SUBSYSTEM_MAP[id];

      selectComponent(id);

      if (subsystem) {
        selectSubsystem(subsystem);
      }

      addTimelineEvent(
        `${COMPONENT_LABELS[id]} selected for inspection.`,
        "info"
      );
    },
    [selectComponent, selectSubsystem, addTimelineEvent]
  );

  const handleInvestigate = useCallback(() => {
    startInvestigation();
  }, [startInvestigation]);

  const handleIsolate = useCallback(() => {
    isolateFault();
  }, [isolateFault]);

  const handleReset = useCallback(() => {
    resetToNominal();
  }, [resetToNominal]);

  /* ─────────────────────────────────────────────────────────
     Telemetry rows
  ──────────────────────────────────────────────────────────── */

  const telemetryRows = useMemo(() => {
    if (!selectedSubsystemConfig) return [];

    return selectedSubsystemConfig.channels.map((channel) => {
      const value =
        effectiveTelemetry[
          channel.key as keyof typeof effectiveTelemetry
        ];

      return {
        ...channel,
        value:
          typeof value === "number"
            ? value
            : null,
        formatted:
          typeof value === "number"
            ? channel.format
              ? channel.format(value)
              : value.toFixed(2)
            : "—",
      };
    });
  }, [selectedSubsystemConfig, effectiveTelemetry]);

  /* ─────────────────────────────────────────────────────────
     Overall spacecraft status
  ──────────────────────────────────────────────────────────── */

  const healthValues = Object.values(state.subsystemHealth);

  const criticalCount = healthValues.filter(
    (h) => h === "critical"
  ).length;

  const warningCount = healthValues.filter(
    (h) => h === "warning"
  ).length;

  const nominalCount = healthValues.filter(
    (h) => h === "nominal"
  ).length;

  const overallHealth: HealthState =
    criticalCount > 0
      ? "critical"
      : warningCount > 0
        ? "warning"
        : "nominal";

  const overallHealthStyle =
    HEALTH_STYLES[overallHealth];

  /* ─────────────────────────────────────────────────────────
     Recovery progress
  ──────────────────────────────────────────────────────────── */

  const recoveryPercent = useMemo(() => {
    if (state.recoveryProgress.length === 0) return 0;

    const recovered = state.recoveryProgress.filter(
      (item) => item.recovered
    ).length;

    return Math.round(
      (recovered / state.recoveryProgress.length) * 100
    );
  }, [state.recoveryProgress]);

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-5 px-4 py-5 md:px-6 lg:px-8">
        {/* ═══════════════════════════════════════════════════
            HEADER
        ═══════════════════════════════════════════════════ */}

        <header className="flex flex-col gap-4">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <Link
                href="/"
                className="mb-3 inline-flex items-center gap-2 text-xs text-white/35 transition-colors hover:text-white/70"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Mission Overview
              </Link>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.06]">
                  <Satellite className="h-4 w-4 text-cyan-300" />
                </div>

                <div>
                  <h1 className="text-xl font-semibold tracking-tight">
                    Digital Twin
                  </h1>

                  <p className="mt-0.5 text-xs text-white/35">
                    Interactive spacecraft model for
                    system-level diagnosis and recovery.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 ${
                  connected
                    ? "border-emerald-400/15 bg-emerald-400/[0.05]"
                    : "border-amber-400/15 bg-amber-400/[0.05]"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    connected
                      ? "bg-emerald-400"
                      : "bg-amber-400"
                  }`}
                />

                <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/55">
                  {connected
                    ? "LIVE DIGITAL TWIN"
                    : "SIMULATION MODE"}
                </span>
              </div>

              <Badge
                variant="outline"
                className={`border ${overallHealthStyle.border} ${overallHealthStyle.bg} ${overallHealthStyle.text} text-[9px] tracking-[0.12em]`}
              >
                {MISSION_STATE_LABELS[state.missionState]}
              </Badge>
            </div>
          </div>

          {/* ────────────────────────────────────────────────
              Spacecraft status row
          ──────────────────────────────────────────────── */}

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.04] sm:grid-cols-4">
            <StatusMetric
              label="SPACECRAFT"
              value="COSMOS-SAT-01"
              icon={<Satellite className="h-3.5 w-3.5" />}
            />

            <StatusMetric
              label="TELEMETRY"
              value={connected ? "STREAMING" : "OFFLINE"}
              icon={<Activity className="h-3.5 w-3.5" />}
              status={connected ? "nominal" : "warning"}
            />

            <StatusMetric
              label="SUBSYSTEMS"
              value={`${nominalCount} / 6 NOMINAL`}
              icon={<Layers3 className="h-3.5 w-3.5" />}
              status={overallHealth}
            />

            <StatusMetric
              label="FAULTS"
              value={
                state.activeFaultId
                  ? "01 ACTIVE"
                  : "00 ACTIVE"
              }
              icon={<AlertTriangle className="h-3.5 w-3.5" />}
              status={
                state.activeFaultId
                  ? "critical"
                  : "nominal"
              }
            />
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════
            ANOMALY BANNER
        ═══════════════════════════════════════════════════ */}

        {detectedFault &&
          state.missionState === "ANOMALY_DETECTED" && (
            <section className="flex flex-col gap-4 rounded-xl border border-red-400/20 bg-red-400/[0.045] p-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-400/10">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-red-400">
                      Anomaly Detected
                    </span>

                    <span className="text-[9px] text-white/25">
                      {state.diagnosticConfidence}% confidence
                    </span>
                  </div>

                  <h2 className="mt-1 text-sm font-medium text-white">
                    {detectedFault.name}
                  </h2>

                  <p className="mt-1 max-w-2xl text-xs leading-relaxed text-white/40">
                    {detectedFault.telemetryEffects[0]?.description ??
                      "Telemetry has moved outside the expected operating envelope."}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleInvestigate}
                size="sm"
                className="shrink-0 bg-white text-black hover:bg-white/90"
              >
                Investigate
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </section>
          )}

        {/* ═══════════════════════════════════════════════════
            MAIN WORKSPACE
        ═══════════════════════════════════════════════════ */}

        <main className="grid min-h-[680px] grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* ────────────────────────────────────────────────
              LEFT — 3D TWIN
          ──────────────────────────────────────────────── */}

          <section className="flex min-h-[680px] flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* View mode */}
              <div className="flex items-center rounded-lg border border-white/[0.08] bg-white/[0.025] p-1">
                {(
                  [
                    ["systems", "Systems"],
                    ["telemetry", "Telemetry"],
                    ["faults", "Faults"],
                  ] as const
                ).map(([mode, label]) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`rounded-md px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.12em] transition-all ${
                      state.viewMode === mode
                        ? "bg-white/[0.08] text-white"
                        : "text-white/30 hover:text-white/60"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleExplodedView}
                  className={`h-8 border-white/[0.08] bg-white/[0.025] text-[10px] text-white/55 hover:bg-white/[0.06] hover:text-white ${
                    state.explodedView
                      ? "border-cyan-400/25 text-cyan-300"
                      : ""
                  }`}
                >
                  <Layers3 className="mr-1.5 h-3.5 w-3.5" />
                  {state.explodedView
                    ? "Collapse"
                    : "Exploded View"}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="h-8 border-white/[0.08] bg-white/[0.025] text-[10px] text-white/55 hover:bg-white/[0.06] hover:text-white"
                >
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                  Reset
                </Button>
              </div>
            </div>

            <div className="relative min-h-[600px] flex-1">
              <DigitalTwinScene
                exploded={state.explodedView}
                selectedSubsystem={state.selectedSubsystem}
                selectedComponent={state.selectedComponent}
                hoveredComponent={state.hoveredComponent}
                componentHealth={componentHealth}
                faultedComponents={faultedComponents}
                viewMode={state.viewMode}
                onComponentClick={handleComponentClick}
                onComponentHover={setHoveredComponent}
                onSubsystemSelect={selectSubsystem}
              />

              {/* Fault propagation overlay */}
              {activeFault &&
                state.missionState !== "NOMINAL" && (
                  <FaultPropagationOverlay
                    faultName={activeFault.name}
                    chain={activeFault.propagationChain}
                    missionState={state.missionState}
                  />
                )}

              {/* Hover label */}
              {state.hoveredComponent && (
                <div className="pointer-events-none absolute left-5 top-14 rounded-lg border border-white/[0.09] bg-[#080b12]/95 px-3 py-2 shadow-2xl backdrop-blur-md">
                  <div className="text-[9px] uppercase tracking-[0.16em] text-white/30">
                    {COMPONENT_SUBSYSTEM_MAP[
                      state.hoveredComponent
                    ]}
                  </div>

                  <div className="mt-0.5 text-xs font-medium text-white">
                    {
                      COMPONENT_LABELS[
                        state.hoveredComponent
                      ]
                    }
                  </div>
                </div>
              )}

              {/* Investigation marker */}
              {(state.missionState === "INVESTIGATING" ||
                state.missionState === "FAULT_ISOLATED") &&
                state.selectedComponent && (
                  <div className="pointer-events-none absolute left-5 bottom-5 flex items-center gap-2 rounded-lg border border-cyan-400/15 bg-[#080b12]/90 px-3 py-2 backdrop-blur-md">
                    <Crosshair className="h-3.5 w-3.5 text-cyan-300" />

                    <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-cyan-300">
                      Focused on{" "}
                      {
                        COMPONENT_LABELS[
                          state.selectedComponent
                        ]
                      }
                    </span>
                  </div>
                )}
            </div>
          </section>

          {/* ────────────────────────────────────────────────
              RIGHT — DIAGNOSTIC PANEL
          ──────────────────────────────────────────────── */}

          <aside className="flex min-h-[680px] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.018]">
            {selectedComponent ? (
              <DiagnosticPanel
                selectedComponent={selectedComponent}
                selectedSubsystem={
                  selectedComponentSubsystem
                }
                health={selectedComponentHealth}
                healthStyle={selectedHealthStyle}
                telemetryRows={telemetryRows}
                activeFault={activeFault}
                state={state}
                onIsolate={handleIsolate}
                onSelectAction={selectCorrectionAction}
                onApplyAction={applyCorrectionAction}
              />
            ) : (
              <SpacecraftStatusPanel
                health={overallHealth}
                healthStyle={overallHealthStyle}
                state={state}
                connected={connected}
                telemetryError={telemetryError}
                onReset={handleReset}
              />
            )}
          </aside>
        </main>

        {/* ═══════════════════════════════════════════════════
            RECOVERY PANEL
        ═══════════════════════════════════════════════════ */}

        {(state.missionState === "RECOVERY" ||
          state.missionState === "VERIFICATION" ||
          state.missionState === "RECOVERED" ||
          state.missionState === "RECOVERY_FAILED") && (
          <RecoveryPanel
            state={state}
            recoveryPercent={recoveryPercent}
            telemetry={effectiveTelemetry}
            onReset={handleReset}
          />
        )}

        {/* ═══════════════════════════════════════════════════
            EVENT STREAM
        ═══════════════════════════════════════════════════ */}

        <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.018]">
          <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
            <div className="flex items-center gap-2">
              <CircleDot className="h-3.5 w-3.5 text-cyan-300" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Mission Event Timeline
              </span>
            </div>

            <span className="text-[9px] uppercase tracking-[0.12em] text-white/20">
              {state.timeline.length} events
            </span>
          </div>

          <div className="max-h-52 overflow-y-auto">
            {state.timeline.length === 0 ? (
              <div className="flex items-center gap-3 px-4 py-5 text-xs text-white/25">
                <Activity className="h-3.5 w-3.5" />
                Awaiting spacecraft events…
              </div>
            ) : (
              state.timeline.map((event) => (
                <TimelineRow
                  key={event.id}
                  timestamp={event.timestamp}
                  message={event.message}
                  severity={event.severity}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STATUS METRIC
═══════════════════════════════════════════════════════════ */

function StatusMetric({
  label,
  value,
  icon,
  status = "nominal",
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  status?: HealthState;
}) {
  const style = HEALTH_STYLES[status];

  return (
    <div className="flex items-center gap-3 bg-[#080b12] px-4 py-3">
      <div className="text-white/25">{icon}</div>

      <div className="min-w-0">
        <div className="text-[8px] font-medium uppercase tracking-[0.18em] text-white/25">
          {label}
        </div>

        <div
          className={`mt-0.5 truncate text-[10px] font-medium ${style.text}`}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DIAGNOSTIC PANEL
═══════════════════════════════════════════════════════════ */

function DiagnosticPanel({
  selectedComponent,
  selectedSubsystem,
  health,
  healthStyle,
  telemetryRows,
  activeFault,
  state,
  onIsolate,
  onSelectAction,
  onApplyAction,
}: {
  selectedComponent: ComponentId;
  selectedSubsystem: SubsystemId | null;
  health: HealthState;
  healthStyle: (typeof HEALTH_STYLES)[HealthState];
  telemetryRows: {
    key: string;
    label: string;
    unit: string;
    formatted: string;
  }[];
  activeFault: ReturnType<
    typeof FAULT_SCENARIOS[keyof typeof FAULT_SCENARIOS]
  > | null;
  state: ReturnType<typeof useTwinState>["state"];
  onIsolate: () => void;
  onSelectAction: (
    action: NonNullable<
      ReturnType<typeof useTwinState>["state"]["selectedAction"]
    >
  ) => void;
  onApplyAction: () => void;
}) {
  const subsystem =
    selectedSubsystem &&
    SUBSYSTEM_CONFIGS[selectedSubsystem];

  const canIsolate =
    !!activeFault &&
    state.missionState === "INVESTIGATING";

  const canIntervene =
    !!activeFault &&
    state.missionState === "FAULT_ISOLATED";

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-white/[0.07] p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[8px] uppercase tracking-[0.2em] text-white/25">
              {selectedSubsystem}
            </div>

            <h2 className="mt-1 text-base font-semibold tracking-tight">
              {COMPONENT_LABELS[selectedComponent]}
            </h2>

            <p className="mt-1 text-[10px] leading-relaxed text-white/30">
              {subsystem?.description}
            </p>
          </div>

          <div
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 ${healthStyle.bg} ${healthStyle.border}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${healthStyle.dot}`}
            />

            <span
              className={`text-[8px] font-semibold uppercase tracking-[0.12em] ${healthStyle.text}`}
            >
              {health}
            </span>
          </div>
        </div>
      </div>

      {/* Telemetry */}
      <div className="border-b border-white/[0.07] p-5">
        <PanelHeading icon={<Gauge className="h-3.5 w-3.5" />}>
          Telemetry
        </PanelHeading>

        <div className="mt-3 space-y-2">
          {telemetryRows.length === 0 ? (
            <div className="text-xs text-white/25">
              No telemetry channels mapped.
            </div>
          ) : (
            telemetryRows.map((row) => (
              <div
                key={row.key}
                className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.018] px-3 py-2"
              >
                <span className="text-[10px] text-white/40">
                  {row.label}
                </span>

                <span className="font-mono text-[10px] text-white/80">
                  {row.formatted}
                  {row.unit && (
                    <span className="ml-1 text-white/25">
                      {row.unit}
                    </span>
                  )}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Fault */}
      {activeFault && (
        <div className="border-b border-white/[0.07] p-5">
          <PanelHeading
            icon={
              <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
            }
          >
            Active Diagnostic
          </PanelHeading>

          <div className="mt-3 rounded-xl border border-red-400/15 bg-red-400/[0.035] p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-medium text-white">
                {activeFault.name}
              </span>

              <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-red-400">
                {state.missionState === "RECOVERED"
                  ? "RECOVERED"
                  : "ACTIVE"}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {activeFault.telemetryEffects.map(
                (effect) => (
                  <div
                    key={effect.channel}
                    className="flex gap-2 text-[9px] leading-relaxed text-white/35"
                  >
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-red-400" />
                    {effect.description}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Causal propagation */}
      {activeFault && (
        <div className="border-b border-white/[0.07] p-5">
          <PanelHeading
            icon={
              <Activity className="h-3.5 w-3.5 text-cyan-300" />
            }
          >
            Causal Propagation
          </PanelHeading>

          <div className="mt-3">
            {activeFault.propagationChain.map(
              (subsystemId, index) => (
                <div
                  key={`${subsystemId}-${index}`}
                  className="flex items-center"
                >
                  <button
                    onClick={() =>
                      onSelectAction &&
                      undefined
                    }
                    className="flex items-center gap-2 rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5"
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        index === 0
                          ? "bg-red-400"
                          : "bg-amber-400"
                      }`}
                    />

                    <span className="text-[9px] font-medium text-white/60">
                      {subsystemId}
                    </span>
                  </button>

                  {index <
                    activeFault.propagationChain
                      .length -
                      1 && (
                    <ChevronRight className="mx-1 h-3 w-3 text-white/15" />
                  )}
                </div>
              )
            )}
          </div>

          {state.diagnosticConfidence > 0 && (
            <div className="mt-3 flex items-center justify-between text-[9px]">
              <span className="text-white/25">
                RCA confidence
              </span>

              <span className="font-mono text-cyan-300">
                {state.diagnosticConfidence}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Intervention */}
      {canIsolate && (
        <div className="border-t border-white/[0.07] p-5">
          <Button
            onClick={onIsolate}
            className="w-full bg-white text-black hover:bg-white/90"
            size="sm"
          >
            Confirm Fault Isolation
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>

          <p className="mt-2 text-center text-[8px] text-white/20">
            Confirm the simulated root-cause isolation.
          </p>
        </div>
      )}

      {canIntervene && activeFault && (
        <div className="border-t border-white/[0.07] p-5">
          <PanelHeading
            icon={<ShieldCheck className="h-3.5 w-3.5" />}
          >
            Recommended Actions
          </PanelHeading>

          <div className="mt-3 space-y-2">
            {activeFault.correctionActions.map(
              (action) => {
                const selected =
                  state.selectedAction?.id ===
                  action.id;

                return (
                  <button
                    key={action.id}
                    onClick={() =>
                      onSelectAction(action)
                    }
                    className={`w-full rounded-lg border p-3 text-left transition-all ${
                      selected
                        ? "border-cyan-400/25 bg-cyan-400/[0.06]"
                        : "border-white/[0.07] bg-white/[0.018] hover:border-white/[0.14]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-medium text-white/75">
                        {action.label}
                      </span>

                      {selected && (
                        <Check className="h-3 w-3 text-cyan-300" />
                      )}
                    </div>

                    <p className="mt-1.5 text-[9px] leading-relaxed text-white/30">
                      {action.description}
                    </p>
                  </button>
                );
              }
            )}
          </div>

          {state.selectedAction && (
            <Button
              onClick={onApplyAction}
              className="mt-3 w-full bg-cyan-300 text-black hover:bg-cyan-200"
              size="sm"
            >
              Apply Simulated Action
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          )}

          <p className="mt-2 text-center text-[8px] uppercase tracking-[0.12em] text-white/15">
            SIMULATED INTERVENTION
          </p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SPACECRAFT STATUS
═══════════════════════════════════════════════════════════ */

function SpacecraftStatusPanel({
  health,
  healthStyle,
  state,
  connected,
  telemetryError,
  onReset,
}: {
  health: HealthState;
  healthStyle: (typeof HEALTH_STYLES)[HealthState];
  state: ReturnType<typeof useTwinState>["state"];
  connected: boolean;
  telemetryError?: unknown;
  onReset: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/[0.07] p-5">
        <div className="text-[8px] uppercase tracking-[0.2em] text-white/25">
          Spacecraft Status
        </div>

        <h2 className="mt-1 text-base font-semibold">
          COSMOS-SAT-01
        </h2>

        <div className="mt-3 flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${healthStyle.dot}`}
          />

          <span
            className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${healthStyle.text}`}
          >
            {health}
          </span>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <PanelHeading
            icon={<Activity className="h-3.5 w-3.5" />}
          >
            Mission State
          </PanelHeading>

          <div className="mt-3 rounded-xl border border-white/[0.06] bg-white/[0.018] p-3">
            <div className="text-xs font-medium text-white/75">
              {MISSION_STATE_LABELS[state.missionState]}
            </div>

            <p className="mt-1 text-[9px] leading-relaxed text-white/25">
              Select a spacecraft component to inspect its
              telemetry and health state.
            </p>
          </div>
        </div>

        <div>
          <PanelHeading
            icon={<Satellite className="h-3.5 w-3.5" />}
          >
            Spacecraft
          </PanelHeading>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <MiniStat
              label="Subsystems"
              value="6"
            />

            <MiniStat
              label="Active faults"
              value={state.activeFaultId ? "1" : "0"}
            />

            <MiniStat
              label="Telemetry"
              value={connected ? "LIVE" : "OFFLINE"}
            />

            <MiniStat
              label="View"
              value={
                state.viewMode.toUpperCase()
              }
            />
          </div>
        </div>

        <div>
          <PanelHeading
            icon={
              <Thermometer className="h-3.5 w-3.5" />
            }
          >
            Operating Environment
          </PanelHeading>

          <div className="mt-3 space-y-2 text-[10px]">
            <div className="flex justify-between">
              <span className="text-white/30">
                Battery temperature
              </span>

              <span className="font-mono text-white/60">
                {formatNumber(
                  state.telemetryOverride
                    ?.battery_temperature
                )}{" "}
                °C
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-white/30">
                OBC temperature
              </span>

              <span className="font-mono text-white/60">
                {formatNumber(
                  state.telemetryOverride
                    ?.obc_temperature
                )}{" "}
                °C
              </span>
            </div>
          </div>
        </div>

        {telemetryError && (
          <div className="rounded-lg border border-amber-400/15 bg-amber-400/[0.035] p-3">
            <div className="text-[9px] font-medium uppercase tracking-[0.14em] text-amber-400">
              Telemetry Warning
            </div>

            <p className="mt-1 text-[9px] leading-relaxed text-white/30">
              The digital twin remains available using
              the latest known state.
            </p>
          </div>
        )}
      </div>

      <div className="mt-auto border-t border-white/[0.07] p-5">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="w-full border-white/[0.08] bg-white/[0.02] text-white/50 hover:bg-white/[0.06] hover:text-white"
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          Reset Digital Twin
        </Button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RECOVERY PANEL
═══════════════════════════════════════════════════════════ */

function RecoveryPanel({
  state,
  recoveryPercent,
  telemetry,
  onReset,
}: {
  state: ReturnType<typeof useTwinState>["state"];
  recoveryPercent: number;
  telemetry: Record<string, unknown>;
  onReset: () => void;
}) {
  const recovered =
    state.missionState === "RECOVERED";

  const failed =
    state.missionState === "RECOVERY_FAILED";

  const verifying =
    state.missionState === "VERIFICATION";

  return (
    <section
      className={`rounded-2xl border p-5 ${
        recovered
          ? "border-emerald-400/20 bg-emerald-400/[0.035]"
          : failed
            ? "border-red-400/20 bg-red-400/[0.035]"
            : "border-cyan-400/15 bg-cyan-400/[0.025]"
      }`}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            {recovered ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : failed ? (
              <AlertTriangle className="h-4 w-4 text-red-400" />
            ) : (
              <Activity className="h-4 w-4 text-cyan-300" />
            )}

            <span
              className={`text-[9px] font-semibold uppercase tracking-[0.18em] ${
                recovered
                  ? "text-emerald-400"
                  : failed
                    ? "text-red-400"
                    : "text-cyan-300"
              }`}
            >
              {recovered
                ? "SPACECRAFT RECOVERED"
                : failed
                  ? "RECOVERY FAILED"
                  : verifying
                    ? "VERIFICATION"
                    : "RECOVERY IN PROGRESS"}
            </span>
          </div>

          <p className="mt-2 max-w-xl text-xs leading-relaxed text-white/35">
            {recovered
              ? "The simulated intervention restored the monitored telemetry channels to their nominal operating ranges."
              : failed
                ? "The intervention did not restore all monitored channels. Further investigation is required."
                : "COSMOS is evaluating the spacecraft response to the simulated corrective action."}
          </p>
        </div>

        <div className="min-w-[180px]">
          <div className="flex items-center justify-between text-[9px]">
            <span className="uppercase tracking-[0.14em] text-white/25">
              Recovery
            </span>

            <span className="font-mono text-white/60">
              {recoveryPercent}%
            </span>
          </div>

          <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className={`h-full transition-all duration-500 ${
                recovered
                  ? "bg-emerald-400"
                  : failed
                    ? "bg-red-400"
                    : "bg-cyan-300"
              }`}
              style={{
                width: `${recoveryPercent}%`,
              }}
            />
          </div>
        </div>
      </div>

      {state.recoveryProgress.length > 0 && (
        <div className="mt-5 grid gap-2 md:grid-cols-2 lg:grid-cols-4">
          {state.recoveryProgress.map((item) => (
            <div
              key={item.channel}
              className="rounded-lg border border-white/[0.06] bg-white/[0.018] p-3"
            >
              <div className="text-[9px] text-white/30">
                {item.label}
              </div>

              <div className="mt-1 flex items-end justify-between gap-2">
                <span className="font-mono text-xs text-white/75">
                  {formatNumber(item.currentValue)}
                </span>

                <span className="font-mono text-[9px] text-white/20">
                  → {formatNumber(item.targetValue)}
                </span>
              </div>

              <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className={`h-full transition-all duration-300 ${
                    item.recovered
                      ? "bg-emerald-400"
                      : "bg-cyan-300"
                  }`}
                  style={{
                    width: `${
                      item.recovered
                        ? 100
                        : Math.min(
                            95,
                            Math.max(
                              5,
                              Math.abs(
                                item.currentValue
                              ) /
                                Math.max(
                                  Math.abs(
                                    item.targetValue
                                  ),
                                  1
                                ) *
                                100
                            )
                          )
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {state.verificationResults.length > 0 && (
        <div className="mt-4 border-t border-white/[0.06] pt-4">
          <div className="mb-2 text-[8px] font-semibold uppercase tracking-[0.18em] text-white/25">
            Verification
          </div>

          <div className="flex flex-wrap gap-2">
            {state.verificationResults.map((result) => (
              <div
                key={result.channel}
                className={`flex items-center gap-1.5 rounded-md border px-2 py-1 ${
                  result.passed
                    ? "border-emerald-400/15 bg-emerald-400/[0.04] text-emerald-400"
                    : "border-red-400/15 bg-red-400/[0.04] text-red-400"
                }`}
              >
                {result.passed ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <AlertTriangle className="h-3 w-3" />
                )}

                <span className="text-[8px] uppercase tracking-[0.08em]">
                  {result.channel.replace(
                    /_/g,
                    " "
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(recovered || failed) && (
        <div className="mt-4 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="border-white/[0.08] bg-white/[0.02] text-white/50 hover:bg-white/[0.06] hover:text-white"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reset Scenario
          </Button>
        </div>
      )}

      {/* Avoid unused-variable linting when the telemetry object
          is intentionally kept available for future verification UI. */}
      <span className="hidden">
        {Object.keys(telemetry).length}
      </span>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FAULT PROPAGATION OVERLAY
═══════════════════════════════════════════════════════════ */

function FaultPropagationOverlay({
  faultName,
  chain,
  missionState,
}: {
  faultName: string;
  chain: SubsystemId[];
  missionState: string;
}) {
  return (
    <div className="pointer-events-none absolute right-4 top-4 w-[250px] rounded-xl border border-red-400/15 bg-[#080b12]/90 p-3 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Zap className="h-3.5 w-3.5 text-red-400" />

        <span className="text-[8px] font-semibold uppercase tracking-[0.16em] text-red-400">
          Fault Propagation
        </span>
      </div>

      <div className="mt-2 text-[10px] font-medium text-white/70">
        {faultName}
      </div>

      <div className="mt-3 flex items-center gap-1 overflow-x-auto">
        {chain.map((subsystem, index) => (
          <div
            key={`${subsystem}-${index}`}
            className="flex shrink-0 items-center gap-1"
          >
            <div
              className={`rounded border px-2 py-1 text-[8px] font-medium ${
                index === 0
                  ? "border-red-400/25 bg-red-400/[0.08] text-red-300"
                  : "border-amber-400/20 bg-amber-400/[0.05] text-amber-300"
              }`}
            >
              {subsystem}
            </div>

            {index < chain.length - 1 && (
              <ChevronRight className="h-3 w-3 text-white/20" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-2 text-[8px] uppercase tracking-[0.1em] text-white/20">
        {missionState.replace(/_/g, " ")}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TIMELINE
═══════════════════════════════════════════════════════════ */

function TimelineRow({
  timestamp,
  message,
  severity,
}: {
  timestamp: Date;
  message: string;
  severity:
    | "info"
    | "warning"
    | "critical"
    | "success";
}) {
  const severityClass = {
    info: "bg-cyan-300",
    warning: "bg-amber-400",
    critical: "bg-red-400",
    success: "bg-emerald-400",
  }[severity];

  return (
    <div className="flex items-center gap-3 border-b border-white/[0.035] px-4 py-2.5 last:border-b-0">
      <span className="w-16 shrink-0 font-mono text-[8px] text-white/20">
        {timestamp.toLocaleTimeString([], {
          hour12: false,
        })}
      </span>

      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${severityClass}`}
      />

      <span className="text-[9px] text-white/45">
        {message}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SMALL COMPONENTS
═══════════════════════════════════════════════════════════ */

function PanelHeading({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/30">
      {icon}
      {children}
    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.018] p-3">
      <div className="text-[8px] uppercase tracking-[0.12em] text-white/20">
        {label}
      </div>

      <div className="mt-1 text-[10px] font-medium text-white/60">
        {value}
      </div>
    </div>
  );
}