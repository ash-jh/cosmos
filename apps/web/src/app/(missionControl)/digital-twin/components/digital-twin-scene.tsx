// ─────────────────────────────────────────────────────────────
// COSMOS Digital Twin — Scene Wrapper
// Contains the Three.js Canvas, lighting, camera controls,
// and orchestration of the CubeSat model within the viewport.
// ─────────────────────────────────────────────────────────────

"use client";

import { Suspense, useCallback, useEffect, useRef, memo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

import type { ComponentId, HealthState, SubsystemId } from "../lib/subsystem-config";
import { COMPONENT_SUBSYSTEM_MAP, SUBSYSTEM_CONFIGS, DEFAULT_CAMERA_POSITION, DEFAULT_CAMERA_TARGET } from "../lib/subsystem-config";
import { CubeSatModel } from "../cubesat-model";

// ── Props ────────────────────────────────────────────────────

interface DigitalTwinSceneProps {
  exploded: boolean;
  selectedSubsystem: SubsystemId | null;
  selectedComponent: ComponentId | null;
  hoveredComponent: ComponentId | null;
  componentHealth: Record<ComponentId, HealthState>;
  faultedComponents: ComponentId[];
  viewMode: "systems" | "telemetry" | "faults";
  onComponentClick: (id: ComponentId) => void;
  onComponentHover: (id: ComponentId | null) => void;
  onSubsystemSelect: (id: SubsystemId) => void;
}

// ── Camera Controller ────────────────────────────────────────

function CameraController({
  target,
  position,
}: {
  target: [number, number, number];
  position: [number, number, number];
}) {
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (!controlsRef.current) return;

    const controls = controlsRef.current;
    const targetVec = new THREE.Vector3(...target);
    const positionVec = new THREE.Vector3(...position);

    // Smooth interpolation
    const startTarget = controls.target.clone();
    const startPosition = controls.object.position.clone();
    let progress = 0;

    const animate = () => {
      progress += 0.02;
      const t = Math.min(progress, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic

      controls.target.lerpVectors(startTarget, targetVec, eased);
      controls.object.position.lerpVectors(startPosition, positionVec, eased);
      controls.update();

      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [target, position]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={2}
      maxDistance={18}
      maxPolarAngle={Math.PI * 0.85}
      makeDefault
    />
  );
}

// ── Scene ────────────────────────────────────────────────────

function SceneContent({
  exploded,
  selectedComponent,
  hoveredComponent,
  componentHealth,
  faultedComponents,
  viewMode,
  onComponentClick,
  onComponentHover,
}: Omit<DigitalTwinSceneProps, "selectedSubsystem" | "onSubsystemSelect">) {
  return (
    <>
      <ambientLight intensity={0.55} />

      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      <directionalLight
        position={[-3, 4, -3]}
        intensity={0.6}
        color="#b9e8ee"
      />

      <pointLight
        position={[0, -3, 0]}
        intensity={0.2}
        color="#ffffff"
      />

      <CubeSatModel
        exploded={exploded}
        selectedComponent={selectedComponent}
        hoveredComponent={hoveredComponent}
        componentHealth={componentHealth}
        faultedComponents={faultedComponents}
        viewMode={viewMode}
        onComponentClick={onComponentClick}
        onComponentHover={onComponentHover}
      />

      <ContactShadows
        position={[0, -2.5, 0]}
        opacity={0.25}
        scale={12}
        blur={2.5}
        far={4}
        color="#000000"
      />
    </>
  );
}


// ── Main Export ───────────────────────────────────────────────

export const DigitalTwinScene = memo(function DigitalTwinScene(
  props: DigitalTwinSceneProps
) {
  const {
    exploded,
    selectedSubsystem,
    selectedComponent,
    hoveredComponent,
    componentHealth,
    faultedComponents,
    viewMode,
    onComponentClick,
    onComponentHover,
    onSubsystemSelect,
  } = props;

  // Determine camera position based on selected subsystem
  const cameraPosition = selectedSubsystem
    ? SUBSYSTEM_CONFIGS[selectedSubsystem].cameraPosition
    : DEFAULT_CAMERA_POSITION;

  const cameraTarget = selectedSubsystem
    ? SUBSYSTEM_CONFIGS[selectedSubsystem].cameraTarget
    : DEFAULT_CAMERA_TARGET;

  const handleComponentClick = useCallback(
    (id: ComponentId) => {
      onComponentClick(id);
      const subsystem = COMPONENT_SUBSYSTEM_MAP[id];
      if (subsystem) {
        onSubsystemSelect(subsystem);
      }
    },
    [onComponentClick, onSubsystemSelect]
  );

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#030508]">
      {/* Viewport grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <Canvas
  camera={{
    position: DEFAULT_CAMERA_POSITION,
    fov: 32,
    near: 0.1,
    far: 100,
  }}
  gl={{
    antialias: true,
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: 1.3,
  }}
  style={{ background: "transparent" }}
>
        <Suspense fallback={null}>
          <SceneContent
            exploded={exploded}
            selectedComponent={selectedComponent}
            hoveredComponent={hoveredComponent}
            componentHealth={componentHealth}
            faultedComponents={faultedComponents}
            viewMode={viewMode}
            onComponentClick={handleComponentClick}
            onComponentHover={onComponentHover}
          />
        </Suspense>

        <CameraController
          target={cameraTarget}
          position={cameraPosition}
        />
      </Canvas>

      {/* Corner labels */}
      <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2">
        <span className="text-[8px] font-medium uppercase tracking-[0.22em] text-white/15">
          3D VIEWPORT
        </span>
      </div>

      <div className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-2">
        <span className="text-[8px] font-medium uppercase tracking-[0.18em] text-white/12">
          SCROLL TO ZOOM · DRAG TO ROTATE
        </span>
      </div>
    </div>
  );
});

