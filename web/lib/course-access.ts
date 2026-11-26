import "server-only";

import { createSupabaseServerClient } from "./supabase/server";

export async function hasActiveCourseAccess(courseId: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return false;

  const { data, error } = await supabase.rpc("has_active_enrollment", { p_course_id: courseId });
  return !error && data === true;
}

export async function createProtectedDownloadUrl(courseSlug: string, storageKey: string) {
  if (!/^[a-z0-9-]{2,100}$/i.test(courseSlug)) throw new Error("Invalid course slug.");
  const normalizedKey = storageKey.replaceAll("\\", "/");
  const segments = normalizedKey.split("/");
  if (segments.length < 2 || segments.some((segment) => !segment || segment === "." || segment === "..")) {
    throw new Error("Invalid protected file key.");
  }
  if (segments[0].toLowerCase() !== courseSlug.toLowerCase()) {
    throw new Error("File does not belong to this course.");
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Sign in to download this file.");

  // Storage RLS independently verifies active enrollment for this object path.
  const { data, error } = await supabase.storage
    .from("course-downloads")
    .createSignedUrl(normalizedKey, 5 * 60);
  if (error || !data?.signedUrl) throw new Error("You do not have access to this file.");
  return data.signedUrl;
}
