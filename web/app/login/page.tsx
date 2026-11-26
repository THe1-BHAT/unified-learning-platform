import type { Metadata } from "next";
import AuthExperience from "./auth-experience";

export const metadata: Metadata = {
  title: "Sign in | NxGenVarsity × Prerana",
  description: "Sign in or create your NxGenVarsity × Prerana learning account.",
};

export default function LoginPage() {
  return <AuthExperience />;
}
