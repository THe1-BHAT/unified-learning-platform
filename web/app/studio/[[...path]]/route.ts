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

  const relativePath = path.length ? path.join("/") : "index.html";
  const root = resolve(process.cwd(), "app", "dist");
  const file = resolve(root, relativePath);
  if (file !== root && !file.startsWith(`${root}${sep}`)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    let body: string | Buffer = await readFile(file);
    if (extname(file).toLowerCase() === ".html") {
      body = body.toString("utf8").replace(
        "</head>",
        `<base href="/studio/"><style>
          .profile,.site-footer a[href="#login"]{display:none!important}
          .session-account{position:fixed;z-index:10000;top:16px;right:20px;padding:9px 13px;border:1px solid #d6e2dd;border-radius:999px;background:#fff;color:#173d48;text-decoration:none;font:600 12px Manrope,Arial,sans-serif;box-shadow:0 3px 14px #173d4817}
          @media(max-width:600px){.session-account{top:14px;right:14px}}
        </style></head>`,
      ).replace(
        "</body>",
        `<a class="session-account" href="/dashboard">Account &amp; sign out</a></body>`,
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
