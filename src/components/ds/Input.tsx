"use client";
import { useState, type CSSProperties, type InputHTMLAttributes } from "react";
import { Icon, type IconName } from "./Icon";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style"> {
  label?: string;
  hint?: string;
  /** Error message — replaces hint and turns the border red. */
  error?: string;
  icon?: IconName;
  style?: CSSProperties;
}

/** Single-line text field. Inset well, steel-blue border on focus. */
export function Input({ label, hint, error, icon, type = "text", style, ...rest }: InputProps) {
  const [f, setF] = useState(false);
  return (
    <label style={{ display: "block", ...style }}>
      {label && <span style={{ display: "block", font: "var(--fw-medium) 13px/1 var(--font-body)", color: "var(--text-muted)", marginBottom: 7 }}>{label}</span>}
      <span style={{ display: "flex", alignItems: "center", gap: 9, minHeight: 42, padding: "0 12px", background: "var(--surface-inset)",
        border: `1px solid ${error ? "var(--lose-500)" : f ? "var(--focus-ring-color)" : "var(--border-soft)"}`, borderRadius: "var(--r-md)",
        boxShadow: "var(--shadow-inset-well)", transition: "border-color var(--dur-fast) var(--ease-out)" }}>
        {icon && <Icon name={icon} size={16} color="var(--text-faint)" />}
        <input type={type} onFocus={() => setF(true)} onBlur={() => setF(false)} {...rest}
          style={{ flex: 1, border: "none", outline: "none", boxShadow: "none", background: "transparent", font: "var(--fw-regular) 15px/1.4 var(--font-body)", color: "var(--text-strong)", padding: "10px 0", minWidth: 0 }} />
      </span>
      {(hint || error) && <span style={{ display: "block", marginTop: 6, fontSize: 12.5, color: error ? "var(--lose-500)" : "var(--text-faint)" }}>{error || hint}</span>}
    </label>
  );
}
