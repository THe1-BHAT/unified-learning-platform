"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number; age: number; force: number };

export default function CursorFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isTouch = window.matchMedia("(pointer: coarse)");
    if (reduceMotion.matches || isTouch.matches) return;

    const points: Point[] = [];
    let frame = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let previous: Point | null = null;

    const resize = () => {
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const next = { x: event.clientX, y: event.clientY, age: 0, force: 0.5 };
      if (previous) {
        const distance = Math.hypot(next.x - previous.x, next.y - previous.y);
        next.force = Math.min(1, 0.32 + distance / 46);
        const steps = Math.min(4, Math.floor(distance / 18));
        for (let i = 1; i < steps; i += 1) {
          points.push({
            x: previous.x + (next.x - previous.x) * i / steps,
            y: previous.y + (next.y - previous.y) * i / steps,
            age: 0,
            force: next.force,
          });
        }
      }
      points.push(next);
      if (points.length > 90) points.splice(0, points.length - 90);
      previous = next;
      if (!frame) frame = window.requestAnimationFrame(draw);
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      for (const point of points) point.age += 1;
      while (points[0] && points[0].age > 82) points.shift();

      if (points.length > 2) {
        const colors = ["55,143,129", "117,151,190", "194,151,113"];
        for (let strand = 0; strand < colors.length; strand += 1) {
          context.beginPath();
          for (let i = 0; i < points.length; i += 1) {
            const point = points[i];
            const fade = Math.max(0, 1 - point.age / 82);
            const wave = Math.sin(i * 0.31 + strand * 2.1) * (5 + point.force * 7);
            const x = point.x + wave * (strand - 1);
            const y = point.y + Math.cos(i * 0.23 + strand * 1.7) * 4 * (strand - 1);
            if (i === 0) context.moveTo(x, y);
            else context.lineTo(x, y);
            if (i === points.length - 1) {
              context.strokeStyle = `rgba(${colors[strand]},${0.22 * fade})`;
              context.lineWidth = 1.1 + point.force * 1.6;
              context.lineCap = "round";
              context.lineJoin = "round";
              context.stroke();
            }
          }
        }

        const last = points[points.length - 1];
        const glow = context.createRadialGradient(last.x, last.y, 0, last.x, last.y, 34);
        glow.addColorStop(0, "rgba(82,157,140,0.12)");
        glow.addColorStop(1, "rgba(82,157,140,0)");
        context.fillStyle = glow;
        context.beginPath();
        context.arc(last.x, last.y, 34, 0, Math.PI * 2);
        context.fill();
      }
      frame = points.length ? window.requestAnimationFrame(draw) : 0;
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="cursor-flow" aria-hidden="true" />;
}
