"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createSupabaseBrowserClient, setRememberPreference } from "../../lib/supabase/browser";
import LearningIllustration from "./learning-illustration";
import "./login.css";

type AuthMode = "login" | "signup";
type Feedback = { kind: "error" | "success" | "info"; text: string } | null;
type OAuthProvider = "google" | "github" | "apple" | "linkedin_oidc";

const providers: { id: OAuthProvider; label: string; mark: ReactNode }[] = [
  { id: "google", label: "Google", mark: <GoogleMark /> },
  { id: "github", label: "GitHub", mark: <GitHubMark /> },
  { id: "apple", label: "Apple", mark: <AppleMark /> },
  { id: "linkedin_oidc", label: "LinkedIn", mark: <LinkedInMark /> },
];

const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const configuredProviders = new Set<OAuthProvider>(
  (process.env.NEXT_PUBLIC_SUPABASE_AUTH_PROVIDERS ?? "")
    .split(",")
    .map((provider) => provider.trim())
    .filter((provider): provider is OAuthProvider => providers.some((item) => item.id === provider)),
);

function safeNextPath(value: string | null) {
  if (!value) return "/studio/";
  try {
    const candidate = new URL(value, window.location.origin);
    return candidate.origin === window.location.origin ? `${candidate.pathname}${candidate.search}${candidate.hash}` : "/studio/";
  } catch {
    return "/studio/";
  }
}

export default function AuthExperience() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [nextPath, setNextPath] = useState("/studio/");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const query = new URLSearchParams(window.location.search);
      setNextPath(safeNextPath(query.get("next")));
      if (query.get("auth") === "error") {
        setFeedback({ kind: "error", text: "We couldn’t complete sign-in. Please try again." });
      } else if (query.get("confirmed") === "1") {
        setFeedback({ kind: "success", text: "Your email is confirmed. You can sign in now." });
      }
      setRememberMe(document.cookie.split("; ").some((cookie) => cookie.trim() === "nxv-remember=1"));
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    if (!configured) {
      setFeedback({ kind: "error", text: "Authentication is not connected yet. Add the Supabase URL and public key to the app environment." });
      return;
    }

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");
    const fullName = String(form.get("fullName") ?? "").trim();

    if (forgotPassword) {
      setLoading(true);
      try {
        const supabase = createSupabaseBrowserClient({ rememberMe });
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/reset-password")}`,
        });
        if (error) throw error;
        setFeedback({ kind: "success", text: "If an account exists for that address, a password reset link is on its way." });
      } catch {
        setFeedback({ kind: "error", text: "We couldn’t send the reset link. Check the email address and try again." });
      } finally {
        setLoading(false);
      }
      return;
    }

    if (mode === "signup") {
      const confirmPassword = String(form.get("confirmPassword") ?? "");
      if (fullName.length < 2) {
        setFeedback({ kind: "error", text: "Enter your full name to create an account." });
        return;
      }
      if (password.length < 8) {
        setFeedback({ kind: "error", text: "Choose a password with at least 8 characters." });
        return;
      }
      if (password !== confirmPassword) {
        setFeedback({ kind: "error", text: "Those passwords don’t match yet." });
        return;
      }
      if (!form.get("acceptTerms")) {
        setFeedback({ kind: "error", text: "Please accept the terms to create your account." });
        return;
      }
    }

    setRememberPreference(rememberMe);
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient({ rememberMe });
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/studio/?welcome=1")}`,
          },
        });
        if (error) throw error;
        if (data.session) {
          router.replace(nextPath);
          router.refresh();
        } else {
          setFeedback({ kind: "success", text: "Account created. Check your email to confirm your address, then sign in." });
          setMode("login");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace(nextPath);
        router.refresh();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again in a moment.";
      setFeedback({ kind: "error", text: friendlyAuthError(message) });
    } finally {
      setLoading(false);
    }
  }

  async function signInWith(provider: OAuthProvider) {
    if (!configured) {
      setFeedback({ kind: "error", text: "Connect Supabase before enabling social sign-in." });
      return;
    }
    if (!configuredProviders.has(provider)) {
      const label = providers.find((item) => item.id === provider)?.label ?? provider;
      setFeedback({ kind: "info", text: `${label} sign-in is not configured for this project. Use email and password or configure this provider in Supabase Auth.` });
      return;
    }
    setFeedback(null);
    setRememberPreference(rememberMe);
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient({ rememberMe });
      const callback = new URL("/auth/callback", window.location.origin);
      callback.searchParams.set("next", nextPath);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: callback.toString() },
      });
      if (error) throw error;
    } catch (error) {
      const raw = error instanceof Error ? error.message : "";
      setFeedback({ kind: "error", text: friendlyAuthError(raw, "This sign-in provider isn’t enabled for this Supabase project yet.") });
      setLoading(false);
    }
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setForgotPassword(false);
    setShowPassword(false);
    setFeedback(null);
  }

  return (
    <main className="auth-shell">
      <div className="auth-ambient auth-ambient-one" aria-hidden="true" />
      <div className="auth-ambient auth-ambient-two" aria-hidden="true" />
      <div className="auth-grid-glow" aria-hidden="true" />

      <section className="brand-panel" aria-label="NxGenVarsity and Prerana">
        <div className="brand-topline">
          <a className="brand-lockup" href="/" aria-label="NxGenVarsity and Prerana home">
            <Image src="/brand/nxgenvarsity-logo.png" alt="NxGenVarsity" className="nxgen-logo" width={176} height={61} priority />
            <span className="brand-divider" aria-hidden="true">×</span>
            <span className="prerana-lockup">
              <LotusMark />
              <span>PRERANA</span>
            </span>
          </a>
        </div>

        <div className="brand-copy">
          <div className="eyebrow-pill"><span aria-hidden="true">✦</span> LEARN <i /> PRACTICE <i /> GROW</div>
          <h1>Together towards a <span>Smarter</span> Tomorrow</h1>
          <p className="brand-intro">NXGENVARSITY × PRERANA brings you a platform to learn, explore and excel in the world of technology.</p>

          <div className="feature-row" aria-label="Platform features">
            <Feature icon={<BookIcon />} title="Curated" secondLine="Learning" />
            <Feature icon={<CodeIcon />} title="Hands-on" secondLine="Practice" />
            <Feature icon={<TrophyIcon />} title="Exciting" secondLine="Contests" />
            <Feature icon={<CommunityIcon />} title="A Thriving" secondLine="Community" />
          </div>
        </div>

        <LearningIllustration />
        <div className="brand-footer"><span className="footer-spark" /> Built for curious minds, shaped for what’s next.</div>
      </section>

      <section className="form-panel" aria-label="Account access">
        <div className="mobile-brand" aria-hidden="true">
          <Image src="/brand/nxgenvarsity-logo.png" alt="" width={135} height={43} priority />
          <span>×</span>
          <strong>PRERANA</strong>
        </div>
        <div className="auth-card">
          <div className="card-glint" aria-hidden="true" />
          <div className="card-heading">
            <p className="welcome-line"><span aria-hidden="true">✦</span> {forgotPassword ? "Account recovery" : mode === "login" ? "Welcome back!" : "Your next chapter starts here"}</p>
            <h2>{forgotPassword ? "Reset your password" : mode === "login" ? "Log in to continue" : "Create your account"}</h2>
            <p className="card-subtitle">{forgotPassword ? "We’ll email you a secure link to get back in." : mode === "login" ? "Your learning journey is right where you left it." : "Join a community learning toward a smarter tomorrow."}</p>
          </div>

          {!forgotPassword && (
            <div className="auth-tabs" role="tablist" aria-label="Choose an account action">
              <button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? "active" : ""} onClick={() => switchMode("login")}>Log in</button>
              <button type="button" role="tab" aria-selected={mode === "signup"} className={mode === "signup" ? "active" : ""} onClick={() => switchMode("signup")}>Sign up</button>
            </div>
          )}

          {!configured && <div className="setup-note" role="status"><span className="setup-note-dot" /> Supabase Auth will be ready when this app is connected to its project.</div>}

          <form className="auth-form" onSubmit={onSubmit} noValidate>
            {mode === "signup" && !forgotPassword && (
              <label className="field-label" htmlFor="fullName">
                <span>Full name</span>
                <span className="input-wrap"><PersonIcon /><input id="fullName" name="fullName" type="text" autoComplete="name" placeholder="Your name" required minLength={2} disabled={loading} /></span>
              </label>
            )}

            <label className="field-label" htmlFor="email">
              <span>Email address</span>
              <span className="input-wrap"><MailIcon /><input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required disabled={loading} /></span>
            </label>

            {!forgotPassword && (
              <label className="field-label" htmlFor="password">
                <span>Password</span>
                <span className="input-wrap">
                  <LockIcon />
                  <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="At least 8 characters" required minLength={8} disabled={loading} />
                  <button className="reveal-button" type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword((value) => !value)}><EyeIcon hidden={!showPassword} /></button>
                </span>
              </label>
            )}

            {mode === "signup" && !forgotPassword && (
              <label className="field-label" htmlFor="confirmPassword">
                <span>Confirm password</span>
                <span className="input-wrap"><LockIcon /><input id="confirmPassword" name="confirmPassword" type={showConfirm ? "text" : "password"} autoComplete="new-password" placeholder="Enter your password again" required minLength={8} disabled={loading} /><button className="reveal-button" type="button" aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"} aria-pressed={showConfirm} onClick={() => setShowConfirm((value) => !value)}><EyeIcon hidden={!showConfirm} /></button></span>
              </label>
            )}

            {mode === "login" && !forgotPassword && (
              <div className="form-options">
                <label className="check-label"><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} /><span className="custom-check" /> Remember me</label>
                <button type="button" className="text-action" onClick={() => { setForgotPassword(true); setFeedback(null); }}>Forgot password?</button>
              </div>
            )}

            {mode === "signup" && !forgotPassword && (
              <label className="check-label terms-check"><input type="checkbox" name="acceptTerms" required /><span className="custom-check" /><span>I agree to the <button type="button" className="inline-policy" onClick={() => setFeedback({ kind: "info", text: "Terms of Service are being prepared for publication." })}>Terms of Service</button> and <button type="button" className="inline-policy" onClick={() => setFeedback({ kind: "info", text: "The Privacy Policy is being prepared for publication." })}>Privacy Policy</button>.</span></label>
            )}

            {feedback && <div className={`form-feedback ${feedback.kind}`} role={feedback.kind === "error" ? "alert" : "status"} aria-live="polite">{feedback.kind === "success" && <CheckIcon />}{feedback.text}</div>}

            <button className="primary-submit" type="submit" disabled={loading || !configured}>
              {loading ? <><span className="spinner" /> Working securely…</> : forgotPassword ? <>Send reset link <ArrowIcon /></> : mode === "login" ? <>Log in <ArrowIcon /></> : <>Create account <ArrowIcon /></>}
            </button>
          </form>

          {forgotPassword ? (
            <button className="back-to-login" type="button" onClick={() => { setForgotPassword(false); setFeedback(null); }}>← Back to log in</button>
          ) : (
            <>
              <div className="divider"><span /> <span>or continue with</span> <span /></div>
              <div className="social-row" aria-label="Continue with a social account">
                {providers.map((provider) => (
                  <button key={provider.id} type="button" className="social-button" aria-label={configuredProviders.has(provider.id) ? `Continue with ${provider.label}` : `${provider.label} sign-in is not configured`} title={configuredProviders.has(provider.id) ? `Continue with ${provider.label}` : `Configure ${provider.label} OAuth in Supabase to enable`} disabled={loading || !configured || !configuredProviders.has(provider.id)} onClick={() => signInWith(provider.id)}>
                    {provider.mark}<span className="social-tooltip">{provider.label}</span>
                  </button>
                ))}
              </div>
              <p className="social-setup-hint">{configuredProviders.size ? `Configured social sign-in: ${providers.filter((provider) => configuredProviders.has(provider.id)).map((provider) => provider.label).join(", ")}.` : "Social sign-in is not configured for this project. Use email and password, or configure an OAuth provider in Supabase Auth."}</p>
            </>
          )}

          <div className="auth-card-footer">
            {!forgotPassword && (mode === "login" ? <>Don’t have an account? <button type="button" onClick={() => switchMode("signup")}>Sign up <ArrowTiny /></button></> : <>Already have an account? <button type="button" onClick={() => switchMode("login")}>Log in <ArrowTiny /></button></>)}
            <span className="footer-divider" />
            <span className="secure-note"><ShieldIcon /> Secure sign-in</span>
          </div>
        </div>
        <p className="form-panel-footnote">By continuing, you agree to learn with curiosity and respect.</p>
      </section>
    </main>
  );
}

function friendlyAuthError(message: string, fallback?: string) {
  const value = message.toLowerCase();
  if (value.includes("invalid login credentials")) return "That email and password combination didn’t match. Try again or reset your password.";
  if (value.includes("email not confirmed")) return "Please confirm your email using the link we sent before signing in.";
  if (value.includes("already registered") || value.includes("already been registered")) return "An account may already use this email. Try logging in instead.";
  if (value.includes("user already registered")) return "An account may already use this email. Try logging in instead.";
  if (value.includes("provider is not enabled") || value.includes("unsupported provider")) return fallback ?? "This sign-in provider isn’t enabled for this Supabase project yet.";
  if (value.includes("network") || value.includes("fetch")) return "We couldn’t reach the sign-in service. Check your connection and try again.";
  return fallback ?? "We couldn’t complete that request. Check your details and try again.";
}

function Feature({ icon, title, secondLine }: { icon: ReactNode; title: string; secondLine: string }) {
  return <div className="feature-item"><span className="feature-icon">{icon}</span><span>{title}<br />{secondLine}</span></div>;
}

function IconBase({ children, size = 20 }: { children: ReactNode; size?: number }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
}
function MailIcon() { return <IconBase><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></IconBase>; }
function LockIcon() { return <IconBase><rect x="4" y="10" width="16" height="11" rx="2.5" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /><path d="M12 14v3" /></IconBase>; }
function PersonIcon() { return <IconBase><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></IconBase>; }
function EyeIcon({ hidden }: { hidden: boolean }) { return <IconBase size={19}>{hidden ? <><path d="M3 3l18 18" /><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5.2 0 8.8 4.9 9.7 6.3a1.2 1.2 0 0 1 0 1.4 17.8 17.8 0 0 1-3 3.4" /><path d="M6.2 6.2a18.7 18.7 0 0 0-3.9 5.1 1.2 1.2 0 0 0 0 1.4A11.6 11.6 0 0 0 12 18a10.7 10.7 0 0 0 3-.4" /></> : <><path d="M2.5 12s3.4-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.4 6.5-9.5 6.5S2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.7" /></>}</IconBase>; }
function ArrowIcon() { return <IconBase size={19}><path d="M5 12h14M13 5l7 7-7 7" /></IconBase>; }
function ArrowTiny() { return <IconBase size={15}><path d="M4 12h15M13 6l6 6-6 6" /></IconBase>; }
function CheckIcon() { return <IconBase size={17}><path d="m5 12 4 4L19 6" /></IconBase>; }
function ShieldIcon() { return <IconBase size={15}><path d="M12 3 20 6v5c0 5-3.4 8.3-8 10-4.6-1.7-8-5-8-10V6l8-3Z" /><path d="m9 12 2 2 4-4" /></IconBase>; }
function BookIcon() { return <IconBase size={25}><path d="M3.5 5.5c3.2-.9 5.9-.4 8.5 1.4v13c-2.6-1.8-5.3-2.3-8.5-1.4v-13Z" /><path d="M20.5 5.5c-3.2-.9-5.9-.4-8.5 1.4v13c2.6-1.8 5.3-2.3 8.5-1.4v-13Z" /></IconBase>; }
function CodeIcon() { return <IconBase size={25}><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" /></IconBase>; }
function TrophyIcon() { return <IconBase size={25}><path d="M8 4h8v4.5a4 4 0 0 1-8 0V4Z" /><path d="M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4M12 12.5V18M8.5 21h7M9 18h6" /></IconBase>; }
function CommunityIcon() { return <IconBase size={25}><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.3" /><path d="M3 19a6 6 0 0 1 12 0M15 14a5 5 0 0 1 6 5" /></IconBase>; }
function LotusMark() { return <svg className="lotus-mark" aria-hidden="true" viewBox="0 0 40 35"><path d="M20 27C11 22 9 14 14 7c4 3 6 7 6 12 0-7 3-12 8-15 4 7 1 16-8 23Z" /><path d="M7 18c4 0 8 3 13 9-7 1-12-2-15-7M33 18c-4 0-8 3-13 9 7 1 12-2 15-7" /><path d="M8 29h24" /></svg>; }
function GoogleMark() { return <svg aria-hidden="true" viewBox="0 0 24 24" width="23" height="23"><path fill="#4285F4" d="M21.6 12.23c0-.72-.06-1.42-.18-2.1H12v3.97h5.38a4.6 4.6 0 0 1-2 3.01v2.5h3.24c1.9-1.76 2.98-4.35 2.98-7.38Z" /><path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.4l-3.24-2.5c-.9.6-2.03.96-3.38.96-2.6 0-4.8-1.75-5.58-4.1H3.07v2.58A10 10 0 0 0 12 22Z" /><path fill="#FBBC05" d="M6.42 13.96A6.02 6.02 0 0 1 6.1 12c0-.68.12-1.34.32-1.96V7.46H3.07A10 10 0 0 0 2 12c0 1.62.39 3.15 1.07 4.54l3.35-2.58Z" /><path fill="#EA4335" d="M12 5.94c1.47 0 2.78.5 3.82 1.51l2.87-2.87C16.96 2.98 14.7 2 12 2a10 10 0 0 0-8.93 5.46l3.35 2.58c.78-2.35 2.98-4.1 5.58-4.1Z" /></svg>; }
function GitHubMark() { return <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.08c-3.1.68-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15.99 1.69 2.59 1.2 3.22.92.1-.72.39-1.2.7-1.48-2.47-.28-5.06-1.24-5.06-5.51 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.12-1.44 3.05-1.14 3.05-1.14.61 1.54.23 2.68.12 2.96.71.78 1.14 1.78 1.14 3 0 4.28-2.6 5.22-5.08 5.5.4.35.75 1.03.75 2.08v3.1c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" /></svg>; }
function AppleMark() { return <svg aria-hidden="true" viewBox="0 0 24 24" width="23" height="23" fill="currentColor"><path d="M16.7 12.8c0-2.1 1.7-3.1 1.8-3.2a4 4 0 0 0-3.2-1.7c-1.35-.14-2.65.8-3.33.8-.7 0-1.74-.78-2.85-.75a4.2 4.2 0 0 0-3.54 2.16c-1.52 2.63-.39 6.5 1.08 8.63.72 1.04 1.57 2.2 2.69 2.16 1.08-.04 1.49-.7 2.8-.7 1.3 0 1.68.7 2.82.68 1.17-.02 1.9-1.05 2.62-2.1a9.2 9.2 0 0 0 1.2-2.43 3.75 3.75 0 0 1-2.1-3.56ZM14.5 6.45a3.8 3.8 0 0 0 .87-2.72 3.9 3.9 0 0 0-2.52 1.3 3.65 3.65 0 0 0-.9 2.63 3.2 3.2 0 0 0 2.55-1.21Z" /></svg>; }
function LinkedInMark() { return <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22"><rect width="21" height="21" x="1.5" y="1.5" rx="4" fill="#0A66C2" /><path fill="white" d="M7.2 9.2h2.2v7.1H7.2V9.2Zm1.1-3.4a1.28 1.28 0 1 1 0 2.56 1.28 1.28 0 0 1 0-2.56Zm2.45 3.4h2.1v.97h.03a2.3 2.3 0 0 1 2.07-1.14c2.2 0 2.6 1.44 2.6 3.3v3.97h-2.2v-3.52c0-.84-.02-1.91-1.16-1.91-1.17 0-1.35.91-1.35 1.85v3.58h-2.2V9.2Z" /></svg>; }
