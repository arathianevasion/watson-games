import { notFound, redirect } from "next/navigation";
import { authEnabled } from "@/lib/supabase/env";
import { getUser } from "@/lib/supabase/server";
import LoginForm from "./LoginForm";

export const metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  if (!authEnabled) notFound();
  const { next, error } = await searchParams;
  if (await getUser()) redirect(typeof next === "string" ? next : "/");
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-4 text-2xl font-bold">Sign in</h1>
      {error && <p className="mb-3 text-sm text-red-400">Sign-in failed. Please try again.</p>}
      <LoginForm next={typeof next === "string" ? next : "/"} />
    </div>
  );
}
