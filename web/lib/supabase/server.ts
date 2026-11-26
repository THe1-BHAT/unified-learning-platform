import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error("Supabase public environment variables are required.");
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (updates) => {
        try {
          const rememberMe = cookieStore.get("nxv-remember")?.value === "1";
          updates.forEach(({ name, value, options }) => {
            const cookieOptions = { ...options };
            if (!rememberMe && cookieOptions.maxAge !== 0) delete cookieOptions.maxAge;
            cookieStore.set(name, value, cookieOptions);
          });
        } catch {
          // Server components cannot write cookies; middleware/actions refresh them.
        }
      },
    },
  });
}
