"use client";
import type { CSSProperties, ReactNode } from "react";
import { IconButton } from "./IconButton";

export interface DialogProps {
  open?: boolean;
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
  onClose?: () => void;
  width?: number;
  style?: CSSProperties;
}

export function Dialog({ open = true, title, children, actions, onClose, width = 440, style }: DialogProps) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: "var(--z-overlay)", display: "grid", placeItems: "center", background: "rgba(11,13,16,.68)", padding: "var(--sp-6)" }} onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: width, background: "var(--surface-card)", border: "1px solid var(--border-strong)", borderRadius: "var(--r-xl)", boxShadow: "var(--shadow-e3)", padding: "var(--sp-6)", ...style }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: "var(--sp-3)" }}>
          <h3 style={{ flex: 1, margin: 0, font: "var(--type-title)", color: "var(--text-strong)" }}>{title}</h3>
          {onClose && <IconButton icon="x" label="Close" size="sm" variant="ghost" onClick={onClose} />}
        </div>
        <div style={{ font: "var(--type-body)", color: "var(--text-body)" }}>{children}</div>
        {actions && <div style={{ display: "flex", gap: "var(--sp-2)", marginTop: "var(--sp-6)", justifyContent: "flex-end", flexWrap: "wrap" }}>{actions}</div>}
      </div>
    </div>
  );
}
