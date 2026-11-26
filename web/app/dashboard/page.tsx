import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import LearningShell from "../learning-shell";
import { setLeaderboardVisibility } from "./actions";

export const dynamic = "force-dynamic";

type Course = { id: string; slug: string; title: string; description: string; price_paise: number };
type Module = { id: string; course_id: string; title: string; position: number };
type Lesson = { id: string; module_id: string; position: number };

export default async function DashboardPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) redirect("/login");
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=%2Fdashboard");

  const [courseResult, walletResult, profileResult, leaderboardResult, progressResult, enrollmentResult] = await Promise.all([
    supabase.from("courses").select("id,slug,title,description,price_paise").eq("published", true).order("title"),
    supabase.from("coin_wallets").select("balance").eq("user_id", user.id).maybeSingle(),
    supabase.from("profiles").select("full_name,show_on_leaderboard").eq("id", user.id).maybeSingle(),
    supabase.rpc("get_coin_leaderboard", { p_limit: 5, p_offset: 0 }),
    supabase.from("lesson_progress").select("lesson_id").eq("user_id", user.id).not("completed_at", "is", null),
    supabase.from("enrollments").select("course_id,status").eq("user_id", user.id).eq("status", "active"),
  ]);
  const courses = (courseResult.data ?? []) as Course[];
  const courseIds = courses.map((course) => course.id);
  const activeCourseIds = new Set((enrollmentResult.data ?? []).map((row) => row.course_id));
  const completedLessonIds = new Set((progressResult.data ?? []).map((row) => row.lesson_id));

  let modules: Module[] = [];
  let lessons: Lesson[] = [];
  if (courseIds.length) {
    const moduleResult = await supabase.from("course_modules").select("id,course_id,title,position").in("course_id", courseIds).order("position");
    modules = (moduleResult.data ?? []) as Module[];
    if (modules.length) {
      const lessonResult = await supabase.from("lessons").select("id,module_id,position").in("module_id", modules.map((module) => module.id));
      lessons = (lessonResult.data ?? []) as Lesson[];
    }
  }

  const fullName = profileResult.data?.full_name || String(user.user_metadata.full_name ?? "");
  const displayName = fullName.trim() || user.email || "Learner";
  const leaderboard = (leaderboardResult.data ?? []) as Array<{ user_id: string; display_name: string; coins: number | string; rank: number }>;
  const completedCount = lessons.filter((lesson) => completedLessonIds.has(lesson.id)).length;

  return (
    <LearningShell active="dashboard" name={displayName} email={user.email ?? ""}>
      <p className="learning-eyebrow">NXGENVARSITY × PRERANA</p>
      <h1 className="learning-heading">Good to have you here, {displayName.split(" ")[0]}.</h1>
      <p className="learning-lede">Your courses, real account progress, and learning rewards live here. Pick up a preview or continue a course you have access to.</p>

      <section className="learning-hero" aria-label="Learning overview">
        <p className="learning-eyebrow">YOUR LEARNING SPACE</p>
        <h2 className="learning-heading">Build skills that work in the real world.</h2>
        <p className="learning-lede">Move between cybersecurity and data engineering with structured lessons, checks for understanding, and practical exercises.</p>
        <div className="learning-stats">
          <div className="learning-stat"><strong>{courses.length}</strong><span>Courses</span></div>
          <div className="learning-stat"><strong>{completedCount}</strong><span>Lessons completed</span></div>
          <div className="learning-stat"><strong>{Number(walletResult.data?.balance ?? 0).toLocaleString("en-IN")}</strong><span>Learning coins</span></div>
        </div>
      </section>

      <div className="learning-section-heading">
        <div><h2>Your courses</h2><p>Open a course to see modules, available lessons, and access options.</p></div>
        <Link className="learning-inline-link" href="/courses">Browse all courses →</Link>
      </div>
      <section className="learning-course-grid" id="courses" aria-label="Your courses">
        {courses.map((course, index) => {
          const courseModules = modules.filter((module) => module.course_id === course.id);
          const courseLessons = lessons.filter((lesson) => courseModules.some((module) => module.id === lesson.module_id));
          const courseCompleted = courseLessons.filter((lesson) => completedLessonIds.has(lesson.id)).length;
          const percent = courseLessons.length ? Math.round((courseCompleted / courseLessons.length) * 100) : 0;
          const enrolled = activeCourseIds.has(course.id);
          return (
            <article className="learning-course-card" key={course.id}>
              <div className="learning-course-top">
                <span className="learning-course-icon" aria-hidden="true">{index === 0 ? "⌘" : "▥"}</span>
                <span className="learning-badge">{enrolled ? "Enrolled" : "Preview available"}</span>
              </div>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="learning-course-meta"><span>{courseModules.length} modules · {courseLessons.length} available lessons</span><span>{enrolled ? `${percent}% complete` : `₹${(course.price_paise / 100).toLocaleString("en-IN")}`}</span></div>
              <div className="learning-progress-track" aria-label={`${percent}% complete`}><span style={{ width: `${percent}%` }} /></div>
              <Link className="learning-button" href={`/courses/${course.slug}`}>{enrolled ? "Continue course" : "Explore course"} <span aria-hidden="true">→</span></Link>
            </article>
          );
        })}
      </section>

      <section className="learning-wallet" id="rewards">
        <div><strong>{Number(walletResult.data?.balance ?? 0).toLocaleString("en-IN")} learning coins</strong><br /><span>Earn coins from course milestones and knowledge checks.</span></div>
        <Link href="#leaderboard" className="learning-inline-link">See the community →</Link>
      </section>

      <section id="leaderboard">
        <div className="learning-section-heading"><div><h2>Learning community</h2><p>Only learners who opt in appear here.</p></div></div>
        {profileResult.data?.show_on_leaderboard ? (
          <ol className="learning-module-list">{leaderboard.map((entry) => <li className="learning-module" key={entry.user_id}><strong>#{entry.rank} {entry.display_name}{entry.user_id === user.id ? " (you)" : ""}</strong><span> · {Number(entry.coins).toLocaleString("en-IN")} coins</span></li>)}</ol>
        ) : (
          <form action={setLeaderboardVisibility}>
            <input type="hidden" name="visible" value="true" />
            <button className="learning-button secondary" type="submit">Join the leaderboard</button>
          </form>
        )}
      </section>
    </LearningShell>
  );
}
