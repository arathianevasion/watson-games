"use client";
import { useState, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

const V = {
  primary: { bg: "var(--accent-primary)", hover: "var(--accent-primary-hover)", press: "var(--accent-primary-press)", fg: "var(--text-on-accent)", bd: "transparent" },
  secondary: { bg: "var(--accent-secondary)", hover: "var(--accent-secondary-hover)", press: "var(--blue-600)", fg: "var(--white)", bd: "transparent" },
  quiet: { bg: "var(--surface-raised)", hover: "var(--slate-600)", press: "var(--slate-700)", fg: "var(--text-strong)", bd: "var(--border-strong)" },
  outline: { bg: "transparent", hover: "var(--surface-raised)", press: "var(--surface-inset)", fg: "var(--text-strong)", bd: "var(--border-strong)" },
  ghost: { bg: "transparent", hover: "var(--surface-raised)", press: "var(--surface-inset)", fg: "var(--text-body)", bd: "transparent" },
};
const S = {
  sm: { p: "7px 12px", fs: 13, h: 34, gap: 6, ic: 15 },
  md: { p: "11px 18px", fs: 14, h: 42, gap: 8, ic: 17 },
  lg: { p: "14px 24px", fs: 15.5, h: 50, gap: 9, ic: 19 },
};

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  /** primary = dusty red (one per view), secondary = steel blue, quiet = raised slate, outline, ghost. */
  variant?: keyof typeof V;
  /** sm 34px, md 42px (default), lg 50px. */
  size?: keyof typeof S;
  icon?: IconName;
  iconAfter?: IconName;
  fullWidth?: boolean;
  style?: CSSProperties;
  children?: ReactNode;
}

export function buttonStyle(variant: keyof typeof V, size: keyof typeof S, state: { hover?: boolean; press?: boolean; disabled?: boolean }, extra?: CSSProperties): CSSProperties {
  const v = V[variant], z = S[size];
  return {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: z.gap, minHeight: z.h, padding: z.p,
    font: `var(--fw-medium) ${z.fs}px/1 var(--font-body)`, letterSpacing: 0,
    background: state.disabled ? v.bg : state.press ? v.press : state.hover ? v.hover : v.bg, color: v.fg,
    border: `1px solid ${v.bd}`, borderRadius: "var(--r-md)",
    boxShadow: variant === "ghost" || variant === "outline" ? "none" : "var(--shadow-e1)",
    transition: "background var(--dur-fast) var(--ease-out),color var(--dur-fast) var(--ease-out)",
    cursor: state.disabled ? "not-allowed" : "pointer", opacity: state.disabled ? 0.45 : 1, textDecoration: "none",
    ...extra,
  };
}
export const buttonIconSize = (size: keyof typeof S) => S[size].ic;

export function Button({ variant = "primary", size = "md", icon, iconAfter, fullWidth, disabled, children, style, ...rest }: ButtonProps) {
  const [h, setH] = useState(false), [p, setP] = useState(false);
  return (
    <button
      disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => { setH(false); setP(false); }}
      onMouseDown={() => setP(true)} onMouseUp={() => setP(false)}
      style={buttonStyle(variant, size, { hover: h, press: p, disabled }, { width: fullWidth ? "100%" : undefined, ...style })}
      {...rest}
    >
      {icon && <Icon name={icon} size={S[size].ic} />}{children}{iconAfter && <Icon name={iconAfter} size={S[size].ic} />}
    </button>
  );
}
