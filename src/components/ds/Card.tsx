"use client";
import { useState, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";

const BG = { card: "var(--surface-card)", sunken: "var(--surface-sunken)", raised: "var(--surface-raised)", light: "var(--surface-light)" };

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  tone?: keyof typeof BG;
  /** Border brightens and elevation lifts on hover. No movement. */
  interactive?: boolean;
  /** px padding, default 20. 0 for full-bleed art. */
  padding?: number;
  style?: CSSProperties;
  children?: ReactNode;
}

/** The base surface: 1px hairline border, 10px radius, near-invisible elevation. */
export function Card({ tone = "card", interactive, padding = 20, children, style, ...rest }: CardProps) {
  const [h, setH] = useState(false);
  const light = tone === "light";
  return (
    <div
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: BG[tone], color: light ? "var(--slate-700)" : "var(--text-body)",
        border: `1px solid ${light ? "var(--slate-200)" : interactive && h ? "var(--border-strong)" : "var(--border-soft)"}`,
        borderRadius: "var(--r-lg)", boxShadow: interactive && h ? "var(--shadow-e2)" : "var(--shadow-e1)",
        transition: "border-color var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-out)",
        padding, cursor: interactive ? "pointer" : undefined, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}
