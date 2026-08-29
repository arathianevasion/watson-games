import type { CSSProperties, ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

const T = {
  neutral: ["var(--surface-raised)", "var(--text-body)"], red: ["var(--lose-bg)", "var(--red-300)"],
  blue: ["var(--info-bg)", "var(--blue-300)"], win: ["var(--win-bg)", "var(--win-500)"],
  warn: ["var(--warn-bg)", "var(--warn-500)"], lose: ["var(--lose-bg)", "var(--lose-500)"],
};

export interface BadgeProps {
  tone?: keyof typeof T;
  icon?: IconName;
  /** Filled — for the single loudest label on a card. */
  solid?: boolean;
  style?: CSSProperties;
  children?: ReactNode;
}

/** Small non-interactive status label: New, 2 players, Beta. Sentence case. */
export function Badge({ tone = "neutral", icon, solid, children, style }: BadgeProps) {
  const [bg, fg] = T[tone];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 8px", background: solid ? fg : bg,
      color: solid ? "var(--slate-950)" : fg, borderRadius: "var(--r-xs)", border: solid ? "none" : `1px solid ${fg}33`,
      font: "var(--type-label)", ...style }}>
      {icon && <Icon name={icon} size={12} />}{children}
    </span>
  );
}
