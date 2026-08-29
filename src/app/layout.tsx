import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { getProfile } from "@/lib/supabase/server";
import { authEnabled } from "@/lib/supabase/env";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Watson Games", template: "%s · Watson Games" },
  description: "Play browser games. Sign in to save your scores.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const profile = await getProfile();
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-extrabold tracking-wide">
              <span className="text-accent">Watson</span> Games
            </Link>
            {authEnabled && (
            <nav className="flex items-center gap-4 text-sm">
              {profile ? (
                <>
                  <Link href="/account" className="text-muted hover:text-foreground">
                    {profile.display_name}
                  </Link>
                  <form action="/auth/signout" method="post">
                    <button className="rounded border border-border px-3 py-1 hover:bg-card">Sign out</button>
                  </form>
                </>
              ) : (
                <Link href="/login" className="rounded bg-accent px-3 py-1 font-semibold text-black">
                  Sign in
                </Link>
              )}
            </nav>
            )}
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
        <footer className="border-t border-border py-4 text-center text-xs text-muted">Watson Games</footer>
      </body>
    </html>
  );
}
