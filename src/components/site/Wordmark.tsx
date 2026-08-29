import Link from "next/link";

export function Wordmark({ size = 20, href = "/" }: { size?: number; href?: string }) {
  return (
    <Link href={href} className="plain" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: size, letterSpacing: "-.03em", color: "var(--text-strong)", whiteSpace: "nowrap" }}>
      watson<span style={{ color: "var(--red-400)" }}>games</span>
    </Link>
  );
}
