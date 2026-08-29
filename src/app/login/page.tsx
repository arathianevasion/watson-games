import { notFound, redirect } from "next/navigation";
import { Card } from "@/components/ds";
import { authEnabled } from "@/lib/supabase/env";
import { getUser } from "@/lib/supabase/server";
import LoginForm from "./LoginForm";

export const metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  if (!authEnabled) notFound();
  const { next, error } = await searchParams;
  const dest = typeof next === "string" ? next : "/";
  if (await getUser()) redirect(dest);
  return (
    <div style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: "var(--sp-8) var(--gutter)" }}>
      <Card style={{ width: "100%", maxWidth: 400, padding: 28 }}>
        <h2 style={{ marginTop: 0, fontSize: "var(--fs-title)" }}>Welcome back</h2>
        <p style={{ fontSize: 14.5, color: "var(--text-muted)" }}>Sign in to keep your scores and saved games.</p>
        {error && <p style={{ fontSize: 14, color: "var(--lose-500)" }}>That sign-in did not go through. Try again.</p>}
        <LoginForm next={dest} />
      </Card>
    </div>
  );
}
