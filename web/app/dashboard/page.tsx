import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import "../login/login.css";
import { setLeaderboardVisibility } from "./actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) redirect("/login");
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: wallet } = await supabase.from("coin_wallets").select("balance").eq("user_id", user.id).maybeSingle();
  const [{ data: profile }, { data: leaderboard }] = await Promise.all([
    supabase.from("profiles").select("show_on_leaderboard").eq("id", user.id).maybeSingle(),
    supabase.rpc("get_coin_leaderboard", { p_limit: 10, p_offset: 0 }),
  ]);
  const leaderboardEntries = (leaderboard ?? []) as Array<{
    user_id: string;
    display_name: string;
    coins: number | string;
    rank: number;
  }>;

  return (
    <main className="auth-shell">
      <section className="form-panel">
        <div className="auth-card">
          <p className="welcome-line">NXGENVARSITY × PRERANA</p>
          <h1 className="dashboard-title">Welcome{user.user_metadata.full_name ? `, ${user.user_metadata.full_name}` : ""}.</h1>
          <p className="card-subtitle">You’re signed in as {user.email}. Your learning dashboard will appear here.</p>
          <div className="wallet-summary">
            <span className="wallet-coin" aria-hidden="true">✦</span>
            <div>
              <strong>{Number(wallet?.balance ?? 0).toLocaleString("en-IN")} coins</strong>
              <span>Earn 10 coins for each completed module and 20 for each completed quiz.</span>
            </div>
          </div>
          <section className="leaderboard-panel" aria-labelledby="leaderboard-heading">
            <div className="leaderboard-heading-row"><div><p className="welcome-line">Learning community</p><h2 id="leaderboard-heading">Coin leaderboard</h2></div><span className="leaderboard-badge">TOP 10</span></div>
            <form action={setLeaderboardVisibility} className="leaderboard-optin">
              <span>{profile?.show_on_leaderboard ? "Your name is visible to signed-in learners." : "Your name stays private unless you opt in."}</span>
              <input type="hidden" name="visible" value={profile?.show_on_leaderboard ? "false" : "true"} />
              <button type="submit">{profile?.show_on_leaderboard ? "Opt out" : "Join leaderboard"}</button>
            </form>
            {leaderboardEntries.length ? <ol className="leaderboard-list">{leaderboardEntries.map((entry) => <li key={entry.user_id}><span className="leaderboard-rank">{entry.rank}</span><span className="leaderboard-name">{entry.display_name}{entry.user_id === user.id ? " (you)" : ""}</span><strong>{Number(entry.coins).toLocaleString("en-IN")} <small>coins</small></strong></li>)}</ol> : <p className="leaderboard-empty">The leaderboard will fill as learners opt in and earn coins.</p>}
          </section>
          <form action="/auth/signout" method="post"><button className="primary-submit" type="submit">Sign out</button></form>
        </div>
      </section>
    </main>
  );
}
