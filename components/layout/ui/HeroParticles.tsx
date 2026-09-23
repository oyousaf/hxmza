"use client";

import { useEffect, useRef } from "react";

type Particle = {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
  speed: number;
};

const PARTICLE_COUNT = 55;
const INTERACTION_RADIUS = 110;
const REPEL_STRENGTH = 2.2;
const RETURN_STRENGTH = 0.02;
const DAMPING = 0.9;
const MAX_DPR = 2;

// rgb triples matching the --color-brand / --color-textPrimary theme tokens
const LIGHT_MODE_COLOR = "51, 0, 102"; // textPrimary — used when the page is light
const DARK_MODE_COLOR = "209, 203, 193"; // brand beige — used when the page is dark

export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let rafId = 0;
    let running = false;
    let visible = true;
    const pointer = { x: -9999, y: -9999, active: false };

    const seed = () => {
      particles = Array.from({ length: PARTICLE_COUNT }, () => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        return {
          baseX: x,
          baseY: y,
          x,
          y,
          vx: 0,
          vy: 0,
          radius: 1.5 + Math.random() * 2,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 0.4,
        };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = (time: number) => {
      rafId = requestAnimationFrame(draw);
      if (!visible) return;

      ctx.clearRect(0, 0, width, height);
      const color = document.documentElement.classList.contains("dark")
        ? DARK_MODE_COLOR
        : LIGHT_MODE_COLOR;

      for (const p of particles) {
        // Gentle ambient float, independent of pointer interaction
        const floatX = Math.sin(time * 0.0006 * p.speed + p.phase) * 10;
        const floatY = Math.cos(time * 0.0005 * p.speed + p.phase) * 10;
        const targetX = p.baseX + floatX;
        const targetY = p.baseY + floatY;

        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < INTERACTION_RADIUS) {
            const force = (1 - dist / INTERACTION_RADIUS) * REPEL_STRENGTH;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        p.vx += (targetX - p.x) * RETURN_STRENGTH;
        p.vy += (targetY - p.y) * RETURN_STRENGTH;
        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, 0.55)`;
        ctx.fill();
      }
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      const color = document.documentElement.classList.contains("dark")
        ? DARK_MODE_COLOR
        : LIGHT_MODE_COLOR;
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.baseX, p.baseY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, 0.55)`;
        ctx.fill();
      }
    };

    const start = () => {
      if (running || prefersReducedMotion) return;
      running = true;
      rafId = requestAnimationFrame(draw);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    resize();
    if (prefersReducedMotion) {
      drawStatic();
    } else {
      start();
    }

    const handleResize = () => {
      resize();
      if (prefersReducedMotion) drawStatic();
    };
    window.addEventListener("resize", handleResize);

    // Pointer + touch interaction (pointer events unify mouse and touch)
    const setPointerFromEvent = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const clearPointer = () => {
      pointer.active = false;
    };

    canvas.addEventListener("pointermove", setPointerFromEvent);
    canvas.addEventListener("pointerdown", setPointerFromEvent);
    canvas.addEventListener("pointerleave", clearPointer);
    canvas.addEventListener("pointerup", clearPointer);
    canvas.addEventListener("pointercancel", clearPointer);

    // Pause the animation loop when the hero is off-screen or the tab is hidden
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && document.visibilityState === "visible") start();
        else stop();
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") stop();
      else if (visible) start();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      canvas.removeEventListener("pointermove", setPointerFromEvent);
      canvas.removeEventListener("pointerdown", setPointerFromEvent);
      canvas.removeEventListener("pointerleave", clearPointer);
      canvas.removeEventListener("pointerup", clearPointer);
      canvas.removeEventListener("pointercancel", clearPointer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full touch-none"
    />
  );
}
