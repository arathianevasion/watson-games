import type { Game } from "@/lib/games";
import { fetchPersonalBest, fetchTopScores, formatScore } from "@/lib/scores";

export default async function Leaderboard({ game, userId }: { game: Game; userId: string | null }) {
  if (!game.leaderboard.enabled) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="font-semibold">Leaderboard</h2>
        <p className="mt-2 text-sm text-muted">Coming soon for this game.</p>
      </div>
    );
  }

  const [top, best] = await Promise.all([
    fetchTopScores(game.slug, 10),
    userId ? fetchPersonalBest(game.slug, userId, game.leaderboard.order) : Promise.resolve(null),
  ]);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="font-semibold">Leaderboard</h2>
      {top.length === 0 ? (
        <p className="mt-2 text-sm text-muted">No scores yet — be the first!</p>
      ) : (
        <ol className="mt-2 space-y-1 text-sm">
          {top.map((r, i) => (
            <li
              key={r.user_id}
              className={`flex justify-between ${r.user_id === userId ? "text-accent" : ""}`}
            >
              <span>
                <span className="inline-block w-6 text-muted">{i + 1}.</span>
                {r.display_name}
              </span>
              <span className="font-mono">{formatScore(r.score, game)}</span>
            </li>
          ))}
        </ol>
      )}
      <div className="mt-4 border-t border-border pt-3 text-sm">
        <span className="text-muted">Your best: </span>
        {userId ? (
          <span className="font-mono">{best ? formatScore(best.score, game) : "—"}</span>
        ) : (
          <span className="text-muted">sign in to track</span>
        )}
      </div>
    </div>
  );
}
