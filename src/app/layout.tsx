import type { Metadata } from "next";
import { JetBrains_Mono, Rubik, Space_Grotesk } from "next/font/google";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { listedGames } from "@/lib/games";
import { authEnabled } from "@/lib/supabase/env";
import { getProfile } from "@/lib/supabase/server";
import "./globals.css";

const display = Space_Grotesk({ variable: "--font-display", subsets: ["latin"], weight: ["400", "500", "700"] });
const body = Rubik({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500", "700"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: { default: "Watson Games", template: "%s · Watson Games" },
  description: "Free browser games. No downloads, no accounts needed to start.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const profile = await getProfile();
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
        <SiteHeader authEnabled={authEnabled} profile={profile} gameCount={listedGames().length} />
        <main style={{ flex: 1 }}>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
