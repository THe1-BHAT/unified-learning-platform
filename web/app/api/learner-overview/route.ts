import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

function unavailable() {
  return NextResponse.json(
    { error: "Learner overview is not ready. Apply the latest Supabase migration and try again." },
    { status: 503 },
  );
}

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const [walletResult, profileResult, statsResult, leaderboardResult] = await Promise.all([
    supabase.from("coin_wallets").select("balance").eq("user_id", user.id).maybeSingle(),
    supabase.from("profiles").select("full_name, show_on_leaderboard").eq("id", user.id).maybeSingle(),
    supabase.from("learner_activity_stats").select("watch_seconds, tests_taken, welcome_seen_at").eq("user_id", user.id).maybeSingle(),
    supabase.rpc("get_coin_leaderboard", { p_limit: 5, p_offset: 0 }),
  ]);

  if (statsResult.error) return unavailable();

  return NextResponse.json({
    name: profileResult.data?.full_name || user.user_metadata.full_name || user.email?.split("@")[0] || "Learner",
    balance: Number(walletResult.data?.balance ?? 0),
    watch_seconds: Number(statsResult.data?.watch_seconds ?? 0),
    tests_taken: Number(statsResult.data?.tests_taken ?? 0),
    welcome_seen: Boolean(statsResult.data?.welcome_seen_at),
    show_on_leaderboard: Boolean(profileResult.data?.show_on_leaderboard),
    leaderboard: leaderboardResult.data ?? [],
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  if (typeof body.show_on_leaderboard === "boolean") {
    const { data: updatedProfile, error } = await supabase.from("profiles")
      .update({ show_on_leaderboard: body.show_on_leaderboard })
      .eq("id", user.id)
      .select("show_on_leaderboard")
      .maybeSingle();
    if (error || !updatedProfile) {
      return NextResponse.json({ error: "Your learner profile could not be updated. Please sign out and back in, then try again." }, { status: 400 });
    }

    return NextResponse.json({ show_on_leaderboard: updatedProfile.show_on_leaderboard });
  }

  const activityKey = typeof body.activity_key === "string" ? body.activity_key : null;
  const rawSeconds = typeof body.watch_seconds === "number" ? body.watch_seconds : 0;
  const watchSeconds = Math.floor(rawSeconds);
  const markWelcomeSeen = body.mark_welcome_seen === true;

  if (watchSeconds < 0 || watchSeconds > 60) {
    return NextResponse.json({ error: "Watch time update must be between 0 and 60 seconds" }, { status: 400 });
  }
  if (activityKey || watchSeconds > 0 || markWelcomeSeen) {
    const { error } = await supabase.rpc("record_learner_activity", {
      p_activity_key: activityKey,
      p_watch_seconds: watchSeconds,
      p_mark_welcome_seen: markWelcomeSeen,
    });
    if (error) return unavailable();
  }

  const { data: stats, error: statsError } = await supabase.from("learner_activity_stats")
    .select("watch_seconds, tests_taken, welcome_seen_at")
    .eq("user_id", user.id)
    .maybeSingle();
  if (statsError) return unavailable();

  return NextResponse.json({
    watch_seconds: Number(stats?.watch_seconds ?? 0),
    tests_taken: Number(stats?.tests_taken ?? 0),
    welcome_seen: Boolean(stats?.welcome_seen_at),
  });
}
