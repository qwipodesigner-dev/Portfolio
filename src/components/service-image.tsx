"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  /** Hex color used for the gradient fallback when the image isn't there yet. */
  accent?: string;
  /** CSS aspect-ratio. Defaults to 16/10 (a wide editorial crop). */
  aspectRatio?: string;
  /** Optional caption rendered under the image. */
  caption?: string;
  /** Hint for next/image's responsive sizing. */
  sizes?: string;
};

/**
 * Renders an optional image with a colored gradient fallback. Used on
 * service detail pages where real photos / screenshots can be dropped
 * into /public/images/services/ later — until then, the gradient reads
 * as an editorial placeholder rather than a broken-image icon.
 */
export function ServiceImage({
  src,
  alt,
  accent = "#e85d2e",
  aspectRatio = "16/10",
  caption,
  sizes = "(min-width: 768px) 720px, 100vw",
}: Props) {
  const [errored, setErrored] = useState(false);
  return (
    <figure className="my-12 md:my-16">
      <div
        className="relative overflow-hidden rounded-3xl border border-border w-full"
        style={{
          aspectRatio,
          background: `linear-gradient(135deg, ${accent}24 0%, transparent 60%), radial-gradient(circle at 70% 30%, ${accent}40, transparent 60%)`,
        }}
      >
        {!errored && (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            className="object-cover"
            onError={() => setErrored(true)}
          />
        )}
        {/* Decorative corner mark when the image is absent */}
        {errored && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="h-32 w-32 md:h-48 md:w-48 rounded-3xl border border-fg/10 backdrop-blur-md"
              style={{
                background: `linear-gradient(135deg, ${accent}38, transparent)`,
              }}
            />
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-4 text-center font-mono text-xs uppercase tracking-[0.18em] text-fg-subtle">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
