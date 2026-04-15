"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  MeshDistortMaterial,
  MeshWobbleMaterial,
} from "@react-three/drei";
import { useRef, useState, Suspense } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

function Blob() {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const { resolvedTheme } = useTheme();

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // Follow pointer lazily
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      pointer.current.x * 0.5,
      0.05
    );
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      pointer.current.y * 0.3,
      0.05
    );
    // Ambient drift
    meshRef.current.rotation.z += delta * 0.08;
  });

  return (
    <group
      onPointerMove={(e) => {
        pointer.current.x = (e.point.x / 2) * 0.6;
        pointer.current.y = (e.point.y / 2) * -0.6;
      }}
    >
      <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.9}>
        {/* Main body — distorted accent sphere */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.1, 24]} />
          <MeshDistortMaterial
            color="#e85d2e"
            distort={0.38}
            speed={1.3}
            roughness={0.18}
            metalness={0.3}
          />
        </mesh>

        {/* Inner wireframe — precision over softness */}
        <mesh scale={1.02}>
          <icosahedronGeometry args={[1.1, 3]} />
          <meshBasicMaterial
            color={resolvedTheme === "dark" ? "#f2f2ee" : "#0a0a0a"}
            wireframe
            transparent
            opacity={0.14}
          />
        </mesh>

        {/* Floating satellite */}
        <mesh position={[2, 0.9, -1]} scale={0.18}>
          <icosahedronGeometry args={[1, 1]} />
          <MeshWobbleMaterial
            color="#e85d2e"
            factor={0.6}
            speed={2}
            roughness={0.3}
          />
        </mesh>
      </Float>
    </group>
  );
}

export function Hero3D() {
  const [ready, setReady] = useState(false);

  return (
    <div
      className="relative w-full h-full"
      aria-hidden="true"
      onPointerEnter={() => setReady(true)}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5.5], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[3, 3, 3]} intensity={1.1} />
          <directionalLight position={[-3, -2, -3]} intensity={0.35} color="#ffc9b0" />
          <Blob />
          <Environment preset="city" />
        </Suspense>
      </Canvas>

      {/* Glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(232,93,46,0.35), transparent 60%)",
        }}
      />
    </div>
  );
}
