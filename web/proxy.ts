import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (updates) => {
        updates.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        const rememberMe = request.cookies.get("nxv-remember")?.value === "1";
        updates.forEach(({ name, value, options }) => {
          const cookieOptions = { ...options };
          if (!rememberMe && cookieOptions.maxAge !== 0) delete cookieOptions.maxAge;
          response.cookies.set(name, value, cookieOptions);
        });
      },
    },
  });

  // Refreshes the auth session and writes rotated cookies to the response.
  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
