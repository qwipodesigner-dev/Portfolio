"use client";

import { Suspense, useCallback, useState } from "react";
import dynamic from "next/dynamic";
import type { Application as SplineApplication } from "@splinetool/runtime";

// Load the Spline React component only on the client — it pulls in WebGL
const Spline = dynamic(
  () => import("@splinetool/react-spline").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-[radial-gradient(circle_at_50%_50%,rgba(232,93,46,0.18),transparent_60%)]" />
    ),
  }
);

type Props = {
  /** Either a hosted public URL (https://prod.spline.design/.../scene.splinecode)
   *  or a local path under /public. */
  scene: string;
  /** Zoom factor applied to the scene's camera once it loads.
   *  Lower than 1 = scene appears smaller, less cropping in tall containers. */
  zoom?: number;
};

/**
 * Spline-powered hero. Wraps <Spline> in Suspense, applies a configurable
 * zoom on load so the scene fits inside our narrow-tall hero column without
 * being cropped, and falls back to the original radial-gradient glow if the
 * scene fails to load.
 */
export function HeroSpline({ scene, zoom = 0.6 }: Props) {
  const [errored, setErrored] = useState(false);

  const handleLoad = useCallback(
    (spline: SplineApplication) => {
      try {
        // Spline's runtime exposes setZoom on the orthographic / perspective
        // camera. Calling on the wrong camera type silently no-ops, which is
        // fine for our purposes.
        const app = spline as SplineApplication & {
          setZoom?: (zoom: number) => void;
        };
        app.setZoom?.(zoom);
      } catch {
        /* swallow — fitting is best-effort */
      }
    },
    [zoom]
  );

  return (
    <div className="relative h-full w-full" aria-hidden="true">
      {!errored && (
        <Suspense
          fallback={
            <div className="h-full w-full bg-[radial-gradient(circle_at_50%_50%,rgba(232,93,46,0.18),transparent_60%)]" />
          }
        >
          <Spline
            scene={scene}
            onLoad={handleLoad}
            onError={() => setErrored(true)}
            style={{ width: "100%", height: "100%" }}
          />
        </Suspense>
      )}

      {errored && (
        <div className="h-full w-full bg-[radial-gradient(circle_at_50%_50%,rgba(232,93,46,0.22),transparent_55%)]" />
      )}

      {/* Ambient glow underneath the scene */}
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
