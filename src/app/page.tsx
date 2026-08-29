import Link from "next/link";
import { Badge, Card, Icon, LinkButton, type IconName } from "@/components/ds";
import { GameGrid } from "@/components/site/GameGrid";
import { listedGames } from "@/lib/games";

function Hero() {
  const all = listedGames();
  const featured = all.find((g) => g.badge === "New") ?? all[0];
  return (
    <section style={{ borderBottom: "1px solid var(--border-soft)", padding: "var(--sp-9) 0" }}>
      <div className="container hero-cols">
        <div>
          <Badge tone="neutral">{all.length} games · always free</Badge>
          <h1 style={{ margin: "var(--sp-4) 0", fontSize: "var(--fs-display-xl)" }}>Pick a game.<br />Press play.</h1>
          <p style={{ color: "var(--text-body)", fontSize: 17, maxWidth: 430 }}>No downloads, no accounts needed to start. Everything runs in the browser you already have open.</p>
          <div style={{ display: "flex", gap: "var(--sp-2)", marginTop: "var(--sp-6)", flexWrap: "wrap" }}>
            <LinkButton href={`/play/${featured.slug}`} size="lg" icon="play">Play {featured.title}</LinkButton>
            <LinkButton href="/games" size="lg" variant="outline" iconAfter="arrow-right">Browse all games</LinkButton>
          </div>
        </div>
        <Card padding={0} style={{ overflow: "hidden" }}>
          <Link href={`/games/${featured.slug}`} className="plain">
            <div style={{ aspectRatio: "16/10", background: "var(--slate-800)", position: "relative" }}>
              <img src={featured.thumbnail} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ padding: "var(--sp-4) var(--sp-5) var(--sp-5)", borderTop: "1px solid var(--border-soft)" }}>
              <div style={{ font: "var(--type-label)", color: "var(--text-faint)" }}>Game of the week</div>
              <h3 style={{ margin: "7px 0 5px" }}>{featured.title}</h3>
              <p style={{ margin: 0, fontSize: 13.5, color: "var(--text-muted)" }}>{featured.description}</p>
            </div>
          </Link>
        </Card>
      </div>
    </section>
  );
}

function StatStrip() {
  const all = listedGames();
  const avg = Math.round(all.reduce((s, g) => s + g.minutes, 0) / Math.max(1, all.length));
  const stats: [IconName, string, string][] = [
    ["gamepad-2", String(all.length), all.length === 1 ? "game to play" : "games to play"],
    ["timer", `${avg} min`, "average round"],
    ["shield-check", "0", "ads, ever"],
    ["users", "0", "downloads needed"],
  ];
  return (
    <section style={{ marginTop: "var(--sp-9)", background: "var(--surface-sunken)", borderTop: "1px solid var(--border-soft)", padding: "var(--sp-7) 0" }}>
      <div className="container stat-cols">
        {stats.map(([ic, n, l]) => (
          <div key={l} style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Icon name={ic} size={19} color="var(--blue-300)" />
            <span>
              <span style={{ display: "block", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--text-strong)", lineHeight: 1.1 }}>{n}</span>
              <span style={{ display: "block", fontSize: 13, color: "var(--text-faint)", marginTop: 3 }}>{l}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const all = listedGames();
  const quick = all.filter((g) => g.minutes <= 5);
  return (
    <div>
      <Hero />
      <section className="container" style={{ paddingTop: "var(--sp-8)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-5)", marginBottom: "var(--sp-5)", flexWrap: "wrap" }}>
          <h2 style={{ margin: 0, fontSize: "var(--fs-title)" }}>All games</h2>
          <LinkButton href="/games" variant="ghost" iconAfter="arrow-right" size="sm" style={{ marginLeft: "auto" }}>See all</LinkButton>
        </div>
        <GameGrid games={all} />
      </section>
      {quick.length > 0 && quick.length < all.length && (
        <section className="container" style={{ paddingTop: "var(--sp-8)" }}>
          <h2 style={{ fontSize: "var(--fs-title)", marginBottom: "var(--sp-5)" }}>Quick rounds under 5 minutes</h2>
          <GameGrid games={quick} />
        </section>
      )}
      <StatStrip />
    </div>
  );
}
