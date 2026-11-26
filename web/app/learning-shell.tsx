import Link from "next/link";
import type { ReactNode } from "react";

type LearningShellProps = {
  children: ReactNode;
  active: "dashboard" | "courses";
  name: string;
  email: string;
};

export default function LearningShell({ children, active, name, email }: LearningShellProps) {
  const displayName = name.trim() || email;

  return (
    <div className="learning-app">
      <aside className="learning-sidebar">
        <Link className="learning-brand" href="/dashboard">
          <span className="learning-brand-mark" aria-hidden="true">N</span>
          <span>NxGenVarsity</span>
        </Link>
        <nav className="learning-nav" aria-label="Learner navigation">
          <Link href="/dashboard" aria-current={active === "dashboard" ? "page" : undefined}><span aria-hidden="true">⌂</span> Home</Link>
          <Link href="/courses" aria-current={active === "courses" ? "page" : undefined}><span aria-hidden="true">▤</span> Courses</Link>
          <Link href="/dashboard#rewards"><span aria-hidden="true">✦</span> Rewards</Link>
        </nav>
        <div className="learning-sidebar-note">Learn deeply. Practice responsibly. Build with purpose.</div>
        <form action="/auth/signout" method="post"><button className="learning-signout" type="submit">↪ Sign out</button></form>
      </aside>
      <div className="learning-content">
        <header className="learning-topbar">
          <span className="learning-topbar-label">Your learning space</span>
          <div className="learning-user" title={email}>
            <span className="learning-avatar" aria-hidden="true">{displayName[0]?.toUpperCase() ?? "L"}</span>
            <span>{displayName}</span>
          </div>
        </header>
        <main className="learning-main">{children}</main>
      </div>
    </div>
  );
}
