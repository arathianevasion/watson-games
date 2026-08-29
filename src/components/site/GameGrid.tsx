import { GameCard } from "@/components/ds";
import type { Game } from "@/lib/games";

export function GameGrid({ games, tight }: { games: Game[]; tight?: boolean }) {
  return (
    <div className={`game-grid${tight ? " game-grid--tight" : ""}`}>
      {games.map((g) => (
        <GameCard key={g.slug} href={`/games/${g.slug}`} title={g.title} category={g.category} art={g.thumbnail}
          badge={g.badge} badgeTone={g.badgeTone} players={g.players} minutes={g.minutes} />
      ))}
    </div>
  );
}
