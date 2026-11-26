import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "../../../../../lib/supabase/server";
import LearningShell from "../../../../learning-shell";
import { markLessonComplete } from "../../../actions";

export const dynamic = "force-dynamic";

type Content = { body?: string; principle?: string; exercise?: string };

export default async function LessonPage({ params, searchParams }: {
  params: Promise<{ slug: string; module: string; lesson: string }>;
  searchParams: Promise<{ completed?: string; progress?: string }>;
}) {
  const [{ slug, module: moduleSlug, lesson: lessonSlug }, query] = await Promise.all([params, searchParams]);
  const supabase = await createSupabaseServerClient();
  const [{ data: { user } }, { data: course }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("courses").select("id,slug,title").eq("slug", slug).eq("published", true).maybeSingle(),
  ]);
  if (!course) notFound();
  const { data: module } = await supabase.from("course_modules").select("id,title").eq("course_id", course.id).eq("slug", moduleSlug).maybeSingle();
  if (!module) notFound();
  const { data: lesson } = await supabase.from("lessons").select("id,slug,title,content,is_preview,position").eq("module_id", module.id).eq("slug", lessonSlug).maybeSingle();
  if (!lesson) notFound();
  const [{ data: progress }, { data: profile }] = await Promise.all([
    user ? supabase.from("lesson_progress").select("completed_at").eq("user_id", user.id).eq("lesson_id", lesson.id).maybeSingle() : Promise.resolve({ data: null }),
    user ? supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle() : Promise.resolve({ data: null }),
  ]);
  const completed = Boolean(progress?.completed_at);
  const content = (lesson.content ?? {}) as Content;
  const fullName = profile?.full_name ?? String(user?.user_metadata.full_name ?? "");

  const lessonContent = (
    <>
      <p className="learning-eyebrow"><Link href={`/courses/${course.slug}`}>{course.title}</Link> / {module.title}</p>
      <h1 className="learning-heading">{lesson.title}</h1>
      <p className="learning-lede">{lesson.is_preview ? "Course preview lesson" : "Your enrolled course lesson"}</p>
      <article className="learning-article">
        <div className="learning-article-body" dangerouslySetInnerHTML={{ __html: content.body ?? "" }} />
        {content.principle && <aside className="learning-note"><strong>Key idea</strong><br />{content.principle}</aside>}
        {content.exercise && <section><h2>Put it into practice</h2><p className="learning-lede">{content.exercise}</p></section>}
        {query.progress === "locked" && <p className="learning-message" role="alert">This lesson could not be marked complete. Check course access and try again.</p>}
        {user ? (
          <form action={markLessonComplete}>
            <input type="hidden" name="lessonId" value={lesson.id} />
            <input type="hidden" name="courseSlug" value={course.slug} />
            <input type="hidden" name="moduleSlug" value={moduleSlug} />
            <input type="hidden" name="lessonSlug" value={lessonSlug} />
            <button className="learning-button" type="submit">{completed ? "Completed ✓" : "Mark lesson complete"}</button>
            {query.completed === "1" && <p className="learning-message" role="status">Progress saved to your account.</p>}
          </form>
        ) : (
          <Link className="learning-button" href={`/login?next=${encodeURIComponent(`/courses/${course.slug}/${moduleSlug}/${lessonSlug}`)}`}>Sign in to save progress →</Link>
        )}
        <p><Link className="learning-inline-link" href={`/courses/${course.slug}`}>Back to course modules</Link></p>
      </article>
    </>
  );

  if (!user) return <main className="learning-main">{lessonContent}</main>;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) redirect("/login");
  return <LearningShell active="courses" name={fullName} email={user.email ?? ""}>{lessonContent}</LearningShell>;
}
