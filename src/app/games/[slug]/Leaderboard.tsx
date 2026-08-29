import { Card } from "@/components/ds";
import type { Game } from "@/lib/games";
import { fetchPersonalBest, fetchTopScores, formatScore } from "@/lib/scores";

export default async function Leaderboard({ game, userId }: { game: Game; userId: string | null }) {
  if (!game.leaderboard.enabled) {
    return (
      <Card>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Leaderboard</div>
        <p style={{ margin: "6px 0 0", fontSize: 14, color: "var(--text-faint)" }}>Not scored yet for this game.</p>
      </Card>
    );
  }
  const [top, best] = await Promise.all([
    fetchTopScores(game.slug, 10),
    userId ? fetchPersonalBest(game.slug, userId, game.leaderboard.order) : Promise.resolve(null),
  ]);
  return (
    <Card>
      <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Your best</div>
      <div className="mono" style={{ fontWeight: 700, fontSize: 30, color: "var(--text-strong)", margin: "5px 0 var(--sp-4)" }}>
        {userId ? (best ? formatScore(best.score, game) : "—") : <span style={{ fontSize: 14, fontFamily: "var(--font-body)", fontWeight: 400, color: "var(--text-faint)" }}>Sign in to track</span>}
      </div>
      <div style={{ borderTop: "1px solid var(--border-soft)", paddingTop: "var(--sp-4)" }}>
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 10 }}>Top players</div>
        {top.length === 0
          ? <p style={{ margin: 0, fontSize: 14, color: "var(--text-faint)" }}>No scores yet. Yours could be first.</p>
          : top.map((r, i) => (
            <div key={r.user_id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: i < top.length - 1 ? "1px solid var(--border-soft)" : "none" }}>
              <span className="mono" style={{ width: 18, fontSize: 13, color: "var(--text-faint)" }}>{i + 1}</span>
              <span style={{ flex: 1, fontSize: 14, color: r.user_id === userId ? "var(--text-strong)" : "var(--text-body)" }}>{r.display_name}</span>
              <span className="mono" style={{ fontSize: 13.5, color: "var(--text-muted)" }}>{formatScore(r.score, game)}</span>
            </div>
          ))}
      </div>
    </Card>
  );
}
