import type { CSSProperties, ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

const TONES = {
  default: ["var(--surface-raised)", "var(--text-strong)", "var(--border-strong)"],
  red: ["var(--lose-bg)", "var(--red-300)", "var(--red-700)"],
  blue: ["var(--info-bg)", "var(--blue-300)", "var(--blue-700)"],
  plain: ["transparent", "var(--text-body)", "var(--border-soft)"],
};

export interface ScoreChipProps {
  icon?: IconName;
  value: ReactNode;
  /** Short caption after the number, sentence case. */
  label?: string;
  tone?: keyof typeof TONES;
  size?: "md" | "lg";
  style?: CSSProperties;
}

/** Tabular-mono readout for score, streak, timer and coins. Built for the in-play HUD. */
export function ScoreChip({ icon, value, label, tone = "default", size = "md", style }: ScoreChipProps) {
  const [bg, fg, bd] = TONES[tone];
  const big = size === "lg";
  return (
    <div style={{ display: "inline-flex", alignItems: "baseline", gap: 8, padding: big ? "9px 14px" : "7px 11px", background: bg, color: fg, border: `1px solid ${bd}`, borderRadius: "var(--r-md)", ...style }}>
      {icon && <Icon name={icon} size={big ? 16 : 14} style={{ alignSelf: "center" }} />}
      <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: big ? 22 : 16, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{value}</span>
      {label && <span style={{ font: "var(--type-label)", color: "var(--text-faint)" }}>{label}</span>}
    </div>
  );
}
