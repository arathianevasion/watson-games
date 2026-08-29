import type { CSSProperties, InputHTMLAttributes, ReactNode } from "react";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style"> {
  label?: ReactNode;
  style?: CSSProperties;
}

/** Instant-effect toggle: sound, music, colourblind mode. Steel blue when on. */
export function Switch({ label, checked, disabled, style, ...rest }: SwitchProps) {
  return (
    <label style={{ display: "inline-flex", gap: 11, alignItems: "center", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, minHeight: "var(--hit-min)", position: "relative", ...style }}>
      <input type="checkbox" role="switch" checked={checked} disabled={disabled} style={{ position: "absolute", opacity: 0, width: 1, height: 1 }} {...rest} />
      <span aria-hidden style={{ width: 40, height: 23, flex: "0 0 auto", padding: 2, display: "flex", alignItems: "center",
        justifyContent: checked ? "flex-end" : "flex-start", background: checked ? "var(--accent-secondary)" : "var(--surface-inset)",
        border: `1px solid ${checked ? "var(--accent-secondary)" : "var(--border-strong)"}`, borderRadius: "var(--r-pill)",
        transition: "background var(--dur-base) var(--ease-out)" }}>
        <span style={{ width: 17, height: 17, borderRadius: "var(--r-pill)", background: checked ? "var(--white)" : "var(--slate-400)" }} />
      </span>
      {label && <span style={{ font: "var(--fw-regular) 15px/1.45 var(--font-body)", color: "var(--text-strong)" }}>{label}</span>}
    </label>
  );
}
