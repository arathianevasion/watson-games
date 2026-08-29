"use client";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { supabaseEnv } from "./env";

let client: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function createClient() {
  if (!client) {
    const { url, key } = supabaseEnv();
    client = createBrowserClient<Database>(url, key);
  }
  return client;
}
