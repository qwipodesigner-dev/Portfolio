"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  sizes: string;
  priority?: boolean;
};

/**
 * Renders the portrait photo. If the file doesn't exist yet
 * (i.e. /public/images/vikas-portrait.jpg hasn't been added),
 * falls back to nothing so the parent gradient backdrop shows
 * through cleanly without a broken-image indicator.
 */
export function PortraitImage({ sizes, priority }: Props) {
  const [errored, setErrored] = useState(false);
  if (errored) return null;
  return (
    <Image
      src="/images/vikas-portrait.jpg"
      alt="Vikas Mittapalli"
      fill
      sizes={sizes}
      className="object-cover"
      priority={priority}
      onError={() => setErrored(true)}
    />
  );
}
