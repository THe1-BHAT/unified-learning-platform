import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "../../../lib/supabase/server";
import LearningShell from "../../learning-shell";
import RedeemCoupon from "../redeem-coupon";
import CourseQuiz from "./quiz";

export const dynamic = "force-dynamic";

type Module = { id: string; slug: string; title: string; position: number };
type Lesson = { id: string; module_id: string; slug: string; title: string; position: number; is_preview: boolean };
type Quiz = { id: string; module_id: string; title: string };

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const [{ data: { user } }, { data: course }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("courses").select("id,slug,title,description,price_paise").eq("slug", slug).eq("published", true).maybeSingle(),
  ]);
  if (!course) notFound();

  const { data: enrollment } = user
    ? await supabase.from("enrollments").select("id,status").eq("user_id", user.id).eq("course_id", course.id).eq("status", "active").maybeSingle()
    : { data: null };
  const [moduleResult, profileResult] = await Promise.all([
    supabase.from("course_modules").select("id,slug,title,position").eq("course_id", course.id).order("position"),
    user ? supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle() : Promise.resolve({ data: null }),
  ]);
  const modules = (moduleResult.data ?? []) as Module[];
  const moduleIds = modules.map((module) => module.id);
  const [lessonResult, progressResult, quizResult] = await Promise.all([
    moduleIds.length ? supabase.from("lessons").select("id,module_id,slug,title,position,is_preview").in("module_id", moduleIds).order("position") : Promise.resolve({ data: [] }),
    user ? supabase.from("lesson_progress").select("lesson_id").eq("user_id", user.id).not("completed_at", "is", null) : Promise.resolve({ data: [] }),
    enrollment && moduleIds.length ? supabase.from("quizzes").select("id,module_id,title").in("module_id", moduleIds) : Promise.resolve({ data: [] }),
  ]);
  const lessons = (lessonResult.data ?? []) as Lesson[];
  const completedIds = new Set((progressResult.data ?? []).map((row) => row.lesson_id));
  const quizzes = (quizResult.data ?? []) as Quiz[];
  const fullName = profileResult.data?.full_name ?? String(user?.user_metadata.full_name ?? "");

  const content = (
    <>
      <p className="learning-eyebrow">COURSE OVERVIEW</p>
      <h1 className="learning-heading">{course.title}</h1>
      <p className="learning-lede">{course.description} Preview the first lesson in each module. Enroll to unlock the complete course and account-synced milestones.</p>
      <div className="learning-wallet">
        <div><strong>{enrollment ? "Full course access active" : `Course access · ₹${(course.price_paise / 100).toLocaleString("en-IN")}`}</strong><br /><span>{enrollment ? "Your lesson completions and quiz attempts save to your account." : "Sign in and redeem a valid course access code to unlock the full curriculum."}</span></div>
        <Link className="learning-button secondary" href={user ? "/dashboard" : "/login"}>{user ? "My learning home" : "Sign in"}</Link>
      </div>
      {!enrollment && user && <RedeemCoupon courseSlug={course.slug} />}
      <div className="learning-section-heading"><div><h2>Course modules</h2><p>{enrollment ? "All course lessons are unlocked." : "One preview lesson is available in each module."}</p></div></div>
      <div className="learning-module-list">
        {modules.map((module, index) => {
          const moduleLessons = lessons.filter((lesson) => lesson.module_id === module.id);
          const moduleQuiz = quizzes.find((quiz) => quiz.module_id === module.id);
          return (
            <section className="learning-module" key={module.id}>
              <p className="learning-eyebrow">MODULE {String(index + 1).padStart(2, "0")}</p>
              <h2>{module.title}</h2>
              {moduleLessons.length ? (
                <ul className="learning-lesson-list">{moduleLessons.map((lesson) => (
                  <li key={lesson.id}>
                    <Link href={`/courses/${course.slug}/${module.slug}/${lesson.slug}`}>
                      <span>{lesson.title}</span>
                      <span className="learning-lesson-state">{completedIds.has(lesson.id) ? "Completed ✓" : enrollment ? "Open lesson →" : "Preview →"}</span>
                    </Link>
                  </li>
                ))}</ul>
              ) : <p className="learning-locked">{enrollment ? "No lessons have been published in this module yet." : "The rest of this module unlocks with course access."}</p>}
              {!enrollment && <p className="learning-message">{moduleLessons.length ? "More lessons unlock when you enroll." : "Course access required for this module."}</p>}
              {moduleQuiz && <CourseQuiz quizId={moduleQuiz.id} title={`${module.title} knowledge check`} />}
            </section>
          );
        })}
      </div>
    </>
  );

  if (!user) return <main className="learning-main">{content}</main>;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) redirect("/login");
  return <LearningShell active="courses" name={fullName} email={user.email ?? ""}>{content}</LearningShell>;
}
