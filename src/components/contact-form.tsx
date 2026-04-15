"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof values, string>>
  >({});

  function validate() {
    const next: typeof errors = {};
    if (!values.name.trim()) next.name = "Please share your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      next.email = "That email doesn't look quite right.";
    if (values.message.trim().length < 12)
      next.message = "A bit more context helps — at least a sentence.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    // Mock submission — wire to Resend / Formspree later
    await new Promise((r) => setTimeout(r, 900));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl border border-border bg-surface p-10 md:p-14 flex flex-col items-center text-center gap-4"
      >
        <div className="h-12 w-12 rounded-full bg-accent-soft flex items-center justify-center text-accent text-xl">
          ✓
        </div>
        <h2 className="font-display text-2xl md:text-3xl">
          Message received.
        </h2>
        <p className="max-w-sm text-fg-muted">
          Thanks, {values.name.split(" ")[0] || "friend"} — I&apos;ll get back to
          you within two business days.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8" noValidate>
      <Field
        label="Name"
        name="name"
        value={values.name}
        onChange={(v) => setValues((s) => ({ ...s, name: v }))}
        error={errors.name}
        placeholder="Your full name"
        autoComplete="name"
      />
      <Field
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={(v) => setValues((s) => ({ ...s, email: v }))}
        error={errors.email}
        placeholder="you@company.com"
        autoComplete="email"
      />
      <Field
        label="Message"
        name="message"
        multiline
        value={values.message}
        onChange={(v) => setValues((s) => ({ ...s, message: v }))}
        error={errors.message}
        placeholder="Tell me a bit about your project — timeline, shape of the problem, and what success looks like."
      />

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex items-center gap-3 rounded-full bg-fg text-bg px-6 py-4 text-sm font-medium hover:bg-accent hover:text-white transition-all disabled:opacity-60 hover:pr-8"
        >
          {status === "sending" ? "Sending…" : "Send message"}
          {status !== "sending" && (
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          )}
        </button>
        <span className="font-mono text-xs text-fg-subtle">
          Response within 2 business days
        </span>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  multiline,
  autoComplete,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;
  const shared =
    "w-full bg-transparent outline-none font-sans text-lg md:text-xl text-fg placeholder:text-fg-subtle py-3 border-b border-border focus:border-fg transition-colors";

  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1">
        <span
          className={`font-mono text-[11px] uppercase tracking-[0.22em] transition-colors ${
            focused || filled ? "text-fg" : "text-fg-muted"
          }`}
        >
          {label}
        </span>
        <AnimatePresence>
          {error && (
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="font-mono text-[11px] text-accent tracking-[0.18em] uppercase"
            >
              {error}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {multiline ? (
        <textarea
          name={name}
          rows={5}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className={`${shared} resize-none`}
        />
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={shared}
        />
      )}
    </label>
  );
}
