"use client";
import type { CSSProperties } from "react";
import { Icon, type IconName } from "./Icon";

export interface Tab { id: string; label: string; icon?: IconName; count?: number }
export interface TabsProps {
  tabs: Tab[];
  value?: string;
  onChange?: (id: string) => void;
  style?: CSSProperties;
}

/** Underline tab bar — the only place a 2px red rule appears. */
export function Tabs({ tabs, value, onChange, style }: TabsProps) {
  const active = value ?? tabs[0]?.id;
  return (
    <div role="tablist" style={{ display: "flex", gap: 2, borderBottom: "1px solid var(--border-soft)", ...style }}>
      {tabs.map((t) => { const on = t.id === active;
        return (
          <button key={t.id} role="tab" aria-selected={on} onClick={() => onChange?.(t.id)}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, minHeight: 40, padding: "10px 14px", cursor: "pointer",
              background: "transparent", color: on ? "var(--text-strong)" : "var(--text-muted)", border: "none",
              borderBottom: `2px solid ${on ? "var(--accent-primary)" : "transparent"}`, marginBottom: -1,
              font: "var(--fw-medium) 14px/1 var(--font-body)",
              transition: "color var(--dur-fast) var(--ease-out),border-color var(--dur-fast) var(--ease-out)" }}>
            {t.icon && <Icon name={t.icon} size={15} />}{t.label}
            {t.count != null && <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--text-faint)" }}>{t.count}</span>}
          </button>
        ); })}
    </div>
  );
}
