import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthExperience from "./auth-experience";
import { createSupabaseServerClient } from "../../lib/supabase/server";

export const metadata: Metadata = {
  title: "Sign in | NxGenVarsity × Prerana",
  description: "Sign in or create your NxGenVarsity × Prerana learning account.",
};

export default async function LoginPage() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) redirect("/dashboard");
  }
  return <AuthExperience />;
}
