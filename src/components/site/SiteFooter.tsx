import Link from "next/link";
import { Icon } from "@/components/ds";
import { Wordmark } from "./Wordmark";

const COLS: [string, [string, string][]][] = [
  ["Play", [["All games", "/games"], ["New this week", "/games?sort=new"], ["Leaderboards", "/games"]]],
  ["About", [["Who we are", "/"], ["For parents", "/"]]],
  ["Rules", [["Community rules", "/"], ["Privacy", "/"], ["Report a bug", "/"]]],
];

export function SiteFooter() {
  return (
    <footer style={{ background: "var(--surface-sunken)", borderTop: "1px solid var(--border-soft)", padding: "var(--sp-8) 0 var(--sp-6)" }}>
      <div className="container footer-cols">
        <div>
          <Wordmark size={18} />
          <p style={{ marginTop: 10, fontSize: 13.5, color: "var(--text-muted)", maxWidth: 250 }}>Free browser games for players 12 and up. No downloads, no installs, nothing to buy.</p>
        </div>
        {COLS.map(([t, items]) => (
          <div key={t}>
            <div style={{ font: "var(--fw-medium) 12.5px/1 var(--font-body)", color: "var(--text-strong)", marginBottom: 12 }}>{t}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
              {items.map(([label, href]) => <Link key={label} href={href} style={{ fontSize: 13.5 }}>{label}</Link>)}
            </div>
          </div>
        ))}
      </div>
      <div className="container" style={{ marginTop: "var(--sp-6)", paddingTop: "var(--sp-4)", borderTop: "1px solid var(--border-soft)", display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--text-faint)" }}>
        <span>© {new Date().getFullYear()} Watson Games</span>
        <span style={{ display: "flex", gap: 14 }}><Icon name="mail" size={15} /><Icon name="gamepad-2" size={15} /></span>
      </div>
    </footer>
  );
}
