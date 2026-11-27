"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../../lib/supabase/browser";
import type { CourseWithAccess } from "../../lib/course-access";
import { AuthShell } from "../shared/auth-shell";
import "../login/login.css";
import "./checkout.css";

type PaymentMethod = "card" | "upi";
type Feedback = { kind: "success" | "error" | "info"; text: string } | null;
type InvoiceDetails = {
  invoiceNumber: string;
  paidAt: string;
  methodLabel: string;
  subtotal: string;
  discount: string;
  totalPaid: string;
};

const ONE_TIME_PRICE_PAISE = 250000;
const DEMO_COUPON_CODE = "STUDENTOFFER";

function formatInr(pricePaise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: pricePaise % 100 === 0 ? 0 : 2,
  }).format(pricePaise / 100);
}

export default function CheckoutExperience({
  userEmail,
  userName,
  initialCourses,
}: {
  userEmail: string;
  userName: string | null;
  initialCourses: CourseWithAccess[];
  initialCourseSlug?: string | null;
}) {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseWithAccess[]>(initialCourses);
  const [demoUnlocked, setDemoUnlocked] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponFeedback, setCouponFeedback] = useState<Feedback>(null);
  const [showCouponPopup, setShowCouponPopup] = useState(false);
  const [showSubscribedModal, setShowSubscribedModal] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentFeedback, setPaymentFeedback] = useState<Feedback>(null);
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails | null>(null);

  const allEnrolled = courses.length > 0 && courses.every((c) => c.enrolled);
  const isUnlocked = allEnrolled || demoUnlocked;
  const displayPrice = isUnlocked ? "₹0" : formatInr(ONE_TIME_PRICE_PAISE);

  async function activateDemoSubscription() {
    await fetch("/api/demo-subscribe", { method: "POST" });
  }

  function createInvoice(methodLabel: string, usedCoupon: boolean): InvoiceDetails {
    const now = new Date();
    const code = Math.random().toString(36).slice(2, 7).toUpperCase();
    return {
      invoiceNumber: `NXV-${now.getFullYear()}-${code}`,
      paidAt: now.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      methodLabel,
      subtotal: "₹2,500",
      discount: usedCoupon ? "-₹2,500 (STUDENTOFFER)" : "₹0",
      totalPaid: usedCoupon ? "₹0" : "₹2,500",
    };
  }

  function handleDownloadInvoice() {
    const details = invoiceDetails ?? createInvoice("Unified All-Access Pass", true);
    const learner = userName ? `${userName} (${userEmail})` : userEmail;
    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Invoice ${details.invoiceNumber} — NxGenVarsity × Prerana</title>
<style>
  body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#f4f7f5;color:#173d48;margin:0;padding:40px 20px}
  .sheet{max-width:680px;margin:0 auto;background:#fff;border:1px solid #d6e2dd;border-radius:16px;padding:36px;box-shadow:0 12px 32px rgba(23,61,72,.08)}
  .top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid #e6eeea;padding-bottom:20px;margin-bottom:24px}
  h1{margin:0;font-size:22px}
  .badge{display:inline-block;padding:6px 12px;border-radius:999px;background:#e1f3ee;color:#1f5f59;font-weight:700;font-size:12px}
  .meta{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:24px;font-size:14px}
  .meta strong{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#647b82;margin-bottom:4px}
  table{width:100%;border-collapse:collapse;margin-bottom:20px;font-size:14px}
  th,td{padding:12px 8px;border-bottom:1px solid #e6eeea;text-align:left}
  th:last-child,td:last-child{text-align:right}
  .total td{font-weight:800;font-size:17px;border-bottom:0;padding-top:16px}
  .foot{font-size:12px;color:#647b82;margin-top:24px}
</style>
</head>
<body>
  <div class="sheet">
    <div class="top">
      <div>
        <h1>NxGenVarsity × Prerana</h1>
        <p style="margin:6px 0 0;color:#647b82;font-size:13px">Unified Learning Platform — Payment Receipt</p>
      </div>
      <span class="badge">PAID</span>
    </div>
    <div class="meta">
      <div><strong>Invoice Number</strong>${details.invoiceNumber}</div>
      <div><strong>Date</strong>${details.paidAt}</div>
      <div><strong>Billed To</strong>${learner}</div>
      <div><strong>Payment Method</strong>${details.methodLabel}</div>
    </div>
    <table>
      <thead><tr><th>Description</th><th>Amount</th></tr></thead>
      <tbody>
        <tr><td>Unified All-Access Pass (Cybersecurity + Data Engineering &amp; MLOps)</td><td>${details.subtotal}</td></tr>
        <tr><td>Discount</td><td>${details.discount}</td></tr>
        <tr class="total"><td>Total Paid</td><td>${details.totalPaid}</td></tr>
      </tbody>
    </table>
    <p class="foot">Thank you for learning with NxGenVarsity × Prerana. You can print or save this receipt as PDF from your browser.</p>
  </div>
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${details.invoiceNumber}.html`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function applyCoupon(rawCode: string) {
    setCouponFeedback(null);
    const trimmed = rawCode.trim().toUpperCase();
    if (trimmed.length < 4) {
      setCouponFeedback({ kind: "error", text: "Enter a valid coupon code (at least 4 characters)." });
      return;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !anonKey) {
      setCouponFeedback({ kind: "error", text: "Supabase is not configured in this environment." });
      return;
    }

    setCouponLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.access_token) {
        setCouponFeedback({ kind: "error", text: "Your session expired. Sign in again to redeem a coupon." });
        return;
      }

      const targetSlugs = courses.filter((c) => !c.enrolled).map((c) => c.slug);
      const slugsToRedeem = targetSlugs.length ? targetSlugs : ["cybersecurity", "data-engineering-mlops"];

      let redeemedCount = 0;
      let lastErrorMessage = "This coupon cannot be used.";

      for (const slug of slugsToRedeem) {
        const response = await fetch(`${supabaseUrl}/functions/v1/redeem-coupon`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
            apikey: anonKey,
          },
          body: JSON.stringify({ courseSlug: slug, code: trimmed }),
        });

        if (response.ok) {
          redeemedCount += 1;
        } else {
          const payload = (await response.json().catch(() => ({}))) as { error?: string };
          if (payload.error) lastErrorMessage = payload.error;
        }
      }

      if (redeemedCount > 0) {
        await activateDemoSubscription();
        setCourses((prev) =>
          prev.map((course) => ({
            ...course,
            enrolled: true,
            enrollmentStatus: "active",
            enrollmentSource: "coupon",
          })),
        );
        setCouponCode(trimmed);
        setCouponFeedback({
          kind: "success",
          text: `${trimmed} applied! 100% discount activated — total updated from ₹2,500 to ₹0.`,
        });
        setInvoiceDetails(createInvoice(`Coupon (${trimmed})`, true));
        setShowSubscribedModal(true);
        router.refresh();
        return;
      }

      if (trimmed === DEMO_COUPON_CODE) {
        await activateDemoSubscription();
        setDemoUnlocked(true);
        setCouponCode(DEMO_COUPON_CODE);
        setCouponFeedback({
          kind: "success",
          text: "STUDENTOFFER applied (100% off)! Total changed from ₹2,500 to ₹0.",
        });
        setInvoiceDetails(createInvoice(`Coupon (${DEMO_COUPON_CODE})`, true));
        setShowSubscribedModal(true);
        router.refresh();
        return;
      }

      setCouponFeedback({ kind: "error", text: lastErrorMessage });
    } catch {
      if (trimmed === DEMO_COUPON_CODE) {
        await activateDemoSubscription();
        setDemoUnlocked(true);
        setCouponCode(DEMO_COUPON_CODE);
        setCouponFeedback({
          kind: "success",
          text: "STUDENTOFFER applied (100% off)! Total changed from ₹2,500 to ₹0.",
        });
        setInvoiceDetails(createInvoice(`Coupon (${DEMO_COUPON_CODE})`, true));
        setShowSubscribedModal(true);
        router.refresh();
        return;
      }
      setCouponFeedback({
        kind: "error",
        text: "Could not reach the coupon service. Check your connection and try again.",
      });
    } finally {
      setCouponLoading(false);
    }
  }

  function handleCouponSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void applyCoupon(couponCode);
  }

  function handleDemoCouponClick() {
    setShowCouponPopup(false);
    setCouponCode(DEMO_COUPON_CODE);
    void applyCoupon(DEMO_COUPON_CODE);
  }

  async function handleDemoPaymentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPaymentFeedback(null);

    const formData = new FormData(event.currentTarget);
    if (paymentMethod === "card") {
      const cardName = String(formData.get("cardName") ?? "").trim();
      const cardNumber = String(formData.get("cardNumber") ?? "").replace(/\D/g, "");
      const cardExpiry = String(formData.get("cardExpiry") ?? "").trim();
      const cardCvv = String(formData.get("cardCvv") ?? "").trim();

      if (cardName.length < 2) {
        setPaymentFeedback({ kind: "error", text: "Enter the cardholder name." });
        return;
      }
      if (cardNumber.length < 12 || cardNumber.length > 19) {
        setPaymentFeedback({ kind: "error", text: "Enter a valid 12–19 digit card number." });
        return;
      }
      if (!/^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/.test(cardExpiry)) {
        setPaymentFeedback({ kind: "error", text: "Enter expiry in MM / YY format." });
        return;
      }
      if (!/^\d{3,4}$/.test(cardCvv)) {
        setPaymentFeedback({ kind: "error", text: "Enter a valid 3 or 4 digit CVV." });
        return;
      }
    } else {
      const upiId = String(formData.get("upiId") ?? "").trim();
      if (!/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(upiId)) {
        setPaymentFeedback({ kind: "error", text: "Enter a valid UPI ID (e.g. student@okaxis)." });
        return;
      }
    }

    setPaymentLoading(true);
    try {
      await activateDemoSubscription();
      setDemoUnlocked(true);
      setPaymentFeedback({
        kind: "success",
        text: `Demo ${paymentMethod.toUpperCase()} payment confirmed! All courses are now unlocked.`,
      });
      setInvoiceDetails(createInvoice(`${paymentMethod.toUpperCase()} (Demo)`, false));
      setShowSubscribedModal(true);
      router.refresh();
    } catch {
      setPaymentFeedback({
        kind: "error",
        text: "Could not confirm demo subscription. Please try again.",
      });
    } finally {
      setPaymentLoading(false);
    }
  }

  return (
    <AuthShell>
      <section className="brand-panel checkout-summary-panel" aria-label="Order summary">
        <div className="brand-topline">
          <a className="checkout-back-link" href="/studio/">
            <span aria-hidden="true">←</span> Back
          </a>
        </div>

        <div className="checkout-summary-body">
          <div className="eyebrow-pill">
            <span aria-hidden="true">✦</span> ALL-ACCESS PASS <i /> ONE-TIME PAYMENT
          </div>
          <h1>
            Unified <span>All-Access</span> Pass
          </h1>
          <p className="brand-intro">
            Signed in as <strong>{userName ? `${userName} (${userEmail})` : userEmail}</strong>. One single ₹2,500 one-time payment unlocks every track, lab, and resource on the platform.
          </p>

          <div className="checkout-course-list">
            {courses.map((course) => {
              const unlocked = course.enrolled || demoUnlocked;
              return (
                <div key={course.id} className="checkout-course-item selected">
                  <div>
                    <strong>{course.title}</strong>
                    <span>{course.description || "Full modules, labs, and protected downloads."}</span>
                  </div>
                  <div className="checkout-course-meta">
                    <span className={`checkout-status-pill${unlocked ? " unlocked" : ""}`}>
                      {unlocked ? "Unlocked" : "Included"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="checkout-total-card">
            <div>
              <span>Total due today</span>
              <small>
                {isUnlocked
                  ? "100% off applied — full access unlocked"
                  : "₹2,500 one-time payment for all courses"}
              </small>
            </div>
            <div className="checkout-price-stack">
              {isUnlocked ? <s className="checkout-old-price">₹2,500</s> : null}
              <strong>{displayPrice}</strong>
            </div>
          </div>

          {isUnlocked ? (
            <div className="checkout-unlocked-actions">
              <a className="primary-submit checkout-studio-cta" href="/studio/">
                Open Learning Studio <span aria-hidden="true">→</span>
              </a>
              <button type="button" className="invoice-download-btn" onClick={handleDownloadInvoice}>
                Download Invoice ↓
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <section className="form-panel" aria-label="Payment and coupon redemption">
        <div className="auth-card checkout-card">
          <div className="card-glint" aria-hidden="true" />

          {isUnlocked ? (
            <div className="paid-status-panel">
              <div className="subscribed-confetti" aria-hidden="true">✓</div>
              <p className="welcome-line">SUBSCRIPTION ACTIVE</p>
              <h2>Payment Successful</h2>
              <p className="card-subtitle">
                Your unified all-access pass is active for both <strong>Cybersecurity</strong> and <strong>Data Engineering &amp; MLOps</strong>.
              </p>
              <div className="subscribed-actions" style={{ marginTop: "22px" }}>
                <button type="button" className="primary-submit" onClick={handleDownloadInvoice}>
                  Download Invoice ↓
                </button>
                <a className="invoice-download-btn" style={{ textDecoration: "none" }} href="/studio/">
                  Open Learning Studio <span aria-hidden="true">→</span>
                </a>
                <a className="subscribed-secondary-link" href="/studio/">
                  Back to Main Page
                </a>
              </div>
            </div>
          ) : (
            <>
              <div className="card-heading">
                <p className="welcome-line">SINGLE CHECKOUT GATEWAY</p>
                <h2>Redeem coupon or pay</h2>
                <p className="card-subtitle">
                  One-time fee of ₹2,500 for everything, or ₹0 with a student coupon.
                </p>
              </div>

          <form className="coupon-box" onSubmit={handleCouponSubmit} noValidate>
            <label className="field-label" htmlFor="coupon-code-input">
              Use Coupon Code
            </label>
            <div className="coupon-input-anchor">
              <div className="coupon-input-row">
                <div className="input-wrap coupon-input-wrap">
                  <input
                    id="coupon-code-input"
                    name="couponCode"
                    type="text"
                    value={couponCode}
                    onFocus={() => {
                      if (!isUnlocked) setShowCouponPopup(true);
                    }}
                    onClick={() => {
                      if (!isUnlocked) setShowCouponPopup(true);
                    }}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Use Coupon Code"
                    autoComplete="off"
                    disabled={couponLoading || isUnlocked}
                  />
                </div>
                <button
                  type="submit"
                  className="coupon-apply-btn"
                  disabled={couponLoading || isUnlocked}
                >
                  {couponLoading ? "Applying..." : isUnlocked ? "Applied" : "Apply"}
                </button>
              </div>
              {showCouponPopup && !isUnlocked ? (
                <div className="coupon-popup" role="dialog" aria-label="Available demo coupon">
                  <div className="coupon-popup-header">
                    <span>Available coupon</span>
                    <button
                      type="button"
                      className="coupon-popup-close"
                      aria-label="Close coupon popup"
                      onClick={() => setShowCouponPopup(false)}
                    >
                      ×
                    </button>
                  </div>
                  <button
                    type="button"
                    className="coupon-popup-item"
                    onClick={handleDemoCouponClick}
                  >
                    <strong>{DEMO_COUPON_CODE}</strong>
                    <span>Click to apply</span>
                  </button>
                </div>
              ) : null}
            </div>
            {couponFeedback ? (
              <div className={`form-feedback ${couponFeedback.kind}`} role="status">
                <span>{couponFeedback.text}</span>
              </div>
            ) : null}
          </form>

          <div className="divider">
            <span />
            <span>or pay {displayPrice} one-time</span>
            <span />
          </div>

          <div className="auth-tabs checkout-pay-tabs" role="tablist" aria-label="Payment method">
            <button
              type="button"
              role="tab"
              aria-selected={paymentMethod === "card"}
              className={paymentMethod === "card" ? "active" : ""}
              onClick={() => {
                setPaymentMethod("card");
                setPaymentFeedback(null);
              }}
            >
              Card
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={paymentMethod === "upi"}
              className={paymentMethod === "upi" ? "active" : ""}
              onClick={() => {
                setPaymentMethod("upi");
                setPaymentFeedback(null);
              }}
            >
              UPI
            </button>
          </div>

          <form className="auth-form" onSubmit={handleDemoPaymentSubmit} noValidate>
            {paymentMethod === "card" ? (
              <>
                <label className="field-label">
                  Cardholder name
                  <div className="input-wrap">
                    <input name="cardName" type="text" placeholder="Aarav Sharma" autoComplete="cc-name" />
                  </div>
                </label>
                <label className="field-label">
                  Card number
                  <div className="input-wrap">
                    <input name="cardNumber" type="text" inputMode="numeric" placeholder="4242 4242 4242 4242" autoComplete="cc-number" />
                  </div>
                </label>
                <div className="checkout-card-row">
                  <label className="field-label">
                    Expiry
                    <div className="input-wrap">
                      <input name="cardExpiry" type="text" placeholder="MM / YY" autoComplete="cc-exp" />
                    </div>
                  </label>
                  <label className="field-label">
                    CVV
                    <div className="input-wrap">
                      <input name="cardCvv" type="password" inputMode="numeric" maxLength={4} placeholder="•••" autoComplete="cc-csc" />
                    </div>
                  </label>
                </div>
              </>
            ) : (
              <div className="upi-panel">
                <label className="field-label">
                  UPI ID
                  <div className="input-wrap">
                    <input name="upiId" type="text" placeholder="student@okaxis" />
                  </div>
                </label>
                <div className="upi-qr-preview">
                  <div className="upi-qr-box" aria-hidden="true">QR</div>
                  <div>
                    <strong>Instant UPI (GPay / PhonePe / Paytm)</strong>
                    <span>Preview mode — live UPI intent activates once the payment provider is connected.</span>
                  </div>
                </div>
              </div>
            )}

            {paymentFeedback ? (
              <div className={`form-feedback ${paymentFeedback.kind}`} role="status">
                <span>{paymentFeedback.text}</span>
              </div>
            ) : null}

            <button
              type="submit"
              className="primary-submit"
              disabled={isUnlocked || paymentLoading}
            >
              {isUnlocked
                ? "All-Access Unlocked"
                : paymentLoading
                  ? "Confirming payment..."
                  : "Pay ₹2,500 One-time (Demo)"}
            </button>
          </form>
            </>
          )}
        </div>
      </section>

      {showSubscribedModal ? (
        <div className="subscribed-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="subscribed-modal-title">
          <div className="subscribed-modal">
            <div className="subscribed-confetti" aria-hidden="true">🎉</div>
            <p className="subscribed-kicker">ALL-ACCESS UNLOCKED</p>
            <h2 id="subscribed-modal-title">You&apos;re now subscribed!</h2>
            <p className="subscribed-copy">
              Your unified pass is active. You now have full access to both <strong>Cybersecurity</strong> and <strong>Data Engineering &amp; MLOps</strong>.
            </p>
            <div className="subscribed-actions">
              <a className="primary-submit subscribed-primary-link" href="/studio/">
                Start Learning in Studio <span aria-hidden="true">→</span>
              </a>
              <button type="button" className="invoice-download-btn" onClick={handleDownloadInvoice}>
                Download Invoice ↓
              </button>
              <a className="subscribed-secondary-link" href="/studio/">
                Back to Main Page
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </AuthShell>
  );
}
