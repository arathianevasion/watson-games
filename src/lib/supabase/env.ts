// NEXT_PUBLIC_* vars are inlined at build time on both server and client, so
// this flag is safe to read anywhere. Leave both unset to run without accounts.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const authEnabled = Boolean(url && key);

export function supabaseEnv() {
  if (!url || !key) {
    throw new Error(
      "Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY). Check authEnabled before calling.",
    );
  }
  return { url, key };
}
