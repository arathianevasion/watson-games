"use client";
import { useState, type CSSProperties, type SelectHTMLAttributes } from "react";
import { Icon } from "./Icon";

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "style"> {
  label?: string;
  /** Strings, or {value,label} pairs. */
  options?: Array<string | { value: string; label: string }>;
  hint?: string;
  style?: CSSProperties;
}

/** Native select in brand chrome, with a Lucide chevron. */
export function Select({ label, options = [], hint, style, ...rest }: SelectProps) {
  const [f, setF] = useState(false);
  return (
    <label style={{ display: "block", ...style }}>
      {label && <span style={{ display: "block", font: "var(--fw-medium) 13px/1 var(--font-body)", color: "var(--text-muted)", marginBottom: 7 }}>{label}</span>}
      <span style={{ display: "flex", alignItems: "center", minHeight: 42, padding: "0 10px 0 12px", background: "var(--surface-inset)",
        border: `1px solid ${f ? "var(--focus-ring-color)" : "var(--border-soft)"}`, borderRadius: "var(--r-md)", boxShadow: "var(--shadow-inset-well)" }}>
        <select onFocus={() => setF(true)} onBlur={() => setF(false)} {...rest}
          style={{ flex: 1, appearance: "none", border: "none", outline: "none", boxShadow: "none", background: "transparent", font: "var(--fw-regular) 15px/1.4 var(--font-body)", color: "var(--text-strong)", padding: "10px 0", minWidth: 0 }}>
          {options.map((o) => { const v = typeof o === "string" ? o : o.value, l = typeof o === "string" ? o : o.label;
            return <option key={v} value={v} style={{ background: "var(--surface-card)" }}>{l}</option>; })}
        </select>
        <Icon name="chevron-down" size={16} color="var(--text-muted)" />
      </span>
      {hint && <span style={{ display: "block", marginTop: 6, fontSize: 12.5, color: "var(--text-faint)" }}>{hint}</span>}
    </label>
  );
}
