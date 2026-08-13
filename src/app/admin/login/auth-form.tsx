"use client";

import { useActionState } from "react";
import { loginAction, setupAction, type FormState } from "../actions";

const inputCls =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-fg placeholder:text-fg-subtle focus:outline-none focus:border-accent transition-colors";

export function AuthForm({ mode }: { mode: "setup" | "login" }) {
  const action = mode === "setup" ? setupAction : loginAction;
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    undefined,
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
          {mode === "setup" ? "First-time setup" : "Admin"}
        </span>
        <h1 className="font-display text-4xl mt-3 mb-2">
          {mode === "setup" ? "Create your admin account." : "Welcome back."}
        </h1>
        <p className="text-fg-muted mb-8 text-pretty">
          {mode === "setup"
            ? "One account, yours. Set the email and password you'll use to manage the portfolio."
            : "Log in to manage your portfolio content."}
        </p>

        <form action={formAction} className="flex flex-col gap-4">
          <input
            className={inputCls}
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="username"
            required
          />
          <input
            className={inputCls}
            type="password"
            name="password"
            placeholder={mode === "setup" ? "Password (min 10 characters)" : "Password"}
            autoComplete={mode === "setup" ? "new-password" : "current-password"}
            minLength={mode === "setup" ? 10 : undefined}
            required
          />
          {mode === "setup" && (
            <input
              className={inputCls}
              type="password"
              name="confirm"
              placeholder="Confirm password"
              autoComplete="new-password"
              minLength={10}
              required
            />
          )}

          {state?.error && (
            <p role="alert" className="text-sm text-red-500">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-full bg-fg text-bg px-6 py-3.5 font-medium hover:bg-accent hover:text-white transition-colors disabled:opacity-50"
          >
            {pending
              ? "One moment…"
              : mode === "setup"
                ? "Create account & enter"
                : "Log in"}
          </button>
        </form>

        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle mt-8">
          Private area · Sessions last 30 days
        </p>
      </div>
    </div>
  );
}
