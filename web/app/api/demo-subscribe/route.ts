import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

export async function POST(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const existing = (request.cookies.get("nxv-subscribed-uid")?.value ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  if (!existing.includes(user.id)) existing.push(user.id);

  const response = NextResponse.json({ subscribed: true }, { status: 200 });
  response.cookies.set("nxv-subscribed-uid", existing.join(","), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
