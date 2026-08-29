"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Game } from "@/lib/games";
import { isGameMessage, portalMessage, type PortalToGame } from "@/lib/sdk-protocol";
import { createClient } from "@/lib/supabase/client";

interface Props {
  game: Game;
  user: { id: string; displayName: string } | null;
}

export default function GameFrame({ game, user }: Props) {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const submitting = useRef(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const post = useCallback((msg: PortalToGame) => {
    iframeRef.current?.contentWindow?.postMessage(msg, window.location.origin);
  }, []);

  // Fullscreen state tracking; also tell the game.
  useEffect(() => {
    const onChange = () => {
      const active = document.fullscreenElement === wrapRef.current;
      setFullscreen(active);
      post(portalMessage("fullscreen", { active }));
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [post]);

  // Score bridge.
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
      if (msg.type === "error") {
        console.warn(`[${game.slug}]`, msg.message);
        return;
      }
      if (msg.type !== "score" || !msg.final) return;

      if (!game.leaderboard.enabled) {
        post(portalMessage("score:ack", { ok: false, reason: "leaderboard disabled" }));
        return;
      }
      if (!user) {
        setNotice("Sign in to save your score.");
        post(portalMessage("score:ack", { ok: false, reason: "not signed in" }));
        return;
      }
      if (submitting.current) return;
      submitting.current = true;
      try {
        const { error } = await createClient().rpc("submit_score", {
          p_game_slug: game.slug,
          p_score: msg.score,
        });
        if (error) {
          setNotice(`Score not saved: ${error.message}`);
          post(portalMessage("score:ack", { ok: false, reason: error.message }));
        } else {
          setNotice("Score saved!");
          post(portalMessage("score:ack", { ok: true }));
          router.refresh();
        }
      } finally {
        submitting.current = false;
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [game, user, post, router]);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void wrapRef.current?.requestFullscreen();
    }
  };

  const aspect = game.aspect === "4:3" ? "aspect-[4/3]" : "aspect-video";

  return (
    <div>
      <div ref={wrapRef} className={`relative w-full bg-black ${fullscreen ? "h-full" : aspect}`}>
        <iframe
          ref={iframeRef}
          src={game.entry}
          title={game.title}
          className="absolute inset-0 h-full w-full border-0"
          sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
          allow="fullscreen; gamepad; autoplay"
          allowFullScreen
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-sm">
        <button
          onClick={toggleFullscreen}
          className="rounded border border-border px-3 py-1 hover:bg-card"
        >
          {fullscreen ? "Exit fullscreen" : "Fullscreen"}
        </button>
        {notice && (
          <span className="text-muted">
            {notice}{" "}
            {!user && (
              <Link href={`/login?next=/games/${game.slug}`} className="text-accent underline">
                Sign in
              </Link>
            )}
          </span>
        )}
      </div>
    </div>
  );
}
