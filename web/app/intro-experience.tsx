"use client";

import { useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import LearningIllustration from "./login/learning-illustration";
import CursorFlow from "./cursor-flow";
import LotusWelcome from "./lotus-welcome";

const highlights = [
  { mark: "01", title: "Learn with direction", body: "Follow clear, guided learning paths that turn big technology topics into manageable steps." },
  { mark: "02", title: "Practice by doing", body: "Build confidence with hands-on exercises, projects, and challenges along the way." },
  { mark: "03", title: "Grow your next step", body: "Connect what you learn to career paths, a portfolio, and a community that keeps you moving." },
];

export default function IntroExperience() {
  const router = useRouter();
  const [aboutOpen, setAboutOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<"about" | "login" | null>(null);

  function toggleAbout() {
    const opening = !aboutOpen;
    setAboutOpen(opening);
    setActiveNav(opening ? "about" : null);
    if (opening) {
      window.setTimeout(() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
    }
  }

  function handleLoginClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setActiveNav("login");
    window.setTimeout(() => router.push("/login"), 240);
  }

  return (
    <LotusWelcome>
      <main className="intro-page">
        <CursorFlow />
        <div className="intro-glow intro-glow-a" aria-hidden="true" />
        <div className="intro-glow intro-glow-b" aria-hidden="true" />
        <header className="intro-header">
          <Link className="intro-brand" href="/" aria-label="NxGenVarsity and Prerana home">
            <Image src="/brand/nxgenvarsity-logo.png" alt="NxGenVarsity" width={176} height={61} priority />
            <span aria-hidden="true">×</span><strong>PRERANA</strong>
          </Link>
          <nav className={`intro-nav${aboutOpen ? " is-about-open" : ""}${activeNav === "login" ? " is-login-selected" : ""}`} aria-label="Main navigation">
            <span className="intro-nav-highlight" aria-hidden="true" />
            <button className="intro-about-button" type="button" aria-controls="about" aria-expanded={aboutOpen} onClick={toggleAbout}>About</button>
            <Link className="intro-login" href="/login" onClick={handleLoginClick}>Log in</Link>
          </nav>
        </header>

        <section className="intro-hero" aria-labelledby="intro-title">
          <div className="intro-copy">
            <div className="intro-kicker"><span>✦</span> LEARN <i /> PRACTICE <i /> GROW</div>
            <h1 id="intro-title">Together towards a <em>Smarter</em> Tomorrow</h1>
            <p className="intro-lede">Your next idea starts here. Explore technology, build useful skills, and find your place in a community learning for what comes next.</p>
            <div className="intro-actions">
              <Link className="intro-primary" href="/login?mode=signup">Get started <span aria-hidden="true">→</span></Link>
              <Link className="intro-secondary" href="/login">I already have an account</Link>
            </div>
            <p className="intro-note">A learning journey by NxGenVarsity × Prerana</p>
          </div>
          <div className="intro-art" aria-label="An illustration representing learning and technology">
            <div className="art-caption"><span>YOUR JOURNEY</span><strong>Curiosity in. Possibility out.</strong></div>
            <LearningIllustration />
          </div>
        </section>

        <section id="about" className={`intro-details${aboutOpen ? " is-open" : ""}`} aria-hidden={!aboutOpen}>
          <div className="intro-details-inner">
            <div className="intro-about">
              <div className="intro-section-heading"><span>MADE FOR YOUR NEXT CHAPTER</span><h2>Room to explore.<br /><em>Tools to move forward.</em></h2></div>
              <p>Whether you are just getting started or ready to go deeper, find a welcoming place to learn technology through a mix of clear guidance, real practice, and shared momentum.</p>
            </div>
            <section className="intro-highlights" aria-label="How the platform helps you grow">
              {highlights.map((item) => <article className="intro-highlight" key={item.mark}><span>{item.mark}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}
            </section>
          </div>
        </section>
        <footer className="intro-footer"><span>NXGENVARSITY × PRERANA</span><span>Learn deeply. Build with purpose.</span><Link href="/login">Join the learning community ↗</Link></footer>
      </main>
    </LotusWelcome>
  );
}
