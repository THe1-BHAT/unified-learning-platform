"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createSupabaseBrowserClient } from "../../lib/supabase/browser";
import "../login/login.css";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");
    if (password.length < 8) return setFeedback("Use at least 8 characters for your new password.");
    if (password !== confirm) return setFeedback("Those passwords don’t match yet.");
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setFeedback("Password updated. Taking you to sign in…");
      window.setTimeout(() => router.replace("/login"), 1200);
    } catch {
      setFeedback("This reset link may have expired. Request a fresh link from the login page.");
    } finally {
      setLoading(false);
    }
  }

  return <main className="auth-shell"><section className="form-panel"><div className="mobile-brand"><Image src="/brand/nxgenvarsity-logo.png" alt="NxGenVarsity" width={135} height={43} /><span>×</span><strong>PRERANA</strong></div><div className="auth-card"><div className="card-heading"><p className="welcome-line">Account recovery</p><h2>Choose a new password</h2><p className="card-subtitle">Make it one you haven’t used before.</p></div><form className="auth-form reset-form" onSubmit={submit}><label className="field-label" htmlFor="password">New password<span className="input-wrap"><input id="password" name="password" type="password" minLength={8} autoComplete="new-password" required /></span></label><label className="field-label" htmlFor="confirm">Confirm new password<span className="input-wrap"><input id="confirm" name="confirm" type="password" minLength={8} autoComplete="new-password" required /></span></label>{feedback && <p className="form-feedback info" role="status">{feedback}</p>}<button className="primary-submit" disabled={loading}>{loading ? "Updating…" : "Update password"}</button></form><a className="back-to-login" href="/login">Back to log in</a></div></section></main>;
}
