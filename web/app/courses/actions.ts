"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../lib/supabase/server";

export async function markLessonComplete(formData: FormData) {
  const lessonId = String(formData.get("lessonId") ?? "");
  const courseSlug = String(formData.get("courseSlug") ?? "");
  const moduleSlug = String(formData.get("moduleSlug") ?? "");
  const lessonSlug = String(formData.get("lessonSlug") ?? "");
  const safeSegment = /^[a-z0-9-]{1,100}$/;
  if (!/^[0-9a-f-]{36}$/i.test(lessonId) || !safeSegment.test(courseSlug) || !safeSegment.test(moduleSlug) || !safeSegment.test(lessonSlug)) {
    redirect("/courses");
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/courses/${courseSlug}/${moduleSlug}/${lessonSlug}`)}`);

  const { error } = await supabase.rpc("mark_lesson_complete", { p_lesson_id: lessonId });
  const target = `/courses/${courseSlug}/${moduleSlug}/${lessonSlug}`;
  if (error) redirect(`${target}?progress=locked`);
  revalidatePath("/dashboard");
  revalidatePath(`/courses/${courseSlug}`);
  revalidatePath(target);
  redirect(`${target}?completed=1`);
}
