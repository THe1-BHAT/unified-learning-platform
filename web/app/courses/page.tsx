import Link from "next/link";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import LearningShell from "../learning-shell";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const supabase = await createSupabaseServerClient();
  const [{ data: { user } }, { data: courses }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("courses").select("id,slug,title,description,price_paise").eq("published", true).order("title"),
  ]);
  if (!user) {
    return (
      <main className="learning-main">
        <p className="learning-eyebrow">NXGENVARSITY LEARNING</p>
        <h1 className="learning-heading">Choose a course to explore.</h1>
        <p className="learning-lede">Create an account or sign in to save progress and continue your learning.</p>
        <section className="learning-course-grid" style={{ marginTop: 24 }}>
          {(courses ?? []).map((course, index) => <article className="learning-course-card" key={course.id}>
            <span className="learning-course-icon" aria-hidden="true">{index === 0 ? "⌘" : "▥"}</span>
            <h3>{course.title}</h3><p>{course.description}</p>
            <div className="learning-course-meta"><span>Preview lessons available</span><span>₹{(course.price_paise / 100).toLocaleString("en-IN")}</span></div>
            <Link className="learning-button" href={`/courses/${course.slug}`}>View course →</Link>
          </article>)}
        </section>
        <Link className="learning-button secondary" href="/login">Sign in or create an account</Link>
      </main>
    );
  }

  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
  return (
    <LearningShell active="courses" name={profile?.full_name ?? String(user.user_metadata.full_name ?? "")} email={user.email ?? ""}>
      <p className="learning-eyebrow">LEARNING CATALOG</p>
      <h1 className="learning-heading">Explore the courses.</h1>
      <p className="learning-lede">Every course starts with preview lessons. Enrolled learners can continue across all modules and track progress to their account.</p>
      <section className="learning-course-grid" style={{ marginTop: 24 }}>
        {(courses ?? []).map((course, index) => <article className="learning-course-card" key={course.id}>
          <div className="learning-course-top"><span className="learning-course-icon" aria-hidden="true">{index === 0 ? "⌘" : "▥"}</span><span className="learning-badge">Preview available</span></div>
          <h3>{course.title}</h3><p>{course.description}</p>
          <div className="learning-course-meta"><span>Lessons, exercises, knowledge checks</span><span>₹{(course.price_paise / 100).toLocaleString("en-IN")}</span></div>
          <Link className="learning-button" href={`/courses/${course.slug}`}>View course →</Link>
        </article>)}
      </section>
    </LearningShell>
  );
}
