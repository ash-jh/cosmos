"use client";

import {
  memo,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import type {
  ComponentId,
  HealthState,
} from "../lib/subsystem-config";
import { COMPONENT_LABELS } from "../lib/subsystem-config";

// ─────────────────────────────────────────────────────────────
// COSMOS Digital Twin — CubeSat Model
//
// Interactive CubeSat representation.
//
// Supports:
// - Component selection
// - Hover highlighting
// - Health-state visualization
// - Fault pulsing
// - Exploded view
// - Component labels
// - Basic CubeSat internal architecture
// ─────────────────────────────────────────────────────────────

interface CubeSatModelProps {
  exploded: boolean;
  selectedComponent: ComponentId | null;
  hoveredComponent: ComponentId | null;
  componentHealth: Record<ComponentId, HealthState>;
  faultedComponents: ComponentId[];
  viewMode: "systems" | "telemetry" | "faults";
  onComponentClick: (id: ComponentId) => void;
  onComponentHover: (id: ComponentId | null) => void;
}

// ─────────────────────────────────────────────────────────────
// Visual constants
// ─────────────────────────────────────────────────────────────

const COLORS = {
  frame: "#B8C2CC",
  frameDark: "#697580",
  panel: "#8E9AA5",
  panelDark: "#56616B",
  electronics: "#AAB5BF",
  battery: "#D0D7DE",
  metal: "#C4CCD4",
  dark: "#26313A",

  cyan: "#00F2FE",
  blue: "#4FACFE",
  warning: "#FFB020",
  critical: "#FF4D4D",
  nominal: "#00E676",
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function getHealthColor(health: HealthState) {
  switch (health) {
    case "critical":
      return "#ff4d4d";
    case "warning":
      return "#ffb020";
    default:
      return "#00e676";
  }
}

function Bolt({
  position,
  size = 0.035,
}: {
  position: [number, number, number];
  size?: number;
}) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[size, size, 0.018, 12]} />
      <meshStandardMaterial
        color="#D5DDE3"
        metalness={0.9}
        roughness={0.28}
      />
    </mesh>
  );
}

function PCBTrace({
  position,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <boxGeometry args={[0.012, 0.003, 0.12]} />
      <meshStandardMaterial
        color="#2B6570"
        emissive="#00F2FE"
        emissiveIntensity={0.08}
        metalness={0.3}
        roughness={0.5}
      />
    </mesh>
  );
}

function Chip({
  position,
  size = [0.12, 0.025, 0.12],
}: {
  position: [number, number, number];
  size?: [number, number, number];
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color="#202830"
        metalness={0.45}
        roughness={0.38}
      />
    </mesh>
  );
}

function StatusLED({
  position,
  color = "#00E676",
  active = true,
}: {
  position: [number, number, number];
  color?: string;
  active?: boolean;
}) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.025, 12, 12]} />
      <meshStandardMaterial
        color={color}
        emissive={active ? color : "#111111"}
        emissiveIntensity={active ? 2.5 : 0}
        toneMapped={false}
      />
    </mesh>
  );
}

function CubeSatFrame() {
  const rails = [
    [-0.92, 0, -0.92],
    [0.92, 0, -0.92],
    [-0.92, 0, 0.92],
    [0.92, 0, 0.92],
  ] as [number, number, number][];

  return (
    <group>
      {/* Main body */}
      <mesh>
        <boxGeometry args={[1.75, 2.1, 1.75]} />
        <meshStandardMaterial
          color="#AEB9C2"
          metalness={0.78}
          roughness={0.32}
        />
      </mesh>

      {/* Dark internal cavity */}
      <mesh position={[0, 0, 0.89]}>
        <boxGeometry args={[1.52, 1.85, 0.035]} />
        <meshStandardMaterial
          color="#151C22"
          metalness={0.35}
          roughness={0.7}
        />
      </mesh>

      {/* Structural rails */}
      {rails.map((position, index) => (
        <mesh key={index} position={position}>
          <boxGeometry args={[0.11, 2.25, 0.11]} />
          <meshStandardMaterial
            color="#D2D9DE"
            metalness={0.92}
            roughness={0.24}
          />
        </mesh>
      ))}

      {/* Corner bolts */}
      {[-0.92, 0.92].flatMap((x) =>
        [-0.92, 0.92].map((z) => (
          <group key={`${x}-${z}`}>
            <Bolt position={[x, 0.92, z]} />
            <Bolt position={[x, -0.92, z]} />
          </group>
        ))
      )}

      {/* Horizontal frame seams */}
      {[-0.55, 0, 0.55].map((y) => (
        <mesh key={y} position={[0, y, 0.91]}>
          <boxGeometry args={[1.55, 0.012, 0.025]} />
          <meshStandardMaterial
            color="#5E6972"
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

function SolarPanel({
  side,
  health,
}: {
  side: "left" | "right";
  health: HealthState;
}) {
  const x = side === "left" ? -1.75 : 1.75;

  const cells = Array.from({ length: 24 });

  const panelColor =
    health === "critical"
      ? "#55343A"
      : health === "warning"
        ? "#66512D"
        : "#173B55";

  return (
    <group position={[x, 0, 0]}>
      {/* Panel backing */}
      <mesh rotation={[0, 0, 0]}>
        <boxGeometry args={[1.35, 1.9, 0.045]} />
        <meshStandardMaterial
          color="#26323B"
          metalness={0.65}
          roughness={0.32}
        />
      </mesh>

      {/* Individual solar cells */}
      {cells.map((_, index) => {
        const row = Math.floor(index / 4);
        const col = index % 4;

        return (
          <mesh
            key={index}
            position={[
              -0.49 + col * 0.33,
              -0.68 + row * 0.23,
              0.027,
            ]}
          >
            <boxGeometry args={[0.29, 0.19, 0.012]} />
            <meshStandardMaterial
              color={panelColor}
              metalness={0.35}
              roughness={0.38}
            />
          </mesh>
        );
      })}

      {/* Panel border */}
      <mesh position={[0, 0, 0.035]}>
        <boxGeometry args={[1.38, 1.93, 0.012]} />
        <meshBasicMaterial
          color={
            health === "critical"
              ? "#FF4D4D"
              : health === "warning"
                ? "#FFB020"
                : "#6B8795"
          }
          wireframe
        />
      </mesh>

      {/* Mounting hub */}
      <mesh position={[side === "left" ? 0.72 : -0.72, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
        <meshStandardMaterial
          color="#BFC7CD"
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>
    </group>
  );
}

function BatteryMesh({
  health,
}: {
  health: HealthState;
}) {
  const faultColor =
    health === "critical"
      ? "#FF4D4D"
      : health === "warning"
        ? "#FFB020"
        : "#00E676";

  return (
    <group>
      {/* Battery housing */}
      <mesh>
        <boxGeometry args={[0.72, 0.52, 0.62]} />
        <meshStandardMaterial
          color="#C5CED5"
          metalness={0.72}
          roughness={0.32}
        />
      </mesh>

      {/* Individual battery cells */}
      {[-0.22, 0, 0.22].map((x) => (
        <mesh key={x} position={[x, 0, 0.325]}>
          <cylinderGeometry args={[0.09, 0.09, 0.42, 12]} />
          <meshStandardMaterial
            color="#303A42"
            metalness={0.55}
            roughness={0.42}
          />
        </mesh>
      ))}

      {/* Battery terminal */}
      <mesh position={[0, 0.29, 0.02]}>
        <boxGeometry args={[0.45, 0.035, 0.08]} />
        <meshStandardMaterial
          color="#6E7B84"
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>

      {/* Status LED */}
      <StatusLED
        position={[0.29, 0.15, 0.325]}
        color={faultColor}
      />

      {/* Fault glow */}
      {health !== "nominal" && (
        <pointLight
          position={[0, 0, 0.5]}
          color={faultColor}
          intensity={health === "critical" ? 1.8 : 0.8}
          distance={1.2}
        />
      )}
    </group>
  );
}

function OBCMesh({
  health,
}: {
  health: HealthState;
}) {
  return (
    <group>
      {/* PCB */}
      <mesh>
        <boxGeometry args={[0.95, 0.06, 0.72]} />
        <meshStandardMaterial
          color="#1B4A50"
          metalness={0.3}
          roughness={0.55}
        />
      </mesh>

      {/* Main processor */}
      <Chip position={[0, 0.055, 0]} size={[0.24, 0.04, 0.24]} />

      {/* Secondary ICs */}
      <Chip position={[-0.3, 0.055, -0.2]} />
      <Chip position={[0.3, 0.055, -0.2]} />
      <Chip position={[-0.3, 0.055, 0.2]} />
      <Chip position={[0.3, 0.055, 0.2]} />

      {/* PCB traces */}
      <PCBTrace position={[0, 0.09, -0.3]} />
      <PCBTrace position={[-0.22, 0.09, 0.3]} />
      <PCBTrace position={[0.22, 0.09, 0.3]} />

      <StatusLED
        position={[0.43, 0.075, 0.27]}
        color={
          health === "critical"
            ? "#FF4D4D"
            : health === "warning"
              ? "#FFB020"
              : "#00E676"
        }
      />
    </group>
  );
}

function getHealthIntensity(health: HealthState) {
  switch (health) {
    case "critical":
      return 1.25;
    case "warning":
      return 0.9;
    default:
      return 0.35;
  }
}

function getComponentColor(
  id: ComponentId,
  health: HealthState,
  viewMode: CubeSatModelProps["viewMode"]
) {
  if (viewMode === "faults") {
    return getHealthColor(health);
  }

  switch (id) {
    case "battery":
      return COLORS.battery;

    case "power_bus":
      return COLORS.power;

    case "obc_board":
      return COLORS.obc;

    case "reaction_wheel":
    case "imu":
      return COLORS.adcs;

    case "radio":
    case "antenna":
      return COLORS.comm;

    case "thermal_sensor":
      return COLORS.thermal;

    case "payload_module":
      return COLORS.payload;

    default:
      return COLORS.frame;
  }
}

function getComponentEdgeColor(id: ComponentId) {
  switch (id) {
    case "battery":
      return COLORS.batteryEdge;

    case "power_bus":
      return COLORS.powerEdge;

    case "obc_board":
      return COLORS.obcEdge;

    case "reaction_wheel":
    case "imu":
      return COLORS.adcsEdge;

    case "radio":
    case "antenna":
      return COLORS.commEdge;

    case "thermal_sensor":
      return COLORS.thermalEdge;

    case "payload_module":
      return COLORS.payloadEdge;

    default:
      return COLORS.frameEdge;
  }
}

// ─────────────────────────────────────────────────────────────
// Interactive component wrapper
// ─────────────────────────────────────────────────────────────

interface InteractiveComponentProps {
  id: ComponentId;
  position: [number, number, number];
  explodedPosition: [number, number, number];
  exploded: boolean;
  health: HealthState;
  selected: boolean;
  hovered: boolean;
  faulted: boolean;
  onClick: (id: ComponentId) => void;
  onHover: (id: ComponentId | null) => void;
  children: ReactNode;
}

function InteractiveComponent({
  id,
  position,
  explodedPosition,
  exploded,
  health,
  selected,
  hovered,
  faulted,
  onClick,
  onHover,
  children,
}: InteractiveComponentProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;

    // Move between normal and exploded positions.
    const targetPosition = exploded ? explodedPosition : position;

    groupRef.current.position.lerp(
      new THREE.Vector3(...targetPosition),
      0.08
    );

    // Slightly enlarge selected / hovered components.
    const targetScale = selected
      ? 1.12
      : hovered
        ? 1.06
        : 1;

    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );
  });

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        onClick(id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(id);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(null);
      }}
    >
      {children}

      {(selected || hovered || faulted) && (
        <pointLight
          intensity={faulted ? 1.5 : selected ? 0.8 : 0.4}
          distance={1.8}
          color={
            faulted
              ? "#ff4d4d"
              : health === "warning"
                ? "#ffb020"
                : "#00f2fe"
          }
        />
      )}

      {faulted && <FaultPulse />}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// Health pulse
// ─────────────────────────────────────────────────────────────

function FaultPulse({
  color,
  critical,
}: {
  color: string;
  critical: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const pulse = (Math.sin(clock.elapsedTime * (critical ? 6 : 3)) + 1) / 2;

    ref.current.scale.setScalar(1 + pulse * 0.18);
    const material = ref.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.08 + pulse * 0.18;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.65, 24, 24]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.15}
        depthWrite={false}
      />
    </mesh>
  );
}

function PowerBusMesh() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.65, 0.18, 1.15]} />
        <meshStandardMaterial
          color={COLORS.power}
          metalness={0.25}
          roughness={0.45}
        />
      </mesh>

      {[-0.55, 0, 0.55].map((x) => (
        <mesh
          key={x}
          position={[x, 0.11, 0]}
        >
          <boxGeometry args={[0.24, 0.025, 0.8]} />
          <meshBasicMaterial color={COLORS.powerEdge} />
        </mesh>
      ))}
    </group>
  );
}

function ReactionWheelMesh() {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.48, 0.48, 0.3, 32]} />
        <meshStandardMaterial
          color={COLORS.adcs}
          metalness={0.75}
          roughness={0.22}
        />
      </mesh>

      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.34, 24]} />
        <meshBasicMaterial color={COLORS.adcsEdge} />
      </mesh>
    </group>
  );
}

function IMUMesh() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.6, 0.32, 0.6]} />
        <meshStandardMaterial
          color={COLORS.adcs}
          metalness={0.4}
          roughness={0.35}
        />
      </mesh>

      <mesh position={[0, 0.19, 0]}>
        <boxGeometry args={[0.28, 0.05, 0.28]} />
        <meshBasicMaterial color={COLORS.adcsEdge} />
      </mesh>
    </group>
  );
}

function RadioMesh() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.2, 0.38, 0.9]} />
        <meshStandardMaterial
          color={COLORS.comm}
          metalness={0.45}
          roughness={0.35}
        />
      </mesh>

      <mesh position={[0, 0.23, 0]}>
        <boxGeometry args={[0.7, 0.04, 0.38]} />
        <meshBasicMaterial color={COLORS.commEdge} />
      </mesh>
    </group>
  );
}

function AntennaMesh() {
  return (
    <group>
      {/* Mount */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.22, 16]} />
        <meshStandardMaterial
          color="#59636e"
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>

      {/* Antenna rod */}
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 1.4, 12]} />
        <meshStandardMaterial
          color="#c3cbd3"
          metalness={0.9}
          roughness={0.18}
        />
      </mesh>

      {/* Antenna tip */}
      <mesh position={[0, 1.44, 0]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshBasicMaterial color={COLORS.commEdge} />
      </mesh>
    </group>
  );
}

function ThermalSensorMesh() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.45, 0.22, 0.45]} />
        <meshStandardMaterial
          color={COLORS.thermal}
          metalness={0.25}
          roughness={0.4}
        />
      </mesh>

      <mesh position={[0, 0.14, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={COLORS.thermalEdge} />
      </mesh>
    </group>
  );
}

function PayloadMesh() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.35, 0.7, 1.15]} />
        <meshStandardMaterial
          color={COLORS.payload}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Instrument aperture */}
      <mesh position={[0, 0, 0.59]}>
        <cylinderGeometry
          args={[0.34, 0.34, 0.08, 32]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <meshBasicMaterial color="#07131c" />
      </mesh>

      <mesh position={[0, 0, 0.64]}>
        <ringGeometry args={[0.23, 0.32, 32]} />
        <meshBasicMaterial
          color={COLORS.payloadEdge}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// Component label
// ─────────────────────────────────────────────────────────────

function ComponentLabel({
  id,
  position,
  visible,
  health,
}: {
  id: ComponentId;
  position: [number, number, number];
  visible: boolean;
  health: HealthState;
}) {
  if (!visible) return null;

  const color = getHealthColor(health);

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>

      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={
              new Float32Array([
                0,
                0,
                0,
                0.35,
                0.15,
                0,
              ])
            }
            itemSize={3}
          />
        </bufferGeometry>

        <lineBasicMaterial
          color={color}
          transparent
          opacity={0.45}
        />
      </line>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// Main model
// ─────────────────────────────────────────────────────────────

export const CubeSatModel = memo(function CubeSatModel({
  exploded,
  selectedComponent,
  hoveredComponent,
  componentHealth,
  faultedComponents,
  viewMode,
  onComponentClick,
  onComponentHover,
}: CubeSatModelProps) {
  const components = useMemo(
    () => ({
      battery: {
        position: [0, 1.35, 0] as [number, number, number],
        explodedPosition: [0, 2.15, 0] as [number, number, number],
      },

      power_bus: {
        position: [0, 0.55, 0] as [number, number, number],
        explodedPosition: [0, 0.9, 0] as [number, number, number],
      },

      obc_board: {
        position: [0, -0.15, 0] as [number, number, number],
        explodedPosition: [0, -0.1, 0] as [number, number, number],
      },

      reaction_wheel: {
        position: [-0.72, -0.9, 0] as [number, number, number],
        explodedPosition: [-1.25, -1.1, 0] as [number, number, number],
      },

      imu: {
        position: [0.65, -0.85, 0.3] as [number, number, number],
        explodedPosition: [1.15, -1.0, 0.45] as [number, number, number],
      },

      radio: {
        position: [0.72, 0.55, 0] as [number, number, number],
        explodedPosition: [1.2, 0.7, 0] as [number, number, number],
      },

      antenna: {
        position: [0, 1.95, 0.85] as [number, number, number],
        explodedPosition: [0, 2.55, 1.15] as [number, number, number],
      },

      thermal_sensor: {
        position: [-0.75, -1.15, 0.85] as [number, number, number],
        explodedPosition: [-1.1, -1.4, 1.1] as [number, number, number],
      },

      payload_module: {
        position: [0, -1.45, 0] as [number, number, number],
        explodedPosition: [0, -2.1, 0] as [number, number, number],
      },

      solar_panel_left: {
        position: [-2.15, 0, 0] as [number, number, number],
        explodedPosition: [-2.7, 0, 0] as [number, number, number],
      },

      solar_panel_right: {
        position: [2.15, 0, 0] as [number, number, number],
        explodedPosition: [2.7, 0, 0] as [number, number, number],
      },

      cubesat_frame: {
        position: [0, 0, 0] as [number, number, number],
        explodedPosition: [0, 0, 0] as [number, number, number],
      },
    }),
    []
  );

  const health = (id: ComponentId): HealthState =>
    componentHealth[id] ?? "nominal";

  const isSelected = (id: ComponentId) =>
    selectedComponent === id;

  const isHovered = (id: ComponentId) =>
    hoveredComponent === id;

  const isFaulted = (id: ComponentId) =>
    faultedComponents.includes(id);

  const showStatus =
    viewMode === "faults" ||
    selectedComponent !== null ||
    hoveredComponent !== null;

  return (
    <group>
      {/* ─────────────────────────────────────────────── */}
      {/* CubeSat structural frame                       */}
      {/* ─────────────────────────────────────────────── */}

      <InteractiveComponent
        id="cubesat_frame"
        position={components.cubesat_frame.position}
        explodedPosition={components.cubesat_frame.explodedPosition}
        health={health("cubesat_frame")}
        selected={isSelected("cubesat_frame")}
        hovered={isHovered("cubesat_frame")}
        faulted={isFaulted("cubesat_frame")}
        viewMode={viewMode}
        exploded={exploded}
        onClick={onComponentClick}
        onHover={onComponentHover}
      >
        <CubeSatFrame />
      </InteractiveComponent>

      {/* ─────────────────────────────────────────────── */}
      {/* Solar panels                                   */}
      {/* ─────────────────────────────────────────────── */}

      <InteractiveComponent
        id="solar_panel_left"
        position={components.solar_panel_left.position}
        explodedPosition={components.solar_panel_left.explodedPosition}
        health={health("solar_panel_left")}
        selected={isSelected("solar_panel_left")}
        hovered={isHovered("solar_panel_left")}
        faulted={isFaulted("solar_panel_left")}
        viewMode={viewMode}
        onClick={onComponentClick}
        exploded={exploded}
        onHover={onComponentHover}
      >
        <SolarPanel
  side="left"
  health={componentHealth.solar_panel_left}
/>

      </InteractiveComponent>

      <InteractiveComponent
        id="solar_panel_right"
        position={components.solar_panel_right.position}
        explodedPosition={components.solar_panel_right.explodedPosition}
        health={health("solar_panel_right")}
        selected={isSelected("solar_panel_right")}
        hovered={isHovered("solar_panel_right")}
        faulted={isFaulted("solar_panel_right")}
        viewMode={viewMode}
        exploded={exploded}
        onClick={onComponentClick}
        onHover={onComponentHover}
      >
        
<SolarPanel
  side="right"
  health={componentHealth.solar_panel_right}
/>
      </InteractiveComponent>

      {/* ─────────────────────────────────────────────── */}
      {/* Battery                                        */}
      {/* ─────────────────────────────────────────────── */}

      <InteractiveComponent
        id="battery"
        position={components.battery.position}
        explodedPosition={components.battery.explodedPosition}
        health={health("battery")}
        selected={isSelected("battery")}
        hovered={isHovered("battery")}
        faulted={isFaulted("battery")}
        viewMode={viewMode}
        exploded={exploded}
        onClick={onComponentClick}
        onHover={onComponentHover}
      >
        <BatteryMesh />

        {isFaulted("battery") && (
          <FaultPulse
            color={getHealthColor(health("battery"))}
            critical={health("battery") === "critical"}
          />
        )}
      </InteractiveComponent>

      {/* ─────────────────────────────────────────────── */}
      {/* Power bus                                      */}
      {/* ─────────────────────────────────────────────── */}

      <InteractiveComponent
        id="power_bus"
        position={components.power_bus.position}
        explodedPosition={components.power_bus.explodedPosition}
        health={health("power_bus")}
        selected={isSelected("power_bus")}
        hovered={isHovered("power_bus")}
        faulted={isFaulted("power_bus")}
        viewMode={viewMode}
        exploded={exploded}
        onClick={onComponentClick}
        onHover={onComponentHover}
      >
        <PowerBusMesh />
      </InteractiveComponent>

      {/* ─────────────────────────────────────────────── */}
      {/* OBC                                            */}
      {/* ─────────────────────────────────────────────── */}

      <InteractiveComponent
        id="obc_board"
        position={components.obc_board.position}
        explodedPosition={components.obc_board.explodedPosition}
        health={health("obc_board")}
        selected={isSelected("obc_board")}
        hovered={isHovered("obc_board")}
        faulted={isFaulted("obc_board")}
        viewMode={viewMode}
        exploded={exploded}
        onClick={onComponentClick}
        onHover={onComponentHover}
      >
        <OBCMesh
  health={componentHealth.obc_board}
/>

        {isFaulted("obc_board") && (
          <FaultPulse
            color={getHealthColor(health("obc_board"))}
            critical={health("obc_board") === "critical"}
          />
        )}
      </InteractiveComponent>

      {/* ─────────────────────────────────────────────── */}
      {/* ADCS                                           */}
      {/* ─────────────────────────────────────────────── */}

      <InteractiveComponent
        id="reaction_wheel"
        position={components.reaction_wheel.position}
        explodedPosition={components.reaction_wheel.explodedPosition}
        health={health("reaction_wheel")}
        selected={isSelected("reaction_wheel")}
        hovered={isHovered("reaction_wheel")}
        faulted={isFaulted("reaction_wheel")}
        viewMode={viewMode}
        exploded={exploded}
        onClick={onComponentClick}
        onHover={onComponentHover}
      >
        <ReactionWheelMesh />

        {isFaulted("reaction_wheel") && (
          <FaultPulse
            color={getHealthColor(health("reaction_wheel"))}
            critical={health("reaction_wheel") === "critical"}
          />
        )}
      </InteractiveComponent>

      <InteractiveComponent
        id="imu"
        position={components.imu.position}
        explodedPosition={components.imu.explodedPosition}
        health={health("imu")}
        selected={isSelected("imu")}
        hovered={isHovered("imu")}
        faulted={isFaulted("imu")}
        viewMode={viewMode}
        exploded={exploded}
        onClick={onComponentClick}
        onHover={onComponentHover}
      >
        <IMUMesh />
      </InteractiveComponent>

      {/* ─────────────────────────────────────────────── */}
      {/* Communications                                 */}
      {/* ─────────────────────────────────────────────── */}

      <InteractiveComponent
        id="radio"
        position={components.radio.position}
        explodedPosition={components.radio.explodedPosition}
        health={health("radio")}
        selected={isSelected("radio")}
        hovered={isHovered("radio")}
        faulted={isFaulted("radio")}
        viewMode={viewMode}
        exploded={exploded}
        onClick={onComponentClick}
        onHover={onComponentHover}
      >
        <RadioMesh />

        {isFaulted("radio") && (
          <FaultPulse
            color={getHealthColor(health("radio"))}
            critical={health("radio") === "critical"}
          />
        )}
      </InteractiveComponent>

      <InteractiveComponent
        id="antenna"
        position={components.antenna.position}
        explodedPosition={components.antenna.explodedPosition}
        health={health("antenna")}
        selected={isSelected("antenna")}
        hovered={isHovered("antenna")}
        faulted={isFaulted("antenna")}
        viewMode={viewMode}
        exploded={exploded}
        onClick={onComponentClick}
        onHover={onComponentHover}
      >
        <AntennaMesh />
      </InteractiveComponent>

      {/* ─────────────────────────────────────────────── */}
      {/* Thermal                                        */}
      {/* ─────────────────────────────────────────────── */}

      <InteractiveComponent
        id="thermal_sensor"
        position={components.thermal_sensor.position}
        explodedPosition={components.thermal_sensor.explodedPosition}
        health={health("thermal_sensor")}
        selected={isSelected("thermal_sensor")}
        hovered={isHovered("thermal_sensor")}
        faulted={isFaulted("thermal_sensor")}
        viewMode={viewMode}
        exploded={exploded}
        onClick={onComponentClick}
        onHover={onComponentHover}
      >
        <ThermalSensorMesh />

        {isFaulted("thermal_sensor") && (
          <FaultPulse
            color={getHealthColor(health("thermal_sensor"))}
            critical={health("thermal_sensor") === "critical"}
          />
        )}
      </InteractiveComponent>

      {/* ─────────────────────────────────────────────── */}
      {/* Payload                                        */}
      {/* ─────────────────────────────────────────────── */}

      <InteractiveComponent
        id="payload_module"
        position={components.payload_module.position}
        explodedPosition={components.payload_module.explodedPosition}
        health={health("payload_module")}
        selected={isSelected("payload_module")}
        hovered={isHovered("payload_module")}
        faulted={isFaulted("payload_module")}
        viewMode={viewMode}
        exploded={exploded}
        onClick={onComponentClick}
        onHover={onComponentHover}
      >
        <PayloadMesh />

        {isFaulted("payload_module") && (
          <FaultPulse
            color={getHealthColor(health("payload_module"))}
            critical={health("payload_module") === "critical"}
          />
        )}
      </InteractiveComponent>

      {/* ─────────────────────────────────────────────── */}
      {/* Fault/status markers                           */}
      {/* ─────────────────────────────────────────────── */}

      {showStatus && (
        <>
          <ComponentLabel
            id="battery"
            position={[0.8, 1.35, 0.6]}
            visible={
              selectedComponent === "battery" ||
              hoveredComponent === "battery" ||
              isFaulted("battery")
            }
            health={health("battery")}
          />

          <ComponentLabel
            id="obc_board"
            position={[0.85, -0.15, 0.55]}
            visible={
              selectedComponent === "obc_board" ||
              hoveredComponent === "obc_board" ||
              isFaulted("obc_board")
            }
            health={health("obc_board")}
          />

          <ComponentLabel
            id="reaction_wheel"
            position={[-1.2, -0.9, 0]}
            visible={
              selectedComponent === "reaction_wheel" ||
              hoveredComponent === "reaction_wheel" ||
              isFaulted("reaction_wheel")
            }
            health={health("reaction_wheel")}
          />
        </>
      )}
    </group>
  );
});

CubeSatModel.displayName = "CubeSatModel";