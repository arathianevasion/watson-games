"use client";
import type { CSSProperties } from "react";
import { Icon, type IconName } from "./Icon";

const T: Record<string, [string, IconName]> = { win: ["var(--win-500)", "circle-check"], info: ["var(--info-500)", "info"], warn: ["var(--warn-500)", "triangle-alert"], lose: ["var(--lose-500)", "circle-x"] };

export interface ToastProps {
  tone?: "win" | "info" | "warn" | "lose";
  title: string;
  message?: string;
  onDismiss?: () => void;
  style?: CSSProperties;
}

export function Toast({ tone = "info", title, message, onDismiss, style }: ToastProps) {
  const [c, icon] = T[tone];
  return (
    <div role="status" style={{ display: "flex", gap: 11, alignItems: "flex-start", maxWidth: 380, padding: "13px 14px", background: "var(--surface-raised)", border: "1px solid var(--border-strong)", borderRadius: "var(--r-md)", boxShadow: "var(--shadow-e3)", ...style }}>
      <Icon name={icon} size={18} color={c} style={{ marginTop: 1 }} />
      <div style={{ flex: 1 }}>
        <div style={{ font: "var(--fw-medium) 14.5px/1.35 var(--font-body)", color: "var(--text-strong)" }}>{title}</div>
        {message && <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{message}</div>}
      </div>
      {onDismiss && (
        <button type="button" aria-label="Dismiss" onClick={onDismiss} style={{ cursor: "pointer", padding: 2, opacity: 0.7, background: "none", border: "none" }}>
          <Icon name="x" size={14} color="var(--text-muted)" />
        </button>
      )}
    </div>
  );
}
