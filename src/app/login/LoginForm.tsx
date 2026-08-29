"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

type Provider = "google" | "discord";

export default function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const callback = () =>
    `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  const oauth = async (provider: Provider) => {
    setBusy(true);
    const { error } = await createClient().auth.signInWithOAuth({
      provider,
      options: { redirectTo: callback() },
    });
    if (error) {
      setStatus(error.message);
      setBusy(false);
    }
  };

  const magicLink = async () => {
    setBusy(true);
    const { error } = await createClient().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: callback() },
    });
    setStatus(error ? error.message : "Check your email for a sign-in link.");
    setBusy(false);
  };

  const passwordSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const supabase = createClient();
    let { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error?.message.toLowerCase().includes("invalid login")) {
      // No account yet: create one with this password.
      ({ error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: callback() },
      }));
      if (!error) {
        setStatus("Account created. Check your email to confirm, then sign in.");
        setBusy(false);
        return;
      }
    }
    if (error) {
      setStatus(error.message);
      setBusy(false);
      return;
    }
    window.location.assign(next);
  };

  const btn = "w-full rounded border border-border px-3 py-2 hover:bg-card disabled:opacity-50";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <button className={btn} disabled={busy} onClick={() => oauth("google")}>
          Continue with Google
        </button>
        <button className={btn} disabled={busy} onClick={() => oauth("discord")}>
          Continue with Discord
        </button>
      </div>
      <div className="text-center text-xs text-muted">or</div>
      <form onSubmit={passwordSignIn} className="space-y-2">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border border-border bg-card px-3 py-2"
        />
        <input
          type="password"
          placeholder="Password (leave blank for a magic link)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border border-border bg-card px-3 py-2"
        />
        {password ? (
          <button type="submit" disabled={busy} className={`${btn} bg-accent font-semibold text-black`}>
            Sign in / Sign up
          </button>
        ) : (
          <button
            type="button"
            disabled={busy || !email}
            onClick={magicLink}
            className={`${btn} bg-accent font-semibold text-black`}
          >
            Email me a sign-in link
          </button>
        )}
      </form>
      {status && <p className="text-sm text-muted">{status}</p>}
    </div>
  );
}
