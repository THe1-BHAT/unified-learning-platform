"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../../lib/supabase/browser";

export default function RedeemCoupon({ courseSlug }: { courseSlug: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const code = String(form.get("code") ?? "").trim();
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.functions.invoke("redeem-coupon", { body: { courseSlug, code } });
      if (error || !data?.enrollment) throw new Error("This code could not be redeemed. Check it and try again.");
      setMessage(data.enrollment.already_enrolled ? "You already have access to this course." : "Course access is active. Your lessons are unlocked.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "This code could not be redeemed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="learning-wallet" aria-labelledby="coupon-heading">
      <div><strong id="coupon-heading">Have a course access code?</strong><br /><span>Redeem a valid code to unlock the full course.</span></div>
      <form className="learning-form" onSubmit={submit}>
        <label className="screen-reader" htmlFor={`coupon-${courseSlug}`}>Course access code</label>
        <input className="learning-input" id={`coupon-${courseSlug}`} name="code" autoComplete="off" placeholder="Enter access code" required disabled={busy} />
        <button className="learning-button" type="submit" disabled={busy}>{busy ? "Checking…" : "Redeem code"}</button>
        {message && <p className="learning-message" role="status">{message}</p>}
      </form>
    </section>
  );
}
