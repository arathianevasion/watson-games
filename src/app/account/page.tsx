import { notFound, redirect } from "next/navigation";
import { authEnabled } from "@/lib/supabase/env";
import { revalidatePath } from "next/cache";
import { createClient, getProfile } from "@/lib/supabase/server";

export const metadata = { title: "Account" };

async function updateDisplayName(formData: FormData) {
  "use server";
  if (!authEnabled) redirect("/");
  const name = String(formData.get("display_name") ?? "").trim();
  if (name.length < 2 || name.length > 24) redirect("/account?error=length");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");
  const { error } = await supabase.from("profiles").update({ display_name: name }).eq("id", user.id);
  if (error) redirect("/account?error=save");
  revalidatePath("/", "layout");
  redirect("/account?saved=1");
}

export default async function AccountPage({ searchParams }: PageProps<"/account">) {
  if (!authEnabled) notFound();
  const profile = await getProfile();
  if (!profile) redirect("/login?next=/account");
  const { error, saved } = await searchParams;

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-4 text-2xl font-bold">Account</h1>
      <form action={updateDisplayName} className="space-y-2">
        <label className="block text-sm text-muted" htmlFor="display_name">
          Display name (shown on leaderboards)
        </label>
        <input
          id="display_name"
          name="display_name"
          defaultValue={profile.display_name}
          minLength={2}
          maxLength={24}
          required
          className="w-full rounded border border-border bg-card px-3 py-2"
        />
        <button className="w-full rounded bg-accent px-3 py-2 font-semibold text-black">Save</button>
      </form>
      {saved && <p className="mt-3 text-sm text-muted">Saved.</p>}
      {error === "length" && <p className="mt-3 text-sm text-red-400">Name must be 2–24 characters.</p>}
      {error === "save" && <p className="mt-3 text-sm text-red-400">Could not save. Try again.</p>}
    </div>
  );
}
