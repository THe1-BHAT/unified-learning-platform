import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

function getPublicOrigin(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  const host = request.headers.get("host")?.trim();
  if (host) {
    const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");
    return `${isLocal ? "http" : "https"}://${host}`;
  }

  return process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
}

async function handleSignOut(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createSupabaseServerClient();
      await supabase.auth.signOut();
    } catch {
      // Clear auth cookies on the redirect response even if remote sign-out fails.
    }
  }

  const loginUrl = new URL("/login", getPublicOrigin(request));
  const response = NextResponse.redirect(loginUrl, { status: 303 });
  for (const cookie of request.cookies.getAll()) {
    if (cookie.name.startsWith("sb-")) {
      response.cookies.delete(cookie.name);
    }
  }
  return response;
}

export async function POST(request: NextRequest) {
  return handleSignOut(request);
}

export async function GET(request: NextRequest) {
  return handleSignOut(request);
}
