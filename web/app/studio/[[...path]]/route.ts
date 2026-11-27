import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character] ?? character);
}

const contentTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { path = [] } = await params;
  const isEntry = path.length === 0 || (path.length === 1 && path[0] === "index.html");

  if (!user) {
    if (!isEntry) return new NextResponse("Sign in required", { status: 401 });
    const login = new URL("/login", request.url);
    login.searchParams.set("next", "/studio/");
    return NextResponse.redirect(login);
  }

  const demoSubscribedIds = (request.cookies.get("nxv-subscribed-uid")?.value ?? "")
    .split(",")
    .map((id) => id.trim());
  const hasDemoCookie = demoSubscribedIds.includes(user.id);
  let hasActiveEnrollment = hasDemoCookie;
  if (!hasActiveEnrollment) {
    const { data: activeRows } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .limit(1);
    hasActiveEnrollment = Boolean(activeRows && activeRows.length > 0);
  }

  const relativePath = path.length ? path.join("/") : "index.html";
  const root = resolve(process.cwd(), "app", "dist");
  const file = resolve(root, relativePath);
  if (file !== root && !file.startsWith(`${root}${sep}`)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const fileContents = await readFile(file);
    let body: BodyInit = new Uint8Array(fileContents);
    if (extname(file).toLowerCase() === ".html") {
      const displayName = String(user.user_metadata.full_name || user.email?.split("@")[0] || "Learner").trim();
      const initial = Array.from(displayName)[0]?.toLocaleUpperCase() || "L";
      const safeName = escapeHtml(displayName);
      const safeInitial = escapeHtml(initial);

      const topRightActions = `
        <div class="nxv-account-menu">
          <button type="button" class="nxv-avatar-trigger" aria-label="Account menu for ${safeName}" aria-haspopup="true">
            <span>${safeInitial}</span>
          </button>
          <div class="nxv-account-dropdown" role="menu">
            <a class="nxv-dropdown-profile" href="/dashboard" role="menuitem">
              <span class="nxv-dropdown-avatar" aria-hidden="true">${safeInitial}</span>
              <span class="nxv-dropdown-identity">
                <strong>${safeName}</strong>
                <small>Account settings</small>
              </span>
            </a>
            <div class="nxv-dropdown-items">
              <a class="nxv-dropdown-item nxv-dropdown-sub" href="/checkout" role="menuitem">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 12 10 5 10-5"/><path d="m2 17 10 5 10-5"/></svg>
                <span>Subscription</span>
              </a>
              <form action="/auth/signout" method="post" class="nxv-signout-form">
                <button type="submit" class="nxv-dropdown-item nxv-dropdown-signout" role="menuitem">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  <span>Sign out</span>
                </button>
              </form>
            </div>
          </div>
        </div>`;

      const courseGateScript = hasActiveEnrollment
        ? ""
        : `<div id="nxv-paywall" class="nxv-paywall" hidden role="dialog" aria-modal="true" aria-labelledby="nxv-paywall-title">
            <div class="nxv-paywall-card">
              <p class="nxv-paywall-kicker">SUBSCRIPTION REQUIRED</p>
              <h2 id="nxv-paywall-title">Unlock all courses to continue</h2>
              <p>Subscribe to unlock Cybersecurity and Data Engineering &amp; MLOps lessons, labs, and resources.</p>
              <div class="nxv-paywall-actions">
                <a class="nxv-paywall-btn" href="/checkout">Subscribe →</a>
                <button type="button" class="nxv-paywall-close" id="nxv-paywall-close">Continue browsing overview</button>
              </div>
            </div>
          </div>
          <script>
            (function () {
              var unlockedRoutes = { "": 1, home: 1, curriculum: 1, roadmap: 1, syllabus: 1, coverage: 1, sources: 1 };
              var modal = document.getElementById("nxv-paywall");
              var closeBtn = document.getElementById("nxv-paywall-close");
              function isLockedHash(hashValue) {
                var clean = (hashValue || "").replace(/^#/, "").split("/")[0];
                return !unlockedRoutes[clean];
              }
              function showPaywall() {
                if (modal) modal.hidden = false;
              }
              if (closeBtn && modal) {
                closeBtn.addEventListener("click", function () { modal.hidden = true; });
              }
              document.addEventListener("click", function (event) {
                var link = event.target && event.target.closest ? event.target.closest("a[href^='#']") : null;
                if (!link) return;
                var href = link.getAttribute("href");
                if (isLockedHash(href)) {
                  event.preventDefault();
                  event.stopPropagation();
                  showPaywall();
                }
              }, true);
              window.addEventListener("hashchange", function () {
                if (isLockedHash(location.hash)) {
                  history.replaceState(null, "", "#home");
                  window.dispatchEvent(new Event("hashchange"));
                  showPaywall();
                }
              });
              if (isLockedHash(location.hash)) {
                history.replaceState(null, "", "#home");
                showPaywall();
              }
            })();
          </script>`;
      body = fileContents.toString("utf8").replace(
        "<head>",
        `<head><base href="/studio/"><style>
          .profile,.site-footer a[href="#login"],.session-account{display:none!important}
          .nxv-account-menu{position:fixed;z-index:10000;top:16px;right:24px;font-family:Manrope,Arial,sans-serif}
          .nxv-avatar-trigger{width:42px;height:42px;display:grid;place-items:center;padding:0;border:2px solid #ffffff;border-radius:50%;background:linear-gradient(145deg,#1d6b5e,#155248);color:#ffffff;font:700 15px Manrope,Arial,sans-serif;box-shadow:0 4px 14px rgba(21,82,72,.22);cursor:pointer;transition:transform .16s ease,box-shadow .16s ease}
          .nxv-account-menu:hover .nxv-avatar-trigger,.nxv-account-menu:focus-within .nxv-avatar-trigger{transform:scale(1.03);box-shadow:0 6px 18px rgba(21,82,72,.28)}
          .nxv-account-dropdown{position:absolute;top:calc(100% + 8px);right:0;width:236px;padding:12px;border:1px solid rgba(255,255,255,.85);border-radius:20px;background:rgba(246,250,248,.92);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);box-shadow:0 18px 44px rgba(18,45,42,.16),inset 0 1px 0 rgba(255,255,255,.9);opacity:0;visibility:hidden;transform:translateY(-6px) scale(.98);transform-origin:top right;transition:opacity .18s ease,transform .18s ease,visibility .18s}
          .nxv-account-menu:hover .nxv-account-dropdown,.nxv-account-menu:focus-within .nxv-account-dropdown{opacity:1;visibility:visible;transform:translateY(0) scale(1)}
          .nxv-account-dropdown::before{content:"";position:absolute;top:-12px;left:0;right:0;height:12px}
          .nxv-dropdown-profile{display:flex;align-items:center;gap:11px;padding:4px 4px 11px;text-decoration:none;color:#173d48}
          .nxv-dropdown-avatar{width:38px;height:38px;flex:0 0 38px;display:grid;place-items:center;border-radius:50%;background:linear-gradient(145deg,#1d6b5e,#155248);color:#fff;font:700 14px Manrope,Arial,sans-serif}
          .nxv-dropdown-identity{min-width:0;display:flex;flex-direction:column}
          .nxv-dropdown-identity strong{font:700 14px/1.25 Manrope,Arial,sans-serif;color:#152e35;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
          .nxv-dropdown-identity small{font:500 12px/1.25 Manrope,Arial,sans-serif;color:#62787d}
          .nxv-dropdown-items{display:flex;flex-direction:column;gap:6px;padding-top:6px;border-top:1px solid rgba(23,61,72,.08)}
          .nxv-signout-form{margin:0}
          .nxv-dropdown-item{width:100%;display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid rgba(255,255,255,.75);border-radius:12px;background:rgba(255,255,255,.72);color:#173d48;text-decoration:none;font:600 13px Manrope,Arial,sans-serif;cursor:pointer;text-align:left;transition:background .15s ease,border-color .15s ease}
          .nxv-dropdown-sub:hover,.nxv-dropdown-sub:focus-visible{background:rgba(209,237,225,.82);border-color:rgba(55,126,120,.28)}
          .nxv-dropdown-signout:hover,.nxv-dropdown-signout:focus-visible{background:rgba(255,255,255,.98);border-color:rgba(23,61,72,.16)}
          .nxv-paywall[hidden]{display:none}
          .nxv-paywall{position:fixed;inset:0;z-index:20000;display:grid;place-items:center;padding:20px;background:rgba(15,31,38,.52);backdrop-filter:blur(6px)}
          .nxv-paywall-card{width:100%;max-width:440px;padding:30px 26px;border-radius:22px;background:#fff;color:#173d48;box-shadow:0 24px 60px rgba(0,0,0,.25);text-align:center;font-family:Manrope,Arial,sans-serif}
          .nxv-paywall-kicker{margin:0 0 8px;color:#377e78;font-size:11px;font-weight:800;letter-spacing:.12em}
          .nxv-paywall-card h2{margin:0 0 10px;font-size:24px;line-height:1.2}
          .nxv-paywall-card p{margin:0 0 20px;color:#526870;font-size:14px;line-height:1.5}
          .nxv-paywall-actions{display:flex;flex-direction:column;gap:10px}
          .nxv-paywall-btn{display:inline-flex;align-items:center;justify-content:center;padding:13px 18px;border-radius:999px;background:#377e78;color:#fff;font-weight:700;font-size:14px;text-decoration:none}
          .nxv-paywall-close{border:0;background:transparent;color:#526870;font:600 13px Manrope,Arial,sans-serif;cursor:pointer;padding:6px}
          @media(max-width:600px){.nxv-account-menu{top:12px;right:14px}}
        </style>`,
      ).replace(
        "</head>",
        `<script defer src="/studio/learner-account.js?v=2"></script></head>`,
      ).replace(
        "</body>",
        `${topRightActions}${courseGateScript}</body>`,
      );
    }
    return new NextResponse(body, {
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Type": contentTypes[extname(file).toLowerCase()] ?? "application/octet-stream",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
