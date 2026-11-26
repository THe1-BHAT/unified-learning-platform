import { createBrowserClient } from "@supabase/ssr";

type RememberOption = { rememberMe?: boolean };

function readBrowserCookies() {
  if (typeof document === "undefined" || !document.cookie) return [];
  return document.cookie.split(";").flatMap((part) => {
    const separator = part.indexOf("=");
    if (separator < 0) return [];
    const name = part.slice(0, separator).trim();
    const rawValue = part.slice(separator + 1);
    try {
      return [{ name, value: decodeURIComponent(rawValue) }];
    } catch {
      return [{ name, value: rawValue }];
    }
  });
}

function writeBrowserCookie(name: string, value: string, options: Record<string, unknown>, rememberMe: boolean) {
  const parts = [`${name}=${encodeURIComponent(value)}`, `Path=${String(options.path ?? "/")}`];
  const sameSite = options.sameSite;
  if (typeof sameSite === "string") parts.push(`SameSite=${sameSite[0].toUpperCase()}${sameSite.slice(1)}`);
  if (typeof options.domain === "string") parts.push(`Domain=${options.domain}`);
  if (options.maxAge === 0) parts.push("Max-Age=0");
  else if (rememberMe) parts.push(`Max-Age=${400 * 24 * 60 * 60}`);
  if (typeof window !== "undefined" && window.location.protocol === "https:") parts.push("Secure");
  document.cookie = parts.join("; ");
}

export function setRememberPreference(rememberMe: boolean) {
  if (typeof document === "undefined") return;
  writeBrowserCookie("nxv-remember", rememberMe ? "1" : "0", { path: "/", maxAge: rememberMe ? 400 * 24 * 60 * 60 : 0, sameSite: "lax" }, rememberMe);
}

export function createSupabaseBrowserClient({ rememberMe = false }: RememberOption = {}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error("Supabase public environment variables are required.");
  return createBrowserClient(url, anonKey, {
    isSingleton: false,
    cookies: {
      getAll: readBrowserCookies,
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => writeBrowserCookie(name, value, options, rememberMe));
      },
    },
  });
}
