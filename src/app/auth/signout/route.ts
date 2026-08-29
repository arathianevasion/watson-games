import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authEnabled } from "@/lib/supabase/env";

export async function POST(request: NextRequest) {
  if (!authEnabled) return NextResponse.redirect(new URL("/", request.url), { status: 303 });
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
