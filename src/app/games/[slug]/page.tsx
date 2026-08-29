import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { games, getGame } from "@/lib/games";
import { getProfile } from "@/lib/supabase/server";
import GameFrame from "./GameFrame";
import Leaderboard from "./Leaderboard";

export function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/games/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const game = getGame(slug);
  return game ? { title: game.title, description: game.description } : {};
}

export default async function GamePage({ params }: PageProps<"/games/[slug]">) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();
  const profile = await getProfile();

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <section>
        <h1 className="mb-3 text-2xl font-bold">{game.title}</h1>
        <GameFrame
          game={game}
          user={profile ? { id: profile.id, displayName: profile.display_name } : null}
        />
        <p className="mt-4 text-sm text-muted">{game.description}</p>
        <h2 className="mt-6 mb-2 font-semibold">Controls</h2>
        <table className="text-sm">
          <tbody>
            {game.controls.map((c) => (
              <tr key={c.key}>
                <td className="pr-4 py-1">
                  <kbd className="rounded border border-border bg-card px-2 py-0.5 font-mono text-xs">{c.key}</kbd>
                </td>
                <td className="py-1 text-muted">{c.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {game.source && (
          <p className="mt-6 text-xs text-muted">
            Source:{" "}
            <a href={game.source} className="underline" target="_blank" rel="noreferrer">
              {game.source}
            </a>
          </p>
        )}
      </section>
      <aside>
        <Leaderboard game={game} userId={profile?.id ?? null} />
      </aside>
    </div>
  );
}
