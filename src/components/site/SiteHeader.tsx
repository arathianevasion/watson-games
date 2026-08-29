"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Input, LinkButton } from "@/components/ds";
import { Wordmark } from "./Wordmark";

interface Props {
  authEnabled: boolean;
  profile: { display_name: string } | null;
  gameCount: number;
}

const NAV: [string, string][] = [["/games", "Games"], ["/games?sort=new", "What's new"]];

export function SiteHeader({ authEnabled, profile, gameCount }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [q, setQ] = useState("");
  const search = (e: FormEvent) => { e.preventDefault(); router.push(q.trim() ? `/games?q=${encodeURIComponent(q.trim())}` : "/games"); };
  const initials = profile ? profile.display_name.slice(0, 2).toUpperCase() : "";

  return (
    <header style={{ position: "sticky", top: 0, zIndex: "var(--z-sticky)", background: "var(--surface-page)", borderBottom: "1px solid var(--border-soft)" }}>
      <div className="container" style={{ padding: "12px var(--gutter)", display: "flex", alignItems: "center", gap: "var(--sp-6)" }}>
        <Wordmark />
        <nav className="header-nav" style={{ display: "flex", gap: "var(--sp-1)" }}>
          {NAV.map(([href, label]) => { const on = pathname === href.split("?")[0] && (href.includes("?") ? false : true);
            return <Link key={href} href={href} className="plain" style={{ color: on ? "var(--text-strong)" : "var(--text-muted)", padding: "9px 12px", borderRadius: "var(--r-sm)", font: "var(--fw-medium) 14.5px/1 var(--font-body)" }}>{label}</Link>; })}
        </nav>
        <form onSubmit={search} role="search" style={{ flex: 1, maxWidth: 260, marginLeft: "auto" }}>
          <Input icon="search" placeholder={`Search ${gameCount} games`} value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search games" />
        </form>
        {authEnabled && (profile
          ? <Link href="/account" className="plain" style={{ display: "flex", alignItems: "center", gap: 9, border: "1px solid var(--border-soft)", background: "var(--surface-card)", borderRadius: "var(--r-md)", padding: "5px 11px 5px 6px" }}>
              <span style={{ width: 26, height: 26, borderRadius: "var(--r-sm)", background: "var(--blue-600)", color: "var(--white)", display: "grid", placeItems: "center", font: "var(--fw-medium) 12px/1 var(--font-body)" }}>{initials}</span>
              <span style={{ font: "var(--fw-medium) 13px/1 var(--font-body)", color: "var(--text-body)" }}>{profile.display_name}</span>
            </Link>
          : <LinkButton href="/login" size="sm" variant="quiet">Sign in</LinkButton>)}
      </div>
    </header>
  );
}
