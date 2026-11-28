import type { Metadata } from "next";
import IntroExperience from "./intro-experience";
import "./login/login.css";
import "./intro.css";

export const metadata: Metadata = {
  title: "Learn, practice, grow | NxGenVarsity × Prerana",
  description: "Explore technology, build practical skills, and find your next step with NxGenVarsity × Prerana.",
};

export default function HomePage() {
  return <IntroExperience />;
}
