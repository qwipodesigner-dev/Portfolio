"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

type Variant = "default" | "hover" | "text";

export function CustomCursor() {
  const [variant, setVariant] = useState<Variant>("default");
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Inner dot — fast follow
  const dotX = useSpring(x, { damping: 30, stiffness: 500, mass: 0.3 });
  const dotY = useSpring(y, { damping: 30, stiffness: 500, mass: 0.3 });

  // Outer ring — lags behind for trail effect
  const ringX = useSpring(x, { damping: 22, stiffness: 180, mass: 0.7 });
  const ringY = useSpring(y, { damping: 22, stiffness: 180, mass: 0.7 });

  useEffect(() => {
    // Skip entirely on touch devices
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest) return;
      if (target.closest('a, button, [role="button"], [data-cursor="hover"]')) {
        setVariant("hover");
      } else if (
        target.closest('input, textarea, [contenteditable="true"], [data-cursor="text"]')
      ) {
        setVariant("text");
      } else {
        setVariant("default");
      }
    };

    const onWindowLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", onWindowLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onWindowLeave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* Inner dot — accent color */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[100] hidden md:block"
        style={{ x: dotX, y: dotY }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ opacity: { duration: 0.2 } }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
          animate={{
            width: variant === "hover" ? 0 : variant === "text" ? 2 : 6,
            height: variant === "hover" ? 0 : variant === "text" ? 22 : 6,
          }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        />
      </motion.div>

      {/* Outer ring — lags behind, mix-blend-difference for any-color visibility */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[100] hidden md:block mix-blend-difference"
        style={{ x: ringX, y: ringY }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ opacity: { duration: 0.2 } }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-white"
          animate={{
            width: variant === "hover" ? 64 : variant === "text" ? 4 : 28,
            height: variant === "hover" ? 64 : variant === "text" ? 4 : 28,
          }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
        />
      </motion.div>
    </>
  );
}
