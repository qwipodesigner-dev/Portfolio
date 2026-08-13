"use client";

import { useRef, useState } from "react";
import { uploadResumeAction } from "../actions";

export function ResumeUpload({ currentUrl }: { currentUrl: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<
    { kind: "idle" } | { kind: "busy" } | { kind: "done"; url: string } | { kind: "error"; msg: string }
  >({ kind: "idle" });

  const upload = async (file: File) => {
    setStatus({ kind: "busy" });
    const fd = new FormData();
    fd.set("file", file);
    const res = await uploadResumeAction(fd);
    if (res.url) setStatus({ kind: "done", url: res.url });
    else setStatus({ kind: "error", msg: res.error ?? "Upload failed." });
  };

  const url = status.kind === "done" ? status.url : currentUrl;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6">
      <h2 className="font-display text-2xl">Resume</h2>
      <p className="text-sm text-fg-muted text-pretty">
        Upload a new PDF and every &ldquo;Download resume&rdquo; link on the
        site switches to it instantly — home, about, and footer.
      </p>
      <div className="flex items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
          }}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={status.kind === "busy"}
          className="rounded-full bg-fg text-bg px-5 py-2.5 text-sm font-medium hover:bg-accent hover:text-white transition-colors disabled:opacity-50"
        >
          {status.kind === "busy" ? "Uploading…" : "Upload new resume (PDF)"}
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-fg-muted hover:text-fg transition-colors"
        >
          View current ↗
        </a>
      </div>
      {status.kind === "done" && (
        <p className="text-sm text-green-600">
          Resume updated — live everywhere now.
        </p>
      )}
      {status.kind === "error" && (
        <p role="alert" className="text-sm text-red-500">
          {status.msg}
        </p>
      )}
    </div>
  );
}
