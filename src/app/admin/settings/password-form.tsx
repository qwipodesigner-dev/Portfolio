"use client";

import { useActionState } from "react";
import { changePasswordAction, type FormState } from "../actions";

const input =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-fg placeholder:text-fg-subtle focus:outline-none focus:border-accent transition-colors";

export function PasswordForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    changePasswordAction,
    undefined,
  );
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <h2 className="font-display text-2xl">Change password</h2>
      <input
        className={input}
        type="password"
        name="current"
        placeholder="Current password"
        autoComplete="current-password"
        required
      />
      <input
        className={input}
        type="password"
        name="next"
        placeholder="New password (min 10 characters)"
        autoComplete="new-password"
        minLength={10}
        required
      />
      <input
        className={input}
        type="password"
        name="confirm"
        placeholder="Confirm new password"
        autoComplete="new-password"
        minLength={10}
        required
      />
      {state?.error && (
        <p role="alert" className="text-sm text-red-500">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-fg text-bg px-6 py-3.5 font-medium hover:bg-accent hover:text-white transition-colors disabled:opacity-50"
      >
        {pending ? "Updating…" : "Update password"}
      </button>
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle">
        Changing the password signs out all other devices
      </p>
    </form>
  );
}
