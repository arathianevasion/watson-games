"use client";
import { useState, type FormEvent } from "react";
import { Button, Input, LinkButton } from "@/components/ds";
import { createClient } from "@/lib/supabase/client";

type Provider = "google" | "discord";

export default function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const callback = () => `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  const oauth = async (provider: Provider) => {
    setBusy(true);
    const { error } = await createClient().auth.signInWithOAuth({ provider, options: { redirectTo: callback() } });
    if (error) { setStatus(error.message); setBusy(false); }
  };

  const magicLink = async () => {
    setBusy(true);
    const { error } = await createClient().auth.signInWithOtp({ email, options: { emailRedirectTo: callback() } });
    setStatus(error ? error.message : "Check your email for a sign-in link.");
    setBusy(false);
  };

  const passwordSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const supabase = createClient();
    let { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error?.message.toLowerCase().includes("invalid login")) {
      ({ error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: callback() } }));
      if (!error) { setStatus("Account created. Check your email to confirm, then sign in."); setBusy(false); return; }
    }
    if (error) { setStatus(error.message); setBusy(false); return; }
    window.location.assign(next);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
      <Button variant="quiet" fullWidth disabled={busy} onClick={() => oauth("google")}>Continue with Google</Button>
      <Button variant="quiet" fullWidth disabled={busy} onClick={() => oauth("discord")}>Continue with Discord</Button>
      <div style={{ textAlign: "center", fontSize: 12.5, color: "var(--text-faint)" }}>or</div>
      <form onSubmit={passwordSignIn} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
        <Input label="Email" icon="mail" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <Input label="Password" icon="lock" type="password" value={password} onChange={(e) => setPassword(e.target.value)} hint="Leave blank to get a sign-in link by email." />
        {password
          ? <Button type="submit" fullWidth disabled={busy}>Sign in</Button>
          : <Button type="button" fullWidth disabled={busy || !email} onClick={magicLink}>Email me a sign-in link</Button>}
      </form>
      <LinkButton href="/" variant="ghost" fullWidth>Play without an account</LinkButton>
      {status && <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)" }}>{status}</p>}
    </div>
  );
}
