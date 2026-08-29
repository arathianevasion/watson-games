import type { CSSProperties, InputHTMLAttributes, ReactNode } from "react";
import { Icon } from "./Icon";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style"> {
  label?: ReactNode;
  /** Secondary line under the label. */
  description?: string;
  style?: CSSProperties;
}

/** Square checkbox with steel-blue fill and a Lucide check. */
export function Checkbox({ label, checked, description, disabled, style, ...rest }: CheckboxProps) {
  return (
    <label style={{ display: "flex", gap: 11, alignItems: "flex-start", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, minHeight: "var(--hit-min)", paddingTop: 2, position: "relative", ...style }}>
      <input type="checkbox" checked={checked} disabled={disabled} style={{ position: "absolute", opacity: 0, width: 1, height: 1 }} {...rest} />
      <span aria-hidden style={{ width: 19, height: 19, flex: "0 0 auto", marginTop: 3, display: "grid", placeItems: "center",
        background: checked ? "var(--accent-secondary)" : "var(--surface-inset)",
        border: `1px solid ${checked ? "var(--accent-secondary)" : "var(--border-strong)"}`, borderRadius: "var(--r-xs)",
        transition: "background var(--dur-fast) var(--ease-out)" }}>
        {checked && <Icon name="check" size={13} color="var(--white)" />}
      </span>
      <span>
        <span style={{ display: "block", font: "var(--fw-regular) 15px/1.45 var(--font-body)", color: "var(--text-strong)" }}>{label}</span>
        {description && <span style={{ display: "block", fontSize: 12.5, color: "var(--text-faint)" }}>{description}</span>}
      </span>
    </label>
  );
}
