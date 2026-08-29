"use client";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { Badge, type BadgeProps } from "./Badge";
import { Icon } from "./Icon";

export interface GameCardProps {
  href: string;
  title: string;
  category?: string;
  /** Image URL for the art panel, or any CSS background. */
  art?: string;
  badge?: string;
  badgeTone?: BadgeProps["tone"];
  players?: string;
  minutes?: number | string;
  rating?: number | string;
  style?: CSSProperties;
}

/** The site's workhorse tile: art panel, category, title, and play metadata. */
export function GameCard({ href, title, category, art, badge, badgeTone = "blue", players, minutes, rating, style }: GameCardProps) {
  const [h, setH] = useState(false);
  const isImage = art?.startsWith("/") || art?.startsWith("http");
  return (
    <Link href={href} className="plain" aria-label={`Play ${title}`}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: "var(--surface-card)", color: "var(--text-body)", border: `1px solid ${h ? "var(--border-strong)" : "var(--border-soft)"}`,
        borderRadius: "var(--r-lg)", boxShadow: h ? "var(--shadow-e2)" : "var(--shadow-e1)",
        transition: "border-color var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-out)",
        overflow: "hidden", display: "flex", flexDirection: "column", ...style }}>
      <div style={{ position: "relative", aspectRatio: "16/10", background: isImage ? "var(--slate-800)" : art || "var(--blue-700)", display: "grid", placeItems: "center" }}>
        {isImage
          ? <img src={art} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          : <span style={{ font: "var(--fw-medium) 10.5px/1 var(--font-body)", letterSpacing: ".1em", color: "rgba(255,255,255,.42)" }}>ART</span>}
        {badge && <span style={{ position: "absolute", top: 9, left: 9 }}><Badge tone={badgeTone} solid>{badge}</Badge></span>}
        <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "rgba(19,21,25,.5)", opacity: h ? 1 : 0, transition: "opacity var(--dur-base) var(--ease-out)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", background: "var(--accent-primary)", borderRadius: "var(--r-md)", color: "var(--white)", font: "var(--fw-medium) 13.5px/1 var(--font-body)" }}>
            <Icon name="play" size={15} />Play
          </span>
        </span>
      </div>
      <div style={{ padding: "12px 14px 14px", display: "flex", flexDirection: "column", gap: 4, flex: 1, borderTop: "1px solid var(--border-soft)" }}>
        {category && <span style={{ font: "var(--type-label)", color: "var(--text-faint)" }}>{category}</span>}
        <span style={{ font: "var(--fw-bold) 16px/1.25 var(--font-display)", color: "var(--text-strong)" }}>{title}</span>
        <span style={{ display: "flex", gap: 12, marginTop: "auto", paddingTop: 8, fontSize: 12, color: "var(--text-faint)", alignItems: "center" }}>
          {players && <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><Icon name="users" size={13} />{players}</span>}
          {minutes && <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><Icon name="timer" size={13} />{minutes} min</span>}
          {rating && <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><Icon name="star" size={13} />{rating}</span>}
        </span>
      </div>
    </Link>
  );
}
