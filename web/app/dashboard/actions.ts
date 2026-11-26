"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "../../lib/supabase/server";

export async function setLeaderboardVisibility(formData: FormData) {
  const visible = formData.get("visible") === "true";
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("profiles").update({ show_on_leaderboard: visible }).eq("id", user.id);
  revalidatePath("/dashboard");
}
