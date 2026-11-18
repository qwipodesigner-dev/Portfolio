/**
 * URL validation for admin-entered media/embed URLs. Everything that
 * lands in an iframe/img/video src goes through here so stored content
 * (including restored revisions) can never smuggle javascript:/data:
 * URLs into the page. Also normalizes pasted YouTube/Vimeo links into
 * their embeddable player form - a plain watch URL refuses to render
 * inside an iframe (X-Frame-Options), which looks like a broken block.
 */

/** Returns a safe http(s) or site-relative URL, or null. */
export function safeMediaUrl(u: string | undefined | null): string | null {
  if (!u) return null;
  const s = u.trim();
  if (s.startsWith("/") && !s.startsWith("//")) return s;
  try {
    const parsed = new URL(s);
    if (parsed.protocol === "http:" || parsed.protocol === "https:")
      return parsed.href;
  } catch {
    /* not an absolute URL */
  }
  return null;
}

export type VideoSource =
  | { kind: "iframe"; src: string }
  | { kind: "file"; src: string };

/** Classify a video URL: hosted-player iframe vs direct media file. */
export function videoEmbedUrl(u: string | undefined | null): VideoSource | null {
  const safe = safeMediaUrl(u);
  if (!safe) return null;
  if (safe.startsWith("/")) return { kind: "file", src: safe };
  let parsed: URL;
  try {
    parsed = new URL(safe);
  } catch {
    return null;
  }
  const host = parsed.hostname.toLowerCase();

  if (host === "youtu.be") {
    const id = parsed.pathname.slice(1).split("/")[0];
    if (id) return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${id}` };
  }
  if (host === "youtube.com" || host.endsWith(".youtube.com") || host === "youtube-nocookie.com" || host.endsWith(".youtube-nocookie.com")) {
    if (parsed.pathname.startsWith("/embed/"))
      return { kind: "iframe", src: safe };
    const v = parsed.searchParams.get("v");
    if (v) return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${v}` };
    const shorts = parsed.pathname.match(/^\/shorts\/([\w-]+)/);
    if (shorts)
      return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${shorts[1]}` };
    return null;
  }
  if (host === "vimeo.com" || host.endsWith(".vimeo.com")) {
    if (host === "player.vimeo.com") return { kind: "iframe", src: safe };
    const id = parsed.pathname.match(/^\/(\d+)/);
    if (id) return { kind: "iframe", src: `https://player.vimeo.com/video/${id[1]}` };
    return null;
  }
  return { kind: "file", src: safe };
}
