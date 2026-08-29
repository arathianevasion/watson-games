import type { Metadata } from "next";
import { categories, listedGames } from "@/lib/games";
import { Browse } from "./Browse";

export const metadata: Metadata = { title: "All games" };

export default async function GamesPage({ searchParams }: PageProps<"/games">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const sort = typeof sp.sort === "string" ? sp.sort : "popular";
  return <Browse games={listedGames()} categories={categories()} initialQuery={q} initialSort={sort} />;
}
