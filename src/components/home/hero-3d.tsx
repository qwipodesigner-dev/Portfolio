"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, RoundedBox } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

/**
 * Floating composition of design primitives — a rounded cube (the system),
 * a wireframe cage (the structure), an accent sphere (the spark), and
 * floating rings + dots (the details). Reads as design language, not
 * a generic blob. Whole group rotates with the cursor.
 */
function DesignComposition() {
  const groupRef = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const { resolvedTheme } = useTheme();

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      pointer.current.x * 0.4,
      0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      pointer.current.y * 0.25,
      0.04
    );
  });

  const wireColor = resolvedTheme === "dark" ? "#f2f2ee" : "#0a0a0a";

  return (
    <group
      ref={groupRef}
      onPointerMove={(e) => {
        pointer.current.x = e.point.x * 0.25;
        pointer.current.y = e.point.y * -0.25;
      }}
    >
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

export function Hero3D() {
  return (
    <div className="relative w-full h-full" aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5.5], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
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
