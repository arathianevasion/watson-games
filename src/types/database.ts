// Hand-written to match supabase/migrations. Regenerate with `pnpm db:types` once
// linked to a project (requires Docker for --local, or `--linked` for the hosted project).
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; display_name: string; created_at: string };
        Insert: { id: string; display_name: string; created_at?: string };
        Update: { id?: string; display_name?: string; created_at?: string };
        Relationships: [];
      };
      games: {
        Row: {
          slug: string;
          score_order: "asc" | "desc";
          min_score: number;
          max_score: number;
          leaderboard_enabled: boolean;
        };
        Insert: {
          slug: string;
          score_order: "asc" | "desc";
          min_score?: number;
          max_score: number;
          leaderboard_enabled?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["games"]["Insert"]>;
        Relationships: [];
      };
      scores: {
        Row: { id: number; user_id: string; game_slug: string; score: number; created_at: string };
        Insert: { id?: never; user_id: string; game_slug: string; score: number; created_at?: string };
        Update: { user_id?: string; game_slug?: string; score?: number; created_at?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      submit_score: { Args: { p_game_slug: string; p_score: number }; Returns: number };
      top_scores: {
        Args: { p_game_slug: string; p_limit?: number };
        Returns: { user_id: string; display_name: string; score: number; created_at: string }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
