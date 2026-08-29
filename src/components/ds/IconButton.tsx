"use client";
import { useState, type ButtonHTMLAttributes, type CSSProperties } from "react";
import { Icon, type IconName } from "./Icon";

const SZ = { sm: 34, md: 42, lg: 48 };
const MAP = {
  quiet: ["var(--surface-raised)", "var(--slate-600)", "var(--text-strong)", "var(--border-strong)"],
  primary: ["var(--accent-primary)", "var(--accent-primary-hover)", "var(--text-on-accent)", "transparent"],
  ghost: ["transparent", "var(--surface-raised)", "var(--text-body)", "transparent"],
};

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  icon: IconName;
  variant?: keyof typeof MAP;
  size?: keyof typeof SZ;
  /** Accessible name. Always pass one. */
  label: string;
  style?: CSSProperties;
}

export function IconButton({ icon, variant = "quiet", size = "md", label, disabled, style, ...rest }: IconButtonProps) {
  const [h, setH] = useState(false), [p, setP] = useState(false);
  const d = SZ[size];
  const [bg, hv, fg, bd] = MAP[variant];
  return (
    <button
      aria-label={label} title={label} disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => { setH(false); setP(false); }}
      onMouseDown={() => setP(true)} onMouseUp={() => setP(false)}
      style={{ width: d, height: d, display: "inline-grid", placeItems: "center", background: h || p ? hv : bg, color: fg,
        border: `1px solid ${bd}`, borderRadius: "var(--r-md)", transition: "background var(--dur-fast) var(--ease-out)",
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1, ...style }}
      {...rest}
    >
      <Icon name={icon} size={Math.round(d * 0.44)} color={fg} />
    </button>
  );
}
