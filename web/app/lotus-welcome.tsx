"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import Image from "next/image";

const getWelcomeSeen = () => {
  try {
    return window.sessionStorage.getItem("nxv-lotus-welcome-seen") === "1";
  } catch {
    return false;
  }
};

const subscribeToWelcomeSeen = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
};

const getReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const subscribeToReducedMotion = (onChange: () => void) => {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
};

export default function LotusWelcome({ children }: { children: ReactNode }) {
  const welcomeSeen = useSyncExternalStore(subscribeToWelcomeSeen, getWelcomeSeen, () => false);
  const reducedMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotion, () => false);
  const skipWelcome = welcomeSeen || reducedMotion;
  const [stage, setStage] = useState<"blooming" | "leaving" | "hidden">("blooming");
  const [pageRevealed, setPageRevealed] = useState(false);
  const started = useRef(false);
  const revealTimer = useRef<number | undefined>(undefined);
  const hideTimer = useRef<number | undefined>(undefined);

  const reveal = useCallback(() => {
    if (started.current) return;
    started.current = true;
    if (revealTimer.current !== undefined) window.clearTimeout(revealTimer.current);
    try {
      window.sessionStorage.setItem("nxv-lotus-welcome-seen", "1");
    } catch {
      // Session storage is optional; the welcome can still be dismissed.
    }
    setPageRevealed(true);
    setStage("leaving");
    hideTimer.current = window.setTimeout(() => setStage("hidden"), 850);
  }, []);

  useEffect(() => {
    if (skipWelcome) return;
    try {
      window.sessionStorage.setItem("nxv-lotus-welcome-seen", "1");
    } catch {
      // Session storage is optional; the timed welcome still works.
    }
    revealTimer.current = window.setTimeout(reveal, 3200);
    return () => {
      if (revealTimer.current !== undefined) window.clearTimeout(revealTimer.current);
      if (hideTimer.current !== undefined) window.clearTimeout(hideTimer.current);
    };
  }, [reveal, skipWelcome]);

  return (
    <>
      <div className={`intro-content${pageRevealed || skipWelcome ? " is-revealed" : ""}`} aria-hidden={!pageRevealed && !skipWelcome} inert={!pageRevealed && !skipWelcome}>
        {children}
      </div>
      {!skipWelcome && stage !== "hidden" && (
        <section className={`lotus-splash${stage === "leaving" ? " is-leaving" : ""}`} role="dialog" aria-modal="true" aria-labelledby="lotus-welcome-title">
          <div className="lotus-splash-aurora" aria-hidden="true" />
          <div className="lotus-splash-brand" aria-label="NxGenVarsity and Prerana">
            <Image src="/brand/nxgenvarsity-logo.png" alt="NxGenVarsity" width={176} height={61} priority />
            <span className="lotus-splash-cross" aria-hidden="true">×</span>
            <span className="lotus-splash-prerana">
              <svg viewBox="0 0 40 35" aria-hidden="true">
                <path d="M20 27C11 22 9 14 14 7c4 3 6 7 6 12 0-7 3-12 8-15 4 7 1 16-8 23Z" />
                <path d="M7 18c4 0 8 3 13 9-7 1-12-2-15-7M33 18c-4 0-8 3-13 9 7 1 12-2 15-7M8 29h24" />
              </svg>
              <span>PRERANA</span>
            </span>
          </div>
          <div className="lotus-splash-center">
            <p className="lotus-splash-kicker">A NEW BEGINNING IS UNFOLDING</p>
            <div className="lotus-bloom-stage" aria-hidden="true">
              <span className="lotus-bloom-halo" />
              <span className="lotus-water-ring lotus-water-ring-one" />
              <span className="lotus-water-ring lotus-water-ring-two" />
              <Image className="lotus-bloom-gif" src="/brand/lotus-bloom.gif" alt="" width={433} height={660} unoptimized priority />
              <span className="lotus-bloom-spark lotus-spark-one" />
              <span className="lotus-bloom-spark lotus-spark-two" />
              <span className="lotus-bloom-spark lotus-spark-three" />
            </div>
            <div className="lotus-splash-copy">
              <h1 id="lotus-welcome-title">Welcome back, <em>User</em></h1>
              <p>Your next chapter is ready to bloom.</p>
            </div>
          </div>
          <button className="lotus-splash-skip" type="button" onClick={reveal}>Enter your learning space <span aria-hidden="true">→</span></button>
          <span className="lotus-splash-footnote">LEARN · PRACTICE · GROW</span>
        </section>
      )}
    </>
  );
}
