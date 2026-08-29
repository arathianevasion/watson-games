import type { CSSProperties, InputHTMLAttributes, ReactNode } from "react";

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style"> {
  label?: ReactNode;
  description?: string;
  style?: CSSProperties;
}

/** Single-choice control. Always render as a group sharing one `name`. */
export function Radio({ label, description, checked, disabled, style, ...rest }: RadioProps) {
  return (
    <label style={{ display: "flex", gap: 11, alignItems: "flex-start", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, minHeight: "var(--hit-min)", paddingTop: 2, position: "relative", ...style }}>
      <input type="radio" checked={checked} disabled={disabled} style={{ position: "absolute", opacity: 0, width: 1, height: 1 }} {...rest} />
      <span aria-hidden style={{ width: 19, height: 19, flex: "0 0 auto", marginTop: 3, display: "grid", placeItems: "center",
        background: "var(--surface-inset)", border: `1px solid ${checked ? "var(--accent-secondary)" : "var(--border-strong)"}`, borderRadius: "var(--r-pill)" }}>
        {checked && <span style={{ width: 9, height: 9, borderRadius: "var(--r-pill)", background: "var(--accent-secondary)" }} />}
      </span>
      <span>
        <span style={{ display: "block", font: "var(--fw-regular) 15px/1.45 var(--font-body)", color: "var(--text-strong)" }}>{label}</span>
        {description && <span style={{ display: "block", fontSize: 12.5, color: "var(--text-faint)" }}>{description}</span>}
      </span>
    </label>
  );
}
