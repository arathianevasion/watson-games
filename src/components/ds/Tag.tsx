"use client";
import { useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

export interface TagProps {
  selected?: boolean;
  icon?: IconName;
  /** Renders a dismiss x and fires this. */
  onRemove?: () => void;
  onClick?: (e: MouseEvent | KeyboardEvent) => void;
  style?: CSSProperties;
  children?: ReactNode;
}

/** Interactive filter chip. Selected state is steel-blue fill. */
export function Tag({ selected, icon, onRemove, onClick, children, style }: TagProps) {
  const [h, setH] = useState(false);
  const interactive = Boolean(onClick);
  return (
    <span
      role={interactive ? "button" : undefined} tabIndex={interactive ? 0 : undefined}
      aria-pressed={interactive ? Boolean(selected) : undefined}
      onClick={onClick}
      onKeyDown={(e) => { if (interactive && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onClick?.(e); } }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: "inline-flex", alignItems: "center", gap: 6, minHeight: 32, padding: "6px 12px", cursor: interactive ? "pointer" : "default",
        background: selected ? "var(--accent-secondary)" : h && interactive ? "var(--surface-raised)" : "transparent",
        color: selected ? "var(--white)" : "var(--text-body)",
        border: `1px solid ${selected ? "var(--accent-secondary)" : "var(--border-soft)"}`, borderRadius: "var(--r-pill)",
        font: "var(--fw-medium) 13px/1 var(--font-body)",
        transition: "background var(--dur-fast) var(--ease-out),border-color var(--dur-fast) var(--ease-out)", ...style }}
    >
      {icon && <Icon name={icon} size={14} />}{children}
      {onRemove && (
        <button type="button" aria-label="Remove" onClick={(e) => { e.stopPropagation(); onRemove(); }}
          style={{ display: "inline-flex", opacity: 0.7, background: "none", border: "none", padding: 0, color: "inherit", cursor: "pointer" }}>
          <Icon name="x" size={13} />
        </button>
      )}
    </span>
  );
}
