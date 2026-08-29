import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Skip static assets, game bundles, and the SDK — none of them need a session.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|game-files/|sdk/|thumbs/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
