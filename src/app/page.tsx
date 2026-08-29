import Link from "next/link";
import { listedGames } from "@/lib/games";

export default function Home() {
  const games = listedGames();
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Games</h1>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {games.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/games/${g.slug}`}
              className="block overflow-hidden rounded-lg border border-border bg-card transition hover:border-accent"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.thumbnail} alt="" className="aspect-video w-full object-cover" />
              <div className="p-3">
                <div className="font-semibold">{g.title}</div>
                <div className="line-clamp-2 text-xs text-muted">{g.description}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
