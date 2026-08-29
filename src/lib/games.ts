export type Engine = "unity5" | "html5";
/** desc = higher is better (points); asc = lower is better (time). */
export type ScoreOrder = "desc" | "asc";
export type BadgeTone = "neutral" | "red" | "blue" | "win" | "warn" | "lose";

export interface Game {
  slug: string;
  title: string;
  /** One or two sentences, plain voice, sentence case. */
  description: string;
  /** Category eyebrow shown on tiles, e.g. "Arcade". */
  category: string;
  /** Player-count string, e.g. "1" or "1–2". */
  players: string;
  /** Typical round length in minutes. */
  minutes: number;
  badge?: string;
  badgeTone?: BadgeTone;
  controls: { key: string; action: string }[];
  /** Numbered steps for the "How to play" card. */
  howToPlay: string[];
  /** Input methods and audience tags, e.g. "Keyboard", "Ages 12+". */
  tags: string[];
  thumbnail: string;
  engine: Engine;
  /** Path to the game's index.html under public/ (explicit so `next dev` can serve it too). */
  entry: string;
  aspect: "16:9" | "4:3" | "fill";
  /** Hidden games are playable by URL but not listed. */
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
      "Roll a ball down an endless neon slope, dodging red blocks and gaps as the speed keeps climbing.",
    category: "Arcade",
    players: "1",
    minutes: 3,
    badge: "Popular",
    badgeTone: "red",
    controls: [
      { key: "A / D", action: "Steer left / right" },
      { key: "← / →", action: "Steer left / right" },
    ],
    howToPlay: [
      "Steer with A and D or the arrow keys.",
      "Stay on the green track and avoid the red blocks.",
      "The slope gets faster the longer you last.",
      "Falling off or hitting a block ends the run.",
    ],
    tags: ["Keyboard", "Ages 12+"],
    thumbnail: "/thumbs/slope.svg",
    engine: "unity5",
    entry: "/game-files/slope/index.html",
    aspect: "16:9",
    // Slope is a compiled Unity build without source, so it can't report scores yet.
    leaderboard: { enabled: false, order: "desc", unit: "points", min: 0, max: 1_000_000 },
    source: "https://github.com/GlobalwideGames/slope",
  },
  {
    slug: "stack-tower",
    title: "Stack Cheese",
    description:
      "Stack sliding blocks of Swiss cheese as high as you can. Every miss trims the block, so line them up to keep the tower wide.",
    category: "Arcade",
    players: "1",
    minutes: 2,
    badge: "New",
    badgeTone: "blue",
    controls: [{ key: "Click / Tap", action: "Drop the cheese" }],
    howToPlay: [
      "Click or tap to drop the sliding block.",
      "Any overhang gets sliced off and falls away.",
      "A perfect drop keeps the block the same size.",
      "Miss the tower completely and the round ends. Your height is your score.",
    ],
    tags: ["Mouse", "Touch", "Ages 12+"],
    thumbnail: "/thumbs/stack-cheese.svg",
    engine: "html5",
    entry: "/game-files/stack-tower/index.html",
    aspect: "16:9",
    leaderboard: { enabled: true, order: "desc", unit: "blocks", min: 1, max: 1000 },
    source: "https://github.com/saadamirpk/stack-tower-3d",
  },
  {
    slug: "_sdk-test",
    title: "SDK test",
    description: "Tiny test game that exercises the portal score bridge. Not listed.",
    category: "Test",
    players: "1",
    minutes: 1,
    controls: [{ key: "Click", action: "Report a score" }],
    howToPlay: ["Press a button to send a score to the portal."],
    tags: ["Mouse"],
    thumbnail: "/thumbs/slope.svg",
    engine: "html5",
    entry: "/game-files/_sdk-test/index.html",
    aspect: "16:9",
    hidden: true,
    leaderboard: { enabled: true, order: "desc", unit: "points", min: 0, max: 10_000 },
  },
];

export const listedGames = () => games.filter((g) => !g.hidden);
export const getGame = (slug: string) => games.find((g) => g.slug === slug);
export const categories = () => [...new Set(listedGames().map((g) => g.category))];
