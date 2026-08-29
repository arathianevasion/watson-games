import type { CSSProperties } from "react";

const FILL = { blue: "var(--accent-secondary)", red: "var(--accent-primary)", win: "var(--win-500)", neutral: "var(--slate-400)" };

export interface ProgressBarProps {
  value?: number;
  max?: number;
  label?: string;
  tone?: keyof typeof FILL;
  height?: number;
  style?: CSSProperties;
}

export function ProgressBar({ value = 0, max = 100, label, tone = "blue", height = 6, style }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={style}>
      {label && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, font: "var(--fw-medium) 12.5px/1 var(--font-body)", color: "var(--text-muted)" }}>
          <span>{label}</span><span style={{ fontFamily: "var(--font-mono)", color: "var(--text-faint)" }}>{value}/{max}</span>
        </div>
      )}
      <div style={{ height, background: "var(--surface-inset)", border: "1px solid var(--border-soft)", borderRadius: "var(--r-pill)", overflow: "hidden" }}>
        <div style={{ width: pct + "%", height: "100%", background: FILL[tone], transition: "width var(--dur-slow) var(--ease-out)" }} />
      </div>
    </div>
  );
}
