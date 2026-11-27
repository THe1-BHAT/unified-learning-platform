import "server-only";

import { cookies } from "next/headers";
import { createSupabaseServerClient } from "./supabase/server";

export type CourseWithAccess = {
  id: string;
  slug: string;
  title: string;
  description: string;
  pricePaise: number;
  enrolled: boolean;
  enrollmentStatus: string | null;
  enrollmentSource: string | null;
  accessGrantedAt: string | null;
};

/** Formats an integer paise amount into Indian Rupees (e.g. 250000 -> "₹2,500"). */
export function formatInrFromPaise(pricePaise: number): string {
  const rupees = pricePaise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: pricePaise % 100 === 0 ? 0 : 2,
  }).format(rupees);
}

/** Fetches published courses along with the signed-in learner's enrollment state. */
export async function getPublishedCoursesWithAccess(): Promise<{
  user: { id: string; email: string | null; fullName: string | null } | null;
  courses: CourseWithAccess[];
}> {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { user: null, courses: [] };
  }

  const cookieStore = await cookies();
  const demoSubscribed = cookieStore.get("nxv-subscribed-uid")?.value === user.id;

  const [{ data: courseRows }, { data: enrollmentRows }] = await Promise.all([
    supabase
      .from("courses")
      .select("id, slug, title, description, price_paise")
      .eq("published", true)
      .order("created_at", { ascending: true }),
    supabase
      .from("enrollments")
      .select("course_id, status, source, access_granted_at")
      .eq("user_id", user.id),
  ]);

  const enrollmentsByCourse = new Map(
    (enrollmentRows ?? []).map((row) => [row.course_id as string, row]),
  );

  const courses: CourseWithAccess[] = (courseRows ?? []).map((course) => {
    const enrollment = enrollmentsByCourse.get(course.id as string);
    const active = enrollment?.status === "active" || demoSubscribed;
    return {
      id: course.id as string,
      slug: course.slug as string,
      title: course.title as string,
      description: (course.description as string) ?? "",
      pricePaise: Number(course.price_paise ?? 0),
      enrolled: active,
      enrollmentStatus: active ? "active" : ((enrollment?.status as string | undefined) ?? null),
      enrollmentSource: (enrollment?.source as string | undefined) ?? (demoSubscribed ? "demo" : null),
      accessGrantedAt: (enrollment?.access_granted_at as string | undefined) ?? null,
    };
  });

  const fullName =
    typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : null;

  return {
    user: { id: user.id, email: user.email ?? null, fullName },
    courses,
  };
}

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
