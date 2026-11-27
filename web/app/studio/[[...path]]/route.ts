import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

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

  const hasDemoCookie = request.cookies.get("nxv-subscribed-uid")?.value === user.id;
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
      const topRightActions = hasActiveEnrollment
        ? `<div class="session-actions"><a class="session-account" href="/dashboard">Account</a><form action="/auth/signout" method="post" class="session-signout-form"><button type="submit" class="session-account session-signout">Sign out</button></form></div>`
        : `<div class="session-actions"><a class="session-checkout" href="/checkout">Subscribe</a><a class="session-account" href="/dashboard">Account</a><form action="/auth/signout" method="post" class="session-signout-form"><button type="submit" class="session-account session-signout">Sign out</button></form></div>`;

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
          .profile,.site-footer a[href="#login"]{display:none!important}
          .session-actions{position:fixed;z-index:10000;top:16px;right:20px;display:flex;align-items:center;gap:8px}
          .session-signout-form{margin:0}
          .session-account,.session-checkout{padding:9px 13px;border:1px solid #d6e2dd;border-radius:999px;background:#fff;color:#173d48;text-decoration:none;font:600 12px Manrope,Arial,sans-serif;box-shadow:0 3px 14px #173d4817;cursor:pointer}
          .session-checkout{border-color:#377e78;background:#377e78;color:#fff}
          .nxv-paywall[hidden]{display:none}
          .nxv-paywall{position:fixed;inset:0;z-index:20000;display:grid;place-items:center;padding:20px;background:rgba(15,31,38,.52);backdrop-filter:blur(6px)}
          .nxv-paywall-card{width:100%;max-width:440px;padding:30px 26px;border-radius:22px;background:#fff;color:#173d48;box-shadow:0 24px 60px rgba(0,0,0,.25);text-align:center;font-family:Manrope,Arial,sans-serif}
          .nxv-paywall-kicker{margin:0 0 8px;color:#377e78;font-size:11px;font-weight:800;letter-spacing:.12em}
          .nxv-paywall-card h2{margin:0 0 10px;font-size:24px;line-height:1.2}
          .nxv-paywall-card p{margin:0 0 20px;color:#526870;font-size:14px;line-height:1.5}
          .nxv-paywall-actions{display:flex;flex-direction:column;gap:10px}
          .nxv-paywall-btn{display:inline-flex;align-items:center;justify-content:center;padding:13px 18px;border-radius:999px;background:#377e78;color:#fff;font-weight:700;font-size:14px;text-decoration:none}
          .nxv-paywall-close{border:0;background:transparent;color:#526870;font:600 13px Manrope,Arial,sans-serif;cursor:pointer;padding:6px}
          @media(max-width:600px){.session-actions,.session-account{top:14px;right:14px}}
        </style>`,
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
