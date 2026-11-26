import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);

  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return json({ error: "Sign in to redeem a coupon." }, 401);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  if (!body || typeof body !== "object") return json({ error: "Invalid request." }, 400);

  const { courseSlug, code } = body as { courseSlug?: unknown; code?: unknown };
  if (typeof courseSlug !== "string" || !/^[a-z0-9-]{2,100}$/i.test(courseSlug)
      || typeof code !== "string" || code.trim().length < 4 || code.trim().length > 128) {
    return json({ error: "Enter a valid course and coupon code." }, 400);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !anonKey) return json({ error: "Redemption is temporarily unavailable." }, 503);

  // Use the caller's JWT for both identity validation and RPC so auth.uid() in
  // PostgreSQL is the signed-in learner. Never use a service role for redemption.
  const token = authorization.slice("Bearer ".length);
  const supabase = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return json({ error: "Your session is invalid. Sign in again." }, 401);

  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!serviceRoleKey) return json({ error: "Redemption is temporarily unavailable." }, 503);
  const limiter = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: allowed, error: limitError } = await limiter.rpc("consume_coupon_redemption_attempt", {
    p_user_id: user.id,
  });
  if (limitError) return json({ error: "Redemption is temporarily unavailable." }, 503);
  if (allowed !== true) return json({ error: "Too many attempts. Try again in 15 minutes." }, 429);

  const { data, error } = await supabase.rpc("redeem_course_coupon", {
    p_course_slug: courseSlug.toLowerCase(),
    p_code: code.trim(),
  });

  if (error) {
    // Do not return DB details or disclose whether a code exists/is exhausted.
    const status = error.code === "28000" ? 401 : 422;
    return json({ error: status === 401 ? "Sign in to redeem a coupon." : "This coupon cannot be used for this course." }, status);
  }

  return json({ enrollment: Array.isArray(data) ? data[0] : data }, 200);
});

function json(value: unknown, status: number) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}
