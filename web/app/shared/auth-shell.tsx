"use client";

import type { PointerEvent, ReactNode } from "react";

function moveBackgroundWithPointer(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    resetBackgroundPointer(event);
    return;
  }

  const bounds = event.currentTarget.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;

  const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 88;
  const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 68;
  event.currentTarget.style.setProperty("--pointer-x", `${x.toFixed(1)}px`);
  event.currentTarget.style.setProperty("--pointer-y", `${y.toFixed(1)}px`);
  event.currentTarget.style.setProperty("--pointer-x-reverse", `${(x * -0.65).toFixed(1)}px`);
  event.currentTarget.style.setProperty("--pointer-y-reverse", `${(y * -0.65).toFixed(1)}px`);
  event.currentTarget.style.setProperty("--pointer-glow-x", `${(event.clientX - bounds.left).toFixed(1)}px`);
  event.currentTarget.style.setProperty("--pointer-glow-y", `${(event.clientY - bounds.top).toFixed(1)}px`);
  event.currentTarget.style.setProperty("--pointer-glow-opacity", "1");
}

function resetBackgroundPointer(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--pointer-x", "0px");
  event.currentTarget.style.setProperty("--pointer-y", "0px");
  event.currentTarget.style.setProperty("--pointer-x-reverse", "0px");
  event.currentTarget.style.setProperty("--pointer-y-reverse", "0px");
  event.currentTarget.style.setProperty("--pointer-glow-x", "0px");
  event.currentTarget.style.setProperty("--pointer-glow-y", "0px");
  event.currentTarget.style.setProperty("--pointer-glow-opacity", "0");
}

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="auth-shell" onPointerMove={moveBackgroundWithPointer} onPointerLeave={resetBackgroundPointer}>
      <div className="auth-ambient auth-ambient-one" aria-hidden="true" />
      <div className="auth-ambient auth-ambient-two" aria-hidden="true" />
      <div className="auth-pointer-glow" aria-hidden="true" />
      <div className="auth-grid-glow" aria-hidden="true" />
      {children}
    </main>
  );
}
