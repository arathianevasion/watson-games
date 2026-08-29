export type Engine = "unity5" | "html5";
/** desc = higher is better (points); asc = lower is better (time). */
export type ScoreOrder = "desc" | "asc";

export interface Game {
  slug: string;
  title: string;
  description: string;
  controls: { key: string; action: string }[];
  thumbnail: string;
  engine: Engine;
  /** URL of the game's directory under public/ (trailing slash; Cloudflare serves its index.html). */
  entry: string;
  aspect: "16:9" | "4:3" | "fill";
  /** Hidden games are playable by URL but not listed on the home grid. */
  hidden?: boolean;
  leaderboard: {
    enabled: boolean;
    order: ScoreOrder;
    unit?: string;
    /** Sanity bounds — mirrored in the `games` DB table, which is authoritative. */
    min?: number;
    max?: number;
  };
  source?: string;
}

export const games: Game[] = [
  {
    slug: "slope",
    title: "Slope",
    description:
      "Roll a ball down an endless neon slope, dodging red blocks and gaps as the speed keeps climbing. How far can you get?",
    controls: [
      { key: "A / D", action: "Steer left / right" },
      { key: "← / →", action: "Steer left / right" },
    ],
    thumbnail: "/thumbs/slope.svg",
    engine: "unity5",
    entry: "/game-files/slope/",
    aspect: "16:9",
    // Slope is a compiled Unity build without source, so it can't report scores yet.
    leaderboard: { enabled: false, order: "desc", unit: "points", min: 0, max: 1_000_000 },
    source: "https://github.com/GlobalwideGames/slope",
  },
  {
    slug: "_sdk-test",
    title: "SDK Test",
    description: "Tiny test game that exercises the portal score bridge. Not shown on the home page.",
    controls: [{ key: "Click", action: "Report a score" }],
    thumbnail: "/thumbs/slope.svg",
    engine: "html5",
    entry: "/game-files/_sdk-test/",
    aspect: "16:9",
    hidden: true,
    leaderboard: { enabled: true, order: "desc", unit: "points", min: 0, max: 10_000 },
  },
];

export const listedGames = () => games.filter((g) => !g.hidden);
export const getGame = (slug: string) => games.find((g) => g.slug === slug);
