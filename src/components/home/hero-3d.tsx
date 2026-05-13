"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Environment,
  RoundedBox,
  OrbitControls,
} from "@react-three/drei";
import { useEffect, useRef, Suspense } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { useTheme } from "next-themes";

/**
 * Floating composition of design primitives — a rounded cube (the system),
 * a wireframe cage (the structure), an accent sphere (the spark), and
 * floating rings + dots (the details). All meshes drift independently via
 * <Float>; OrbitControls owns the camera, so dragging anywhere on the
 * canvas rotates the whole composition.
 */
function DesignComposition() {
  const { resolvedTheme } = useTheme();
  const wireColor = resolvedTheme === "dark" ? "#f2f2ee" : "#0a0a0a";

  return (
    <group>
      {/* Central rounded cube — primary system form */}
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.5}>
        <RoundedBox args={[1.3, 1.3, 1.3]} radius={0.18} smoothness={4}>
          <meshStandardMaterial
            color="#e85d2e"
            roughness={0.25}
            metalness={0.4}
          />
        </RoundedBox>
      </Float>

      {/* Wireframe cage — structure around it */}
      <Float speed={0.7} rotationIntensity={0.3} floatIntensity={0.3}>
        <mesh>
          <boxGeometry args={[2.0, 2.0, 2.0]} />
          <meshBasicMaterial
            color={wireColor}
            wireframe
            transparent
            opacity={0.18}
          />
        </mesh>
      </Float>

      {/* Floating accent sphere — top right */}
      <Float speed={2.2} rotationIntensity={0.2} floatIntensity={1.4}>
        <mesh position={[1.7, 0.85, 0.2]}>
          <icosahedronGeometry args={[0.18, 1]} />
          <meshStandardMaterial
            color="#e85d2e"
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>
      </Float>

      {/* Wireframe ring — bottom left, large */}
      <Float speed={1.6} rotationIntensity={1.5} floatIntensity={0.6}>
        <mesh
          position={[-1.5, -0.7, 0.4]}
          rotation={[Math.PI / 3, 0, Math.PI / 6]}
        >
          <torusGeometry args={[0.45, 0.04, 16, 64]} />
          <meshBasicMaterial color={wireColor} transparent opacity={0.55} />
        </mesh>
      </Float>

      {/* Accent ring — top left, small */}
      <Float speed={1.4} rotationIntensity={1.0} floatIntensity={0.8}>
        <mesh
          position={[-1.3, 0.9, -0.3]}
          rotation={[Math.PI / 6, Math.PI / 4, 0]}
        >
          <torusGeometry args={[0.3, 0.025, 12, 48]} />
          <meshBasicMaterial color="#e85d2e" transparent opacity={0.7} />
        </mesh>
      </Float>

      {/* Tiny accent dot — bottom right */}
      <Float speed={2.6} floatIntensity={1.6}>
        <mesh position={[1.6, -1.0, 0.4]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#e85d2e" />
        </mesh>
      </Float>
    </group>
  );
}

/**
 * Camera controller. Auto-rotates by default, pauses when the user drags,
 * resumes after a brief idle delay. Reads a parent-owned spinBoostRef so
 * a click on the canvas can temporarily inject extra rotation speed.
 */
function Controls({
  spinBoostRef,
}: {
  spinBoostRef: React.MutableRefObject<number>;
}) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  // Pause auto-rotate while user is dragging; resume after a short delay
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    let resumeTimer: ReturnType<typeof setTimeout> | null = null;

    const onStart = () => {
      if (resumeTimer) clearTimeout(resumeTimer);
      controls.autoRotate = false;
    };
    const onEnd = () => {
      resumeTimer = setTimeout(() => {
        if (controls) controls.autoRotate = true;
      }, 1500);
    };

    controls.addEventListener("start", onStart);
    controls.addEventListener("end", onEnd);

    return () => {
      controls.removeEventListener("start", onStart);
      controls.removeEventListener("end", onEnd);
      if (resumeTimer) clearTimeout(resumeTimer);
    };
  }, []);

  // Drive autoRotateSpeed each frame so a click-boost decays smoothly
  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const target = 0.5 + spinBoostRef.current;
    controls.autoRotateSpeed = THREE.MathUtils.lerp(
      controls.autoRotateSpeed,
      target,
      0.06
    );
    if (spinBoostRef.current > 0) {
      spinBoostRef.current = Math.max(0, spinBoostRef.current - 0.08);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.85}
      autoRotate
      autoRotateSpeed={0.5}
      // Keep the composition the right way up — don't let the user
      // rotate the camera below the floor or directly overhead.
      minPolarAngle={Math.PI / 3.2}
      maxPolarAngle={Math.PI / 1.8}
    />
  );
}

export function Hero3D() {
  const spinBoostRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cursor: grab when hovering, grabbing when dragging — gives clear
  // affordance that the cube is interactive.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onDown = () => {
      el.style.cursor = "grabbing";
    };
    const onUp = () => {
      el.style.cursor = "grab";
    };
    el.style.cursor = "grab";
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full" aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5.5], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        // Click anywhere on the canvas (without dragging) gives the
        // cube a temporary rotation-speed boost that decays naturally.
        onClick={() => {
          spinBoostRef.current = 12;
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[3, 3, 3]} intensity={1.2} />
          <directionalLight
            position={[-3, -2, -3]}
            intensity={0.4}
            color="#ffc9b0"
          />
          <DesignComposition />
          <Environment preset="city" />
          <Controls spinBoostRef={spinBoostRef} />
        </Suspense>
      </Canvas>

      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(232,93,46,0.35), transparent 60%)",
        }}
      />
    </div>
  );
}
