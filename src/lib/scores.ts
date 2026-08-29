import { createClient } from "@/lib/supabase/server";
import type { Game } from "@/lib/games";

export interface ScoreRow {
  user_id: string;
  display_name: string;
  score: number;
  created_at: string;
}

export async function fetchTopScores(slug: string, limit = 10): Promise<ScoreRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("top_scores", { p_game_slug: slug, p_limit: limit });
  if (error) {
    console.error("top_scores", error.message);
    return [];
  }
  return (data ?? []).map((r) => ({ ...r, score: Number(r.score) }));
}

export async function fetchPersonalBest(slug: string, userId: string, order: Game["leaderboard"]["order"]) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("scores")
    .select("score, created_at")
    .eq("user_id", userId)
    .eq("game_slug", slug)
    .order("score", { ascending: order === "asc" })
    .limit(1)
    .maybeSingle();
  return data ? { score: Number(data.score), created_at: data.created_at } : null;
}

export function formatScore(score: number, game: Game) {
  const { unit } = game.leaderboard;
  if (unit === "s") return `${score.toFixed(2)} s`;
  return score.toLocaleString();
}
