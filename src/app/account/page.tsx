import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Badge, Button, Card, Input } from "@/components/ds";
import { authEnabled } from "@/lib/supabase/env";
import { createClient, getProfile } from "@/lib/supabase/server";

export const metadata = { title: "Account" };

async function updateDisplayName(formData: FormData) {
  "use server";
  if (!authEnabled) redirect("/");
  const name = String(formData.get("display_name") ?? "").trim();
  if (name.length < 2 || name.length > 24) redirect("/account?error=length");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
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
  const initials = profile.display_name.slice(0, 2).toUpperCase();

  return (
    <div className="container" style={{ padding: "var(--sp-7) var(--gutter) var(--sp-9)" }}>
      <Card padding={0} style={{ overflow: "hidden", marginBottom: "var(--sp-6)" }}>
        <div style={{ padding: "var(--sp-6)", display: "flex", gap: "var(--sp-5)", alignItems: "center" }}>
          <span style={{ width: 64, height: 64, borderRadius: "var(--r-lg)", background: "var(--blue-600)", color: "var(--white)", display: "grid", placeItems: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22 }}>{initials}</span>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: "0 0 7px", fontSize: "var(--fs-title)" }}>{profile.display_name}</h1>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}><Badge tone="blue" icon="trophy">Player</Badge></div>
          </div>
          <form action="/auth/signout" method="post"><Button variant="outline" size="sm" icon="log-out">Sign out</Button></form>
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-5)", alignItems: "start" }}>
        <Card>
          <h3 style={{ marginTop: 0, fontSize: 17 }}>Account</h3>
          <form action={updateDisplayName} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <Input label="Display name" name="display_name" defaultValue={profile.display_name} minLength={2} maxLength={24} required
              hint="Other players see this on leaderboards."
              error={error === "length" ? "Names are 2 to 24 characters." : error === "save" ? "That did not save. Try again." : undefined} />
            <div><Button type="submit">Save changes</Button></div>
            {saved && <p style={{ margin: 0, fontSize: 14, color: "var(--win-500)" }}>Saved.</p>}
          </form>
        </Card>
      </div>
    </div>
  );
}
