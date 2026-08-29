/**
 * postMessage contract between a game (in an iframe) and the portal.
 * Games are served from the portal's own origin, so both sides check
 * `event.origin === location.origin`. The plain-JS mirror of this lives in
 * public/sdk/portal-sdk.js — keep them in sync.
 */
export const SDK_NS = "watson-games";
export const SDK_VERSION = 1;

type Base = { ns: typeof SDK_NS; v: typeof SDK_VERSION };

export type GameToPortal =
  | (Base & { type: "ready" })
  | (Base & { type: "score"; score: number; final?: boolean })
  | (Base & { type: "error"; message: string });

export type PortalToGame =
  | (Base & {
      type: "init";
      slug: string;
      user: { id: string; displayName: string } | null;
      leaderboard: boolean;
    })
  | (Base & { type: "score:ack"; ok: boolean; reason?: string })
  | (Base & { type: "fullscreen"; active: boolean });

export function isGameMessage(data: unknown): data is GameToPortal {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return d.ns === SDK_NS && d.v === SDK_VERSION && typeof d.type === "string";
}

export function portalMessage<T extends PortalToGame["type"]>(
  type: T,
  body: Omit<Extract<PortalToGame, { type: T }>, "ns" | "v" | "type">,
): PortalToGame {
  return { ns: SDK_NS, v: SDK_VERSION, type, ...body } as unknown as PortalToGame;
}
