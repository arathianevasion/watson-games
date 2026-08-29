"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Dialog, IconButton, ScoreChip, Toast, type ToastProps } from "@/components/ds";
import { Wordmark } from "@/components/site/Wordmark";
import type { Game } from "@/lib/games";
import { isGameMessage, portalMessage, type PortalToGame } from "@/lib/sdk-protocol";
import { createClient } from "@/lib/supabase/client";

interface Props {
  game: Game;
  user: { id: string; displayName: string } | null;
  /** When false the portal never talks to Supabase; scores are acked as rejected. */
  authEnabled: boolean;
}

export function PlayShell({ game, user, authEnabled }: Props) {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const submitting = useRef(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [leave, setLeave] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const [toast, setToast] = useState<Omit<ToastProps, "onDismiss"> | null>(null);

  const post = useCallback((msg: PortalToGame) => {
    iframeRef.current?.contentWindow?.postMessage(msg, window.location.origin);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const onChange = () => {
      const active = document.fullscreenElement === wrapRef.current;
      setFullscreen(active);
      post(portalMessage("fullscreen", { active }));
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [post]);

  // Score bridge — see src/lib/sdk-protocol.ts.
  useEffect(() => {
    const onMessage = async (ev: MessageEvent) => {
      if (ev.origin !== window.location.origin) return;
      if (ev.source !== iframeRef.current?.contentWindow) return;
      if (!isGameMessage(ev.data)) return;
      const msg = ev.data;

      if (msg.type === "ready") {
        post(portalMessage("init", { slug: game.slug, user, leaderboard: game.leaderboard.enabled }));
        return;
      }
      if (msg.type === "error") { console.warn(`[${game.slug}]`, msg.message); return; }
      if (msg.type !== "score") return;

      setScore(msg.score);
      if (!msg.final) return;
      setBest((b) => (b == null || (game.leaderboard.order === "asc" ? msg.score < b : msg.score > b) ? msg.score : b));

      if (!authEnabled) { post(portalMessage("score:ack", { ok: false, reason: "accounts not enabled" })); return; }
      if (!game.leaderboard.enabled) { post(portalMessage("score:ack", { ok: false, reason: "leaderboard disabled" })); return; }
      if (!user) {
        setToast({ tone: "info", title: "Round over", message: "Sign in to save your score." });
        post(portalMessage("score:ack", { ok: false, reason: "not signed in" }));
        return;
      }
      if (submitting.current) return;
      submitting.current = true;
      try {
        const { error } = await createClient().rpc("submit_score", { p_game_slug: game.slug, p_score: msg.score });
        if (error) {
          setToast({ tone: "lose", title: "Score not saved", message: error.message });
          post(portalMessage("score:ack", { ok: false, reason: error.message }));
        } else {
          setToast({ tone: "win", title: "Score saved", message: "Find it on the game page." });
          post(portalMessage("score:ack", { ok: true }));
          router.refresh();
        }
      } finally {
        submitting.current = false;
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [game, user, authEnabled, post, router]);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void wrapRef.current?.requestFullscreen();
  };
  const restart = () => { if (iframeRef.current) { iframeRef.current.src = game.entry; setScore(null); } };
  const unit = game.leaderboard.unit ?? "pts";

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--surface-page)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-4)", padding: "10px 18px", background: "var(--surface-sunken)", borderBottom: "1px solid var(--border-soft)" }}>
        <IconButton icon="arrow-left" variant="ghost" size="sm" label="Leave round" onClick={() => setLeave(true)} />
        <div>
          <div style={{ fontSize: 11.5, color: "var(--text-faint)" }}>Now playing</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-strong)", lineHeight: 1.25 }}>{game.title}</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <IconButton icon="rotate-ccw" variant="ghost" size="sm" label="Restart" onClick={restart} />
          <IconButton icon={fullscreen ? "minimize" : "maximize"} variant="ghost" size="sm" label={fullscreen ? "Exit fullscreen" : "Fullscreen"} onClick={toggleFullscreen} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", padding: "12px 18px", borderBottom: "1px solid var(--border-soft)" }}>
        <ScoreChip icon="trophy" value={score == null ? "—" : score.toLocaleString()} label={unit} size="lg" />
        {best != null && <ScoreChip icon="star" value={best.toLocaleString()} label="best this visit" tone="blue" size="lg" />}
        {game.engine === "unity5" && <span style={{ marginLeft: "auto", fontSize: 12.5, color: "var(--text-faint)" }}>This game keeps its own score.</span>}
      </div>

      <div style={{ flex: 1, display: "grid", placeItems: "center", padding: "var(--sp-5) var(--sp-6)" }}>
        <div ref={wrapRef} style={{ width: "100%", maxWidth: 1100, aspectRatio: game.aspect === "4:3" ? "4/3" : "16/9", background: "var(--slate-950)", border: "1px solid var(--border-soft)", borderRadius: fullscreen ? 0 : "var(--r-lg)", overflow: "hidden", position: "relative" }}>
          <iframe ref={iframeRef} src={game.entry} title={game.title}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
            sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms" allow="fullscreen; gamepad; autoplay" allowFullScreen />
        </div>
      </div>

      <div style={{ padding: "10px 18px", background: "var(--surface-sunken)", borderTop: "1px solid var(--border-soft)", display: "flex", alignItems: "center", gap: 16, color: "var(--text-faint)", fontSize: 12.5 }}>
        <Wordmark size={14} />
        <Link href={`/games/${game.slug}`} style={{ fontSize: 12.5 }}>How to play</Link>
        <span style={{ marginLeft: "auto" }}>{game.controls.map((c) => `${c.key} — ${c.action}`).join(" · ")}</span>
      </div>

      {toast && <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: "var(--z-toast)" }}><Toast {...toast} onDismiss={() => setToast(null)} /></div>}
      <Dialog open={leave} title="Leave this round?" onClose={() => setLeave(false)}
        actions={<><Button variant="outline" onClick={() => setLeave(false)}>Keep playing</Button><Button onClick={() => router.push(`/games/${game.slug}`)}>Leave</Button></>}>
        Your progress in this round will not be kept.
      </Dialog>
    </div>
  );
}
