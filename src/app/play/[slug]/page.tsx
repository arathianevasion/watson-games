import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { games, getGame } from "@/lib/games";
import { authEnabled } from "@/lib/supabase/env";
import { getProfile } from "@/lib/supabase/server";
import { PlayShell } from "./PlayShell";

export function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/play/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const game = getGame(slug);
  return game ? { title: `Playing ${game.title}` } : {};
}

export default async function PlayPage({ params }: PageProps<"/play/[slug]">) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();
  const profile = await getProfile();
  return <PlayShell game={game} authEnabled={authEnabled} user={profile ? { id: profile.id, displayName: profile.display_name } : null} />;
}
