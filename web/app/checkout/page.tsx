import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getPublishedCoursesWithAccess } from "../../lib/course-access";
import CheckoutExperience from "./checkout-experience";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout & Coupons | NxGenVarsity × Prerana",
  description: "Unlock unified access to Cybersecurity and Data Engineering & MLOps.",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    redirect("/login");
  }

  const { user, courses } = await getPublishedCoursesWithAccess();
  if (!user) {
    redirect("/login?next=/checkout");
  }

  const { course } = await searchParams;

  return (
    <CheckoutExperience
      userEmail={user.email ?? ""}
      userName={user.fullName}
      initialCourses={courses}
      initialCourseSlug={course ?? null}
    />
  );
}
