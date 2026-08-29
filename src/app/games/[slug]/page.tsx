import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge, Card, Icon, LinkButton, Tag, type IconName } from "@/components/ds";
import { GameGrid } from "@/components/site/GameGrid";
import { games, getGame, listedGames } from "@/lib/games";
import { authEnabled } from "@/lib/supabase/env";
import { getProfile } from "@/lib/supabase/server";
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
  const related = listedGames().filter((g) => g.slug !== game.slug).slice(0, 4);
  const stats: [IconName, string, string][] = [["users", game.players, "players"], ["timer", `${game.minutes} min`, "a round"], ["gamepad-2", game.engine === "unity5" ? "Unity" : "HTML5", "engine"]];

  return (
    <div>
      <div style={{ borderBottom: "1px solid var(--border-soft)", padding: "var(--sp-5) 0 var(--sp-8)" }}>
        <div className="container">
          <LinkButton href="/games" variant="ghost" size="sm" icon="arrow-left" style={{ marginBottom: "var(--sp-5)" }}>All games</LinkButton>
          <div className="two-col">
            <div style={{ position: "relative", border: "1px solid var(--border-soft)", borderRadius: "var(--r-xl)", overflow: "hidden", background: "var(--slate-800)", aspectRatio: "16/9", display: "grid", placeItems: "center" }}>
              <img src={game.thumbnail} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
              <LinkButton href={`/play/${game.slug}`} size="lg" icon="play" style={{ position: "relative" }}>Play now</LinkButton>
            </div>
            <div>
              <div style={{ display: "flex", gap: 7, marginBottom: "var(--sp-3)" }}>
                <Badge>{game.category}</Badge>{game.badge && <Badge tone={game.badgeTone ?? "blue"}>{game.badge}</Badge>}
              </div>
              <h1 style={{ margin: "0 0 var(--sp-3)", fontSize: "var(--fs-display-m)" }}>{game.title}</h1>
              <p style={{ color: "var(--text-body)", fontSize: 15.5 }}>{game.description}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, margin: "var(--sp-5) 0" }}>
                {stats.map(([ic, v, l]) => (
                  <div key={l} style={{ background: "var(--surface-card)", border: "1px solid var(--border-soft)", borderRadius: "var(--r-md)", padding: "11px 10px", textAlign: "center" }}>
                    <Icon name={ic} size={15} color="var(--text-faint)" />
                    <div className="mono" style={{ fontWeight: 700, fontSize: 15, color: "var(--text-strong)", marginTop: 4 }}>{v}</div>
                    <div style={{ fontSize: 11.5, color: "var(--text-faint)", marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <LinkButton href={`/play/${game.slug}`} icon="play">Start round</LinkButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container two-col" style={{ padding: "var(--sp-7) var(--gutter) var(--sp-9)" }}>
        <div>
          <h2 style={{ fontSize: "var(--fs-title)" }}>How to play</h2>
          <Card>
            <ol style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 9, fontSize: 15 }}>
              {game.howToPlay.map((step) => <li key={step}>{step}</li>)}
            </ol>
            <div style={{ marginTop: "var(--sp-5)", display: "flex", gap: 7, flexWrap: "wrap" }}>{game.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
            <div style={{ marginTop: "var(--sp-5)", borderTop: "1px solid var(--border-soft)", paddingTop: "var(--sp-4)" }}>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>Controls</div>
              <table style={{ fontSize: 14, borderCollapse: "collapse" }}><tbody>
                {game.controls.map((c) => (
                  <tr key={c.key}><td style={{ paddingRight: 16, paddingBottom: 6 }}><kbd style={{ border: "1px solid var(--border-strong)", background: "var(--surface-inset)", borderRadius: "var(--r-xs)", padding: "2px 7px", fontSize: 12.5, color: "var(--text-strong)" }}>{c.key}</kbd></td><td style={{ color: "var(--text-muted)", paddingBottom: 6 }}>{c.action}</td></tr>
                ))}
              </tbody></table>
            </div>
          </Card>
          {game.source && <p style={{ marginTop: "var(--sp-4)", fontSize: 12.5, color: "var(--text-faint)" }}>Source: <a href={game.source} target="_blank" rel="noreferrer">{game.source.replace("https://", "")}</a></p>}
          {related.length > 0 && (
            <>
              <h2 style={{ marginTop: "var(--sp-8)", fontSize: "var(--fs-title)" }}>You might like these</h2>
              <GameGrid games={related} tight />
            </>
          )}
        </div>
        {authEnabled && <Leaderboard game={game} userId={profile?.id ?? null} />}
      </div>
    </div>
  );
}
